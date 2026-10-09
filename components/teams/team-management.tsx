"use client";

import { BriefcaseBusiness, Plus, RefreshCw, UsersRound } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { useOrganizations } from "@/components/organizations/organization-provider";
import { Button } from "@/components/ui/button";
import {
  getOrganizationMembers,
  type OrganizationMemberWithUser,
} from "@/lib/api/organizations";
import {
  addTeamMember,
  createTeam,
  getTeamMembers,
  getTeams,
  type Team,
  type TeamMemberWithUser,
  type TeamPagination,
} from "@/lib/api/teams";

const PAGE_SIZE = 10;

const inputClassName =
  "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function TeamManagement() {
  const { selectedOrganization } = useOrganizations();

  return (
    <TeamManagementForOrganization
      key={selectedOrganization?.id ?? "no-organization"}
      organization={selectedOrganization}
    />
  );
}

function TeamManagementForOrganization({
  organization,
}: {
  organization: { id: string; name: string } | null;
}) {
  const [reloadKey, setReloadKey] = useState(0);
  const [createdTeamName, setCreatedTeamName] = useState<string | null>(null);

  function reload() {
    setReloadKey((currentKey) => currentKey + 1);
  }

  function handleTeamCreated(name: string) {
    setCreatedTeamName(name);
    reload();
  }

  return (
    <TeamManagementContent
      key={`${organization?.id ?? "no-organization"}-${reloadKey}`}
      organization={organization}
      createdTeamName={createdTeamName}
      onReload={reload}
      onTeamCreated={handleTeamCreated}
    />
  );
}

function TeamManagementContent({
  organization,
  createdTeamName,
  onReload,
  onTeamCreated,
}: {
  organization: { id: string; name: string } | null;
  createdTeamName: string | null;
  onReload: () => void;
  onTeamCreated: (name: string) => void;
}) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [pagination, setPagination] = useState<TeamPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingTeams, setIsLoadingTeams] = useState(Boolean(organization));
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [organizationMembers, setOrganizationMembers] = useState<
    OrganizationMemberWithUser[]
  >([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(
    Boolean(organization),
  );
  const [membersError, setMembersError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const organizationId = organization?.id ?? null;

  useEffect(() => {
    let isCurrent = true;

    if (!organizationId) {
      setTeams([]);
      setPagination(null);
      setTeamsError(null);
      setIsLoadingTeams(false);
      return () => {
        isCurrent = false;
      };
    }

    setIsLoadingTeams(true);
    setTeamsError(null);

    getTeams(organizationId, page, PAGE_SIZE)
      .then((result) => {
        if (isCurrent) {
          setTeams(result.teams);
          setPagination(result.pagination);
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
  }, [organizationId, page]);

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
      .then((members) => {
        if (isCurrent) {
          setOrganizationMembers(members);
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

  async function handleCreateTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);

    if (!organization) {
      setCreateError("Select an organization before creating a team.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("teamName") ?? "").trim();
    if (!name) {
      setCreateError("Enter a team name.");
      return;
    }

    setIsCreating(true);
    try {
      await createTeam(name, organization.id);
      form.reset();
      onTeamCreated(name);
    } catch (error) {
      setCreateError(
        errorMessage(error, "The team could not be created. Please try again."),
      );
    } finally {
      setIsCreating(false);
    }
  }

  const totalPages = Math.max(pagination?.totalPages ?? 0, 1);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Teams"
        description={
          organization
            ? `Create and manage teams in ${organization.name}.`
            : "Select or create an organization before managing teams."
        }
      />

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section
          aria-labelledby="create-team-heading"
          className="rounded-xl border bg-card p-5 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2
                id="create-team-heading"
                className="font-semibold tracking-tight"
              >
                Create a team
              </h2>
              <p className="text-sm text-muted-foreground">
                {organization
                  ? `Add a team to ${organization.name}.`
                  : "Select an organization to create a team."}
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleCreateTeam}>
            <div className="space-y-2">
              <label htmlFor="teamName" className="text-sm font-medium">
                Team name
              </label>
              <input
                id="teamName"
                name="teamName"
                type="text"
                autoComplete="off"
                placeholder="e.g. Design"
                className={inputClassName}
                required
                disabled={!organization || isCreating}
              />
            </div>
            {createError ? (
              <p role="alert" className="text-sm text-destructive">
                {createError}
              </p>
            ) : null}
            {createdTeamName ? (
              <output className="text-sm text-primary">
                {createdTeamName} was created in {organization?.name}.
              </output>
            ) : null}
            <Button type="submit" disabled={!organization || isCreating}>
              <Plus aria-hidden="true" />
              {isCreating ? "Creating..." : "Create team"}
            </Button>
          </form>
        </section>

        <section
          aria-labelledby="teams-list-heading"
          className="rounded-xl border bg-card p-5 sm:p-6"
          aria-busy={isLoadingTeams}
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <BriefcaseBusiness aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2
                  id="teams-list-heading"
                  className="font-semibold tracking-tight"
                >
                  Your teams
                </h2>
                <p className="text-sm text-muted-foreground">
                  {organization
                    ? `Teams in ${organization.name}.`
                    : "Select an organization to view teams."}
                </p>
              </div>
            </div>
            {organization ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoadingTeams}
                onClick={onReload}
              >
                <RefreshCw aria-hidden="true" />
                Refresh
              </Button>
            ) : null}
          </div>

          {isLoadingTeams ? (
            <output className="text-sm text-muted-foreground">
              Loading teams...
            </output>
          ) : null}

          {teamsError ? (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
            >
              <p>{teamsError}</p>
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

          {!isLoadingTeams &&
          !teamsError &&
          organization &&
          teams.length === 0 ? (
            <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
              This organization does not have any teams yet. Create one to get
              started.
            </p>
          ) : null}

          {!isLoadingTeams && !teamsError && teams.length > 0 ? (
            <>
              <ul className="space-y-3">
                {teams.map((team) => (
                  <li key={team.id} className="rounded-lg border p-4 sm:p-5">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate font-medium">{team.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Created{" "}
                          {new Date(team.createdAt).toLocaleDateString(
                            "en-US",
                            { timeZone: "UTC" },
                          )}
                        </p>
                      </div>
                    </div>
                    <TeamMemberForm
                      team={team}
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
                    {pagination.total === 1 ? "team" : "teams"} · Page {page} of{" "}
                    {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page <= 1 || isLoadingTeams}
                      onClick={() => setPage((currentPage) => currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages || isLoadingTeams}
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

function TeamMemberForm({
  team,
  organizationMembers,
  isLoadingMembers,
  membersError,
  onRetryMembers,
}: {
  team: Team;
  organizationMembers: OrganizationMemberWithUser[];
  isLoadingMembers: boolean;
  membersError: string | null;
  onRetryMembers: () => void;
}) {
  const [teamRosterKey, setTeamRosterKey] = useState(0);
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
      setError("Select a valid team role.");
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
      await addTeamMember(team.id, userId, roleValue);
      setAddedMember(
        `${selectedMember.user.username} was added to ${team.name} as ${roleValue.toLowerCase()}.`,
      );
      setTeamRosterKey((currentKey) => currentKey + 1);
      form.reset();
    } catch (error) {
      setError(
        errorMessage(
          error,
          "The team member could not be added. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="border-t pt-4">
      <TeamRoster key={`${team.id}-${teamRosterKey}`} teamId={team.id} />

      <div className="mb-3 flex items-center gap-2">
        <UsersRound
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
        <p className="text-sm font-medium">Add a team member</p>
      </div>

      {membersError ? (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-destructive">
          <p>{membersError}</p>
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
      ) : organizationMembers.length === 0 && !membersError ? (
        <p className="text-sm text-muted-foreground">
          Add people to the organization before assigning them to a team.
        </p>
      ) : (
        <form
          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label
              htmlFor={`team-${team.id}-member`}
              className="text-xs font-medium"
            >
              Organization member
            </label>
            <select
              id={`team-${team.id}-member`}
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
              htmlFor={`team-${team.id}-role`}
              className="text-xs font-medium"
            >
              Role
            </label>
            <select
              id={`team-${team.id}-role`}
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

function TeamRoster({ teamId }: { teamId: string }) {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <TeamRosterContent
      key={`${teamId}-${reloadKey}`}
      teamId={teamId}
      onRetry={() => setReloadKey((currentKey) => currentKey + 1)}
    />
  );
}

function TeamRosterContent({
  teamId,
  onRetry,
}: {
  teamId: string;
  onRetry: () => void;
}) {
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithUser[]>([]);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(true);
  const [teamMembersError, setTeamMembersError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    setIsLoadingTeamMembers(true);
    setTeamMembersError(null);

    getTeamMembers(teamId)
      .then((members) => {
        if (isCurrent) {
          setTeamMembers(members);
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setTeamMembersError(
            errorMessage(
              error,
              "Team members could not be loaded. Please try again.",
            ),
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoadingTeamMembers(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [teamId]);

  return (
    <section
      aria-label="Team member roster"
      aria-busy={isLoadingTeamMembers}
      className="mb-5"
    >
      <h4 className="mb-3 text-sm font-medium">Team members</h4>
      {isLoadingTeamMembers ? (
        <output className="text-sm text-muted-foreground">
          Loading team members...
        </output>
      ) : null}
      {teamMembersError ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-destructive">
          <p role="alert">{teamMembersError}</p>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}
      {!isLoadingTeamMembers &&
      !teamMembersError &&
      teamMembers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No members have been added to this team yet.
        </p>
      ) : null}
      {!isLoadingTeamMembers && !teamMembersError && teamMembers.length > 0 ? (
        <ul className="divide-y rounded-lg border">
          {teamMembers.map((member) => (
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
