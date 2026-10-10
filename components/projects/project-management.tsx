"use client";

import { FolderKanban, Plus, RefreshCw, UsersRound } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { useOrganizations } from "@/components/organizations/organization-provider";
import { Button } from "@/components/ui/button";
import {
  getOrganizationMembers,
  type OrganizationMemberWithUser,
} from "@/lib/api/organizations";
import {
  addProjectMember,
  createProject,
  createSprint,
  getProjectMembers,
  getProjects,
  type Project,
  type ProjectMemberWithUser,
  type ProjectPagination,
  type Sprint,
} from "@/lib/api/projects";
import { getAllTeamsInOrganization, type Team } from "@/lib/api/teams";

const PAGE_SIZE = 10;

const inputClassName =
  "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function ProjectManagement() {
  const { selectedOrganization } = useOrganizations();

  return (
    <ProjectManagementForOrganization
      key={selectedOrganization?.id ?? "no-organization"}
      organization={selectedOrganization}
    />
  );
}

function ProjectManagementForOrganization({
  organization,
}: {
  organization: { id: string; name: string } | null;
}) {
  const [reloadKey, setReloadKey] = useState(0);
  const [createdProjectName, setCreatedProjectName] = useState<string | null>(
    null,
  );

  function reload() {
    setReloadKey((currentKey) => currentKey + 1);
  }

  function handleProjectCreated(name: string) {
    setCreatedProjectName(name);
    reload();
  }

  return (
    <ProjectManagementContent
      key={`${organization?.id ?? "no-organization"}-${reloadKey}`}
      organization={organization}
      createdProjectName={createdProjectName}
      onReload={reload}
      onProjectCreated={handleProjectCreated}
    />
  );
}

function ProjectManagementContent({
  organization,
  createdProjectName,
  onReload,
  onProjectCreated,
}: {
  organization: { id: string; name: string } | null;
  createdProjectName: string | null;
  onReload: () => void;
  onProjectCreated: (name: string) => void;
}) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(Boolean(organization));
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [organizationMembers, setOrganizationMembers] = useState<
    OrganizationMemberWithUser[]
  >([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(
    Boolean(organization),
  );
  const [membersError, setMembersError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<ProjectPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingProjects, setIsLoadingProjects] = useState(
    Boolean(organization),
  );
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const organizationId = organization?.id ?? null;

  useEffect(() => {
    let isCurrent = true;

    if (!organizationId) {
      setTeams([]);
      setTeamsError(null);
      setIsLoadingTeams(false);
      return () => {
        isCurrent = false;
      };
    }

    setIsLoadingTeams(true);
    setTeamsError(null);

    getAllTeamsInOrganization(organizationId)
      .then((result) => {
        if (isCurrent) {
          setTeams(result);
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setTeamsError(
            errorMessage(error, "Teams could not be loaded. Please try again."),
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoadingTeams(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [organizationId]);

  useEffect(() => {
    let isCurrent = true;

    if (!organizationId) {
      setOrganizationMembers([]);
      setMembersError(null);
      setIsLoadingMembers(false);
      return () => {
        isCurrent = false;
      };
    }

    setIsLoadingMembers(true);
    setMembersError(null);

    getOrganizationMembers(organizationId)
      .then((result) => {
        if (isCurrent) {
          setOrganizationMembers(result);
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setMembersError(
            errorMessage(
              error,
              "Organization members could not be loaded. Please try again.",
            ),
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoadingMembers(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [organizationId]);

  useEffect(() => {
    let isCurrent = true;

    if (!organizationId) {
      setProjects([]);
      setPagination(null);
      setProjectsError(null);
      setIsLoadingProjects(false);
      return () => {
        isCurrent = false;
      };
    }

    setIsLoadingProjects(true);
    setProjectsError(null);

    getProjects(organizationId, page, PAGE_SIZE)
      .then((result) => {
        if (isCurrent) {
          setProjects(result.projects);
          setPagination(result.pagination);
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setProjectsError(
            errorMessage(
              error,
              "Projects could not be loaded. Please try again.",
            ),
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoadingProjects(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [organizationId, page]);

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("projectName") ?? "").trim();
    const teamId = String(formData.get("teamId") ?? "");
    const selectedTeam = teams.find((team) => team.id === teamId);

    if (!name) {
      setCreateError("Enter a project name.");
      return;
    }
    if (!selectedTeam) {
      setCreateError("Select a team for this project.");
      return;
    }

    setIsCreating(true);
    try {
      await createProject(name, selectedTeam.id);
      form.reset();
      setPage(1);
      onProjectCreated(name);
    } catch (error) {
      setCreateError(
        errorMessage(
          error,
          "The project could not be created. Please try again.",
        ),
      );
    } finally {
      setIsCreating(false);
    }
  }

  const totalPages = Math.max(pagination?.totalPages ?? 0, 1);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description={
          organization
            ? `Create and manage projects in ${organization.name}.`
            : "Select or create an organization before managing projects."
        }
      />

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section
          aria-labelledby="create-project-heading"
          className="rounded-xl border bg-card p-5 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2
                id="create-project-heading"
                className="font-semibold tracking-tight"
              >
                Create a project
              </h2>
              <p className="text-sm text-muted-foreground">
                {organization
                  ? `Choose a team in ${organization.name}.`
                  : "Select an organization to create a project."}
              </p>
            </div>
          </div>

          {teamsError ? (
            <div
              role="alert"
              className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-destructive"
            >
              <p>{teamsError}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onReload}
              >
                Retry
              </Button>
            </div>
          ) : null}

          {isLoadingTeams ? (
            <output className="text-sm text-muted-foreground">
              Loading teams...
            </output>
          ) : teamsError ? null : teams.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              Create a team before adding a project.
            </p>
          ) : (
            <form className="space-y-4" onSubmit={handleCreateProject}>
              <div className="space-y-2">
                <label htmlFor="projectName" className="text-sm font-medium">
                  Project name
                </label>
                <input
                  id="projectName"
                  name="projectName"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Website redesign"
                  className={inputClassName}
                  required
                  disabled={!organization || isCreating || teamsError !== null}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="projectTeam" className="text-sm font-medium">
                  Team
                </label>
                <select
                  id="projectTeam"
                  name="teamId"
                  className={inputClassName}
                  required
                  defaultValue=""
                  disabled={
                    !organization ||
                    isCreating ||
                    isLoadingTeams ||
                    teamsError !== null
                  }
                >
                  <option value="" disabled>
                    Select a team
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              {createError ? (
                <p role="alert" className="text-sm text-destructive">
                  {createError}
                </p>
              ) : null}
              {createdProjectName ? (
                <output className="text-sm text-primary">
                  {createdProjectName} was created successfully.
                </output>
              ) : null}
              <Button
                type="submit"
                disabled={
                  !organization ||
                  isCreating ||
                  isLoadingTeams ||
                  teamsError !== null
                }
              >
                <Plus aria-hidden="true" />
                {isCreating ? "Creating..." : "Create project"}
              </Button>
            </form>
          )}
        </section>

        <section
          aria-labelledby="projects-list-heading"
          aria-busy={isLoadingProjects}
          className="rounded-xl border bg-card p-5 sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <FolderKanban aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2
                  id="projects-list-heading"
                  className="font-semibold tracking-tight"
                >
                  Your projects
                </h2>
                <p className="text-sm text-muted-foreground">
                  {organization
                    ? `Projects in ${organization.name}.`
                    : "Select an organization to view projects."}
                </p>
              </div>
            </div>
            {organization ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoadingProjects}
                onClick={onReload}
              >
                <RefreshCw aria-hidden="true" />
                Refresh
              </Button>
            ) : null}
          </div>

          {isLoadingProjects ? (
            <output className="text-sm text-muted-foreground">
              Loading projects...
            </output>
          ) : null}

          {projectsError ? (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
            >
              <p>{projectsError}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onReload}
              >
                <RefreshCw aria-hidden="true" />
                Retry
              </Button>
            </div>
          ) : null}

          {!isLoadingProjects &&
          !projectsError &&
          organization &&
          projects.length === 0 ? (
            <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
              This organization does not have any projects yet. Create one to
              get started.
            </p>
          ) : null}

          {!isLoadingProjects && !projectsError && projects.length > 0 ? (
            <>
              <ul className="space-y-3">
                {projects.map((project) => (
                  <li key={project.id} className="rounded-lg border p-4 sm:p-5">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate font-medium">{project.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Team: {project.team.name}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs text-muted-foreground">
                        Created{" "}
                        {new Date(project.createdAt).toLocaleDateString(
                          "en-US",
                          { timeZone: "UTC" },
                        )}
                      </p>
                    </div>
                    <ProjectSprintSection
                      project={project}
                      onSprintCreated={(sprint) => {
                        setProjects((currentProjects) =>
                          currentProjects.map((currentProject) =>
                            currentProject.id === project.id
                              ? {
                                  ...currentProject,
                                  sprints: [
                                    ...currentProject.sprints,
                                    sprint,
                                  ].sort(
                                    (first, second) =>
                                      Date.parse(first.startTime) -
                                      Date.parse(second.startTime),
                                  ),
                                }
                              : currentProject,
                          ),
                        );
                      }}
                    />
                    <ProjectMemberForm
                      project={project}
                      organizationMembers={organizationMembers}
                      isLoadingMembers={isLoadingMembers}
                      membersError={membersError}
                      onRetryMembers={onReload}
                    />
                  </li>
                ))}
              </ul>
              {pagination ? (
                <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    {pagination.total}{" "}
                    {pagination.total === 1 ? "project" : "projects"} · Page{" "}
                    {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page <= 1 || isLoadingProjects}
                      onClick={() => setPage((currentPage) => currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages || isLoadingProjects}
                      onClick={() => setPage((currentPage) => currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function ProjectSprintSection({
  project,
  onSprintCreated,
}: {
  project: Project;
  onSprintCreated: (sprint: Sprint) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdSprintName, setCreatedSprintName] = useState<string | null>(
    null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCreatedSprintName(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("sprintName") ?? "").trim();
    const startValue = String(formData.get("startTime") ?? "");
    const endValue = String(formData.get("endTime") ?? "");
    const startTime = new Date(startValue);
    const endTime = new Date(endValue);

    if (!name) {
      setError("Enter a sprint name.");
      return;
    }
    if (
      !startValue ||
      !endValue ||
      Number.isNaN(startTime.getTime()) ||
      Number.isNaN(endTime.getTime())
    ) {
      setError("Enter valid sprint start and end dates.");
      return;
    }
    if (startTime >= endTime) {
      setError("Sprint start time must be before its end time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const sprint = await createSprint(
        name,
        project.id,
        startTime.toISOString(),
        endTime.toISOString(),
      );
      onSprintCreated(sprint);
      setCreatedSprintName(sprint.name);
      form.reset();
    } catch (createError) {
      setError(
        errorMessage(
          createError,
          "The sprint could not be created. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-label={`${project.name} sprints`} className="mb-4">
      <h4 className="mb-3 text-sm font-medium">
        Sprints ({project.sprints.length})
      </h4>
      {project.sprints.length > 0 ? (
        <ul className="mb-4 space-y-2">
          {project.sprints.map((sprint) => (
            <li
              key={sprint.id}
              className="rounded-lg bg-muted/50 px-3 py-2.5 text-sm"
            >
              <p className="font-medium">{sprint.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(sprint.startTime).toLocaleString()} –{" "}
                {new Date(sprint.endTime).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-muted-foreground">
          No sprints have been created for this project yet.
        </p>
      )}

      <form
        className="grid gap-3 rounded-lg border p-3 sm:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor={`project-${project.id}-sprint-name`}
            className="text-xs font-medium"
          >
            Sprint name
          </label>
          <input
            id={`project-${project.id}-sprint-name`}
            name="sprintName"
            type="text"
            autoComplete="off"
            placeholder="e.g. Sprint 1"
            className={inputClassName}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`project-${project.id}-sprint-start`}
            className="text-xs font-medium"
          >
            Start date and time
          </label>
          <input
            id={`project-${project.id}-sprint-start`}
            name="startTime"
            type="datetime-local"
            className={inputClassName}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`project-${project.id}-sprint-end`}
            className="text-xs font-medium"
          >
            End date and time
          </label>
          <input
            id={`project-${project.id}-sprint-end`}
            name="endTime"
            type="datetime-local"
            className={inputClassName}
            required
            disabled={isSubmitting}
          />
        </div>
        {error ? (
          <p role="alert" className="text-sm text-destructive sm:col-span-2">
            {error}
          </p>
        ) : null}
        {createdSprintName ? (
          <output className="text-sm text-primary sm:col-span-2">
            {createdSprintName} was created successfully.
          </output>
        ) : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            <Plus aria-hidden="true" />
            {isSubmitting ? "Creating sprint..." : "Create sprint"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function ProjectMemberForm({
  project,
  organizationMembers,
  isLoadingMembers,
  membersError,
  onRetryMembers,
}: {
  project: Project;
  organizationMembers: OrganizationMemberWithUser[];
  isLoadingMembers: boolean;
  membersError: string | null;
  onRetryMembers: () => void;
}) {
  const [projectRosterKey, setProjectRosterKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedMember, setAddedMember] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setAddedMember(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const userId = String(formData.get("userId") ?? "");
    const roleValue = String(formData.get("role") ?? "");

    if (roleValue !== "MEMBER" && roleValue !== "MANAGER") {
      setError("Select a valid project role.");
      return;
    }

    const selectedMember = organizationMembers.find(
      (member) => member.userId === userId,
    );
    if (!selectedMember) {
      setError("Select a member of this organization.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addProjectMember(project.id, userId, roleValue);
      setAddedMember(
        `${selectedMember.user.username} was added to ${project.name} as ${roleValue.toLowerCase()}.`,
      );
      setProjectRosterKey((currentKey) => currentKey + 1);
      form.reset();
    } catch (error) {
      setError(
        errorMessage(
          error,
          "The project member could not be added. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="border-t pt-4">
      <ProjectRoster
        key={`${project.id}-${projectRosterKey}`}
        projectId={project.id}
      />

      <div className="mb-3 flex items-center gap-2">
        <UsersRound
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
        <p className="text-sm font-medium">Project members</p>
      </div>

      {membersError ? (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-destructive">
          <p role="alert">{membersError}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetryMembers}
          >
            Retry
          </Button>
        </div>
      ) : null}

      {isLoadingMembers ? (
        <output className="text-sm text-muted-foreground">
          Loading organization members...
        </output>
      ) : membersError ? null : organizationMembers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Add people to the organization before assigning them to a project.
        </p>
      ) : (
        <form
          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label
              htmlFor={`project-${project.id}-member`}
              className="text-xs font-medium"
            >
              Organization member
            </label>
            <select
              id={`project-${project.id}-member`}
              name="userId"
              className={inputClassName}
              required
              disabled={isSubmitting || isLoadingMembers}
              defaultValue=""
            >
              <option value="" disabled>
                Select a member
              </option>
              {organizationMembers.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.user.username} · {member.user.email}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor={`project-${project.id}-role`}
              className="text-xs font-medium"
            >
              Role
            </label>
            <select
              id={`project-${project.id}-role`}
              name="role"
              className={`${inputClassName} sm:w-36`}
              defaultValue="MEMBER"
              disabled={isSubmitting}
            >
              <option value="MEMBER">Member</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>
          <Button type="submit" disabled={isSubmitting || isLoadingMembers}>
            <Plus aria-hidden="true" />
            {isSubmitting ? "Adding..." : "Add member"}
          </Button>
        </form>
      )}

      {error ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {addedMember ? (
        <output className="mt-3 text-sm text-primary">{addedMember}</output>
      ) : null}
    </div>
  );
}

function ProjectRoster({ projectId }: { projectId: string }) {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <ProjectRosterContent
      key={`${projectId}-${reloadKey}`}
      projectId={projectId}
      onRetry={() => setReloadKey((currentKey) => currentKey + 1)}
    />
  );
}

function ProjectRosterContent({
  projectId,
  onRetry,
}: {
  projectId: string;
  onRetry: () => void;
}) {
  const [members, setMembers] = useState<ProjectMemberWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    setIsLoading(true);
    setError(null);

    getProjectMembers(projectId)
      .then((result) => {
        if (isCurrent) {
          setMembers(result);
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(
            errorMessage(
              loadError,
              "Project members could not be loaded. Please try again.",
            ),
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [projectId]);

  return (
    <section
      aria-label="Project member roster"
      aria-busy={isLoading}
      className="mb-5"
    >
      <h4 className="mb-3 text-sm font-medium">Current project members</h4>
      {isLoading ? (
        <output className="text-sm text-muted-foreground">
          Loading project members...
        </output>
      ) : null}
      {error ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-destructive">
          <p role="alert">{error}</p>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}
      {!isLoading && !error && members.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No members have been added to this project yet.
        </p>
      ) : null}
      {!isLoading && !error && members.length > 0 ? (
        <ul className="divide-y rounded-lg border">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex flex-col gap-1 px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{member.user.username}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-secondary px-2 py-1 text-secondary-foreground">
                  {member.role.toLowerCase()}
                </span>
                <span>
                  Joined{" "}
                  {new Date(member.createdAt).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                  })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
