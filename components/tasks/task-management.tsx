"use client";

import {
  ArrowUpDown,
  CalendarClock,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { useOrganizations } from "@/components/organizations/organization-provider";
import { Button } from "@/components/ui/button";
import { getProjects, type Project } from "@/lib/api/projects";
import {
  assignTaskToSprint,
  createSubtask,
  createTask,
  getTasks,
  type SortOrder,
  type Subtask,
  type Task,
  type TaskSortField,
} from "@/lib/api/tasks";

const PAGE_SIZE = 10;
const PROJECTS_PAGE_SIZE = 100;

const inputClassName =
  "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function TaskManagement() {
  const { selectedOrganization } = useOrganizations();

  return (
    <TaskManagementForOrganization
      key={selectedOrganization?.id ?? "no-organization"}
      organization={selectedOrganization}
    />
  );
}

function TaskManagementForOrganization({
  organization,
}: {
  organization: { id: string; name: string } | null;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(
    Boolean(organization),
  );
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [projectsReloadKey, setProjectsReloadKey] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [term, setTerm] = useState("");
  const [sortBy, setSortBy] = useState<TaskSortField>("createdAt");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [pagination, setPagination] = useState<{
    total: number;
    totalPages: number;
  } | null>(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(Boolean(organization));
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [tasksReloadKey, setTasksReloadKey] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdTaskTitle, setCreatedTaskTitle] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [assignmentSprintIds, setAssignmentSprintIds] = useState<
    Record<string, string>
  >({});
  const [assigningTaskId, setAssigningTaskId] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  const organizationId = organization?.id ?? null;
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId,
  );
  const selectedProjectSprints = selectedProject?.sprints ?? [];
  const totalPages = Math.max(pagination?.totalPages ?? 0, 1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: The retry control intentionally reloads the same organization.
  useEffect(() => {
    let isCurrent = true;

    if (!organizationId) {
      setProjects([]);
      setProjectsError(null);
      setIsLoadingProjects(false);
      return () => {
        isCurrent = false;
      };
    }
    const activeOrganizationId = organizationId;

    setIsLoadingProjects(true);
    setProjectsError(null);

    async function loadProjects() {
      const firstPage = await getProjects(
        activeOrganizationId,
        1,
        PROJECTS_PAGE_SIZE,
      );
      const allProjects = [...firstPage.projects];
      for (
        let currentPage = 2;
        currentPage <= firstPage.pagination.totalPages;
        currentPage += 1
      ) {
        const nextPage = await getProjects(
          activeOrganizationId,
          currentPage,
          PROJECTS_PAGE_SIZE,
        );
        allProjects.push(...nextPage.projects);
      }
      return allProjects;
    }

    loadProjects()
      .then((loadedProjects) => {
        if (isCurrent) {
          setProjects(loadedProjects);
          setSelectedProjectId((currentId) =>
            loadedProjects.some(({ id }) => id === currentId)
              ? currentId
              : (loadedProjects[0]?.id ?? ""),
          );
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setProjectsError(
            errorMessage(error, "Projects could not be loaded. Please retry."),
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
  }, [organizationId, projectsReloadKey]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Refresh and create actions intentionally reload the same task query.
  useEffect(() => {
    let isCurrent = true;

    if (!organizationId) {
      setTasks([]);
      setPagination(null);
      setTasksError(null);
      setIsLoadingTasks(false);
      return () => {
        isCurrent = false;
      };
    }

    setIsLoadingTasks(true);
    setTasksError(null);

    getTasks({
      organizationId,
      page,
      limit: PAGE_SIZE,
      term: term.trim(),
      sortBy,
      order,
    })
      .then((result) => {
        if (isCurrent) {
          setTasks(result.tasks);
          setPagination({
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
          });
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setTasksError(
            errorMessage(error, "Tasks could not be loaded. Please retry."),
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoadingTasks(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [organizationId, page, term, sortBy, order, tasksReloadKey]);

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreatedTaskTitle(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!title) {
      setCreateError("Enter a task title.");
      return;
    }
    if (!selectedProjectId) {
      setCreateError("Select a project before creating a task.");
      return;
    }

    setIsCreating(true);
    try {
      const task = await createTask({
        title,
        description,
        projectId: selectedProjectId,
        ...(selectedSprintId ? { sprintId: selectedSprintId } : {}),
      });
      setCreatedTaskTitle(task.title);
      form.reset();
      setSelectedSprintId("");
      setPage(1);
      setTasksReloadKey((key) => key + 1);
    } catch (error) {
      setCreateError(
        errorMessage(error, "The task could not be created. Please try again."),
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleAssignTask(task: Task) {
    const sprintId = assignmentSprintIds[task.id] ?? "";
    if (!sprintId || sprintId === task.sprintId) {
      return;
    }

    setAssigningTaskId(task.id);
    setAssignmentError(null);
    try {
      const updatedTask = await assignTaskToSprint(task.id, sprintId);
      setAssignmentSprintIds((currentIds) => ({
        ...currentIds,
        [task.id]: updatedTask.sprintId ?? "",
      }));
      setTasksReloadKey((key) => key + 1);
    } catch (error) {
      setAssignmentError(
        errorMessage(error, "Sprint assignment failed. Please try again."),
      );
    } finally {
      setAssigningTaskId(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tasks"
        description={
          organization
            ? `Create and track work in ${organization.name}.`
            : "Select or create an organization before managing tasks."
        }
      />

      {!organization ? (
        <section className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Select an organization to view and manage its tasks.
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
          <section
            aria-labelledby="task-list-heading"
            className="min-w-0 rounded-xl border bg-card p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 id="task-list-heading" className="text-lg font-semibold">
                  Your tasks
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search, sort, and open task details.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoadingTasks}
                onClick={() => setTasksReloadKey((key) => key + 1)}
              >
                <RefreshCw aria-hidden="true" />
                Refresh
              </Button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <label className="relative block">
                <span className="sr-only">Search tasks</span>
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="search"
                  value={term}
                  onChange={(event) => {
                    setTerm(event.currentTarget.value);
                    setPage(1);
                  }}
                  placeholder="Search title or description"
                  className={`${inputClassName} pl-9`}
                />
              </label>
              <label className="flex items-center gap-2">
                <ArrowUpDown
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <span className="sr-only">Sort tasks</span>
                <select
                  value={`${sortBy}:${order}`}
                  onChange={(event) => {
                    const [nextSortBy, nextOrder] =
                      event.currentTarget.value.split(":");
                    setSortBy(nextSortBy as TaskSortField);
                    setOrder(nextOrder as SortOrder);
                    setPage(1);
                  }}
                  className={`${inputClassName} min-w-48`}
                >
                  <option value="createdAt:desc">Newest first</option>
                  <option value="createdAt:asc">Oldest first</option>
                  <option value="updatedAt:desc">Recently updated</option>
                  <option value="title:asc">Title A–Z</option>
                  <option value="title:desc">Title Z–A</option>
                </select>
              </label>
            </div>

            {assignmentError ? (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {assignmentError}
              </p>
            ) : null}
            {tasksError ? (
              <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p role="alert" className="text-sm text-destructive">
                  {tasksError}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setTasksReloadKey((key) => key + 1)}
                >
                  Retry
                </Button>
              </div>
            ) : isLoadingTasks ? (
              <output className="block py-10 text-center text-sm text-muted-foreground">
                Loading tasks…
              </output>
            ) : tasks.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                {term.trim()
                  ? "No tasks match your search."
                  : "No tasks have been created in this organization yet."}
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {tasks.map((task) => {
                  const project = projects.find(
                    (item) => item.id === task.projectId,
                  );
                  const sprints = project?.sprints ?? [];
                  const chosenSprintId =
                    assignmentSprintIds[task.id] ?? task.sprintId ?? "";

                  return (
                    <li key={task.id} className="rounded-xl border p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="break-words font-medium">
                            {task.title}
                          </h3>
                          <p className="mt-1 break-words text-sm text-muted-foreground">
                            {task.description || "No description provided."}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            Project: {task.project.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarClock
                            aria-hidden="true"
                            className="size-4"
                          />
                          {task.sprint ? task.sprint.name : "Not in a sprint"}
                        </div>
                      </div>

                      <details className="mt-4 border-t pt-3">
                        <summary className="cursor-pointer text-sm font-medium text-primary">
                          Task details
                        </summary>
                        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                          <div>
                            <dt className="text-xs text-muted-foreground">
                              Project
                            </dt>
                            <dd className="mt-1">{task.project.name}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted-foreground">
                              Sprint
                            </dt>
                            <dd className="mt-1">
                              {task.sprint
                                ? `${task.sprint.name} (${formatDate(task.sprint.startTime)} – ${formatDate(task.sprint.endTime)})`
                                : "Not assigned"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted-foreground">
                              Created
                            </dt>
                            <dd className="mt-1">
                              {formatDate(task.createdAt)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted-foreground">
                              Last updated
                            </dt>
                            <dd className="mt-1">
                              {formatDate(task.updatedAt)}
                            </dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-xs text-muted-foreground">
                              Description
                            </dt>
                            <dd className="mt-1 whitespace-pre-wrap">
                              {task.description || "No description provided."}
                            </dd>
                          </div>
                        </dl>

                        <SubtaskSection
                          taskId={task.id}
                          subtasks={task.subtasks}
                          onSubtaskCreated={(subtask) => {
                            setTasks((currentTasks) =>
                              currentTasks.map((currentTask) =>
                                currentTask.id === task.id
                                  ? {
                                      ...currentTask,
                                      subtasks: [
                                        ...currentTask.subtasks,
                                        subtask,
                                      ],
                                    }
                                  : currentTask,
                              ),
                            );
                          }}
                        />

                        <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-end">
                          <label className="flex-1 space-y-2">
                            <span className="text-xs font-medium">
                              Assign to a sprint
                            </span>
                            <select
                              value={chosenSprintId}
                              onChange={(event) =>
                                setAssignmentSprintIds((currentIds) => ({
                                  ...currentIds,
                                  [task.id]: event.currentTarget.value,
                                }))
                              }
                              className={inputClassName}
                              disabled={
                                sprints.length === 0 ||
                                assigningTaskId === task.id
                              }
                            >
                              <option value="">
                                {sprints.length
                                  ? "Select a sprint"
                                  : "This project has no sprints"}
                              </option>
                              {sprints.map((sprint) => (
                                <option key={sprint.id} value={sprint.id}>
                                  {sprint.name}
                                </option>
                              ))}
                            </select>
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={
                              !chosenSprintId ||
                              chosenSprintId === task.sprintId ||
                              assigningTaskId === task.id
                            }
                            onClick={() => void handleAssignTask(task)}
                          >
                            {assigningTaskId === task.id
                              ? "Assigning…"
                              : "Assign sprint"}
                          </Button>
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ul>
            )}

            {pagination && !tasksError && pagination.total > 0 ? (
              <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {pagination.total} {pagination.total === 1 ? "task" : "tasks"}{" "}
                  · Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || isLoadingTasks}
                    onClick={() => setPage((currentPage) => currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || isLoadingTasks}
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </section>

          <section
            aria-labelledby="create-task-heading"
            className="h-fit rounded-xl border bg-card p-5 shadow-sm sm:p-6"
          >
            <div>
              <h2 id="create-task-heading" className="text-lg font-semibold">
                Create a task
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add work to one of this organization’s projects.
              </p>
            </div>

            {projectsError ? (
              <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p role="alert" className="text-sm text-destructive">
                  {projectsError}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setProjectsReloadKey((key) => key + 1)}
                >
                  Retry
                </Button>
              </div>
            ) : isLoadingProjects ? (
              <output className="mt-5 block text-sm text-muted-foreground">
                Loading projects…
              </output>
            ) : projects.length === 0 ? (
              <p className="mt-5 text-sm text-muted-foreground">
                Create a project before adding tasks.
              </p>
            ) : (
              <form className="mt-5 space-y-4" onSubmit={handleCreateTask}>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Task title</span>
                  <input
                    name="title"
                    type="text"
                    className={inputClassName}
                    required
                    disabled={isCreating}
                    maxLength={200}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Description</span>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isCreating}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Project</span>
                  <select
                    value={selectedProjectId}
                    onChange={(event) => {
                      setSelectedProjectId(event.currentTarget.value);
                      setSelectedSprintId("");
                    }}
                    className={inputClassName}
                    required
                    disabled={isCreating}
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">
                    Sprint{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </span>
                  <select
                    value={selectedSprintId}
                    onChange={(event) =>
                      setSelectedSprintId(event.currentTarget.value)
                    }
                    className={inputClassName}
                    disabled={isCreating || selectedProjectSprints.length === 0}
                  >
                    <option value="">
                      {selectedProjectSprints.length
                        ? "No sprint"
                        : "No sprints for this project"}
                    </option>
                    {selectedProjectSprints.map((sprint) => (
                      <option key={sprint.id} value={sprint.id}>
                        {sprint.name}
                      </option>
                    ))}
                  </select>
                </label>
                {createError ? (
                  <p role="alert" className="text-sm text-destructive">
                    {createError}
                  </p>
                ) : null}
                {createdTaskTitle ? (
                  <output className="block text-sm text-primary">
                    “{createdTaskTitle}” was created successfully.
                  </output>
                ) : null}
                <Button type="submit" disabled={isCreating}>
                  <Plus aria-hidden="true" />
                  {isCreating ? "Creating task…" : "Create task"}
                </Button>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function SubtaskSection({
  taskId,
  subtasks,
  onSubtaskCreated,
}: {
  taskId: string;
  subtasks: Subtask[];
  onSubtaskCreated: (subtask: Subtask) => void;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdTitle, setCreatedTitle] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCreatedTitle(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("subtaskTitle") ?? "").trim();
    const description = String(formData.get("subtaskDescription") ?? "").trim();
    if (!title) {
      setError("Enter a subtask title.");
      return;
    }

    setIsCreating(true);
    try {
      const subtask = await createSubtask({ taskId, title, description });
      onSubtaskCreated(subtask);
      setCreatedTitle(subtask.title);
      form.reset();
    } catch (createError) {
      setError(
        errorMessage(
          createError,
          "The subtask could not be created. Please try again.",
        ),
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section aria-label="Subtasks" className="mt-4 border-t pt-4">
      <h4 className="text-sm font-medium">Subtasks ({subtasks.length})</h4>
      {subtasks.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {subtasks.map((subtask) => (
            <li key={subtask.id} className="rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-sm font-medium">{subtask.title}</p>
              {subtask.description ? (
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {subtask.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          No subtasks have been added.
        </p>
      )}

      <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs font-medium">Subtask title</span>
          <input
            name="subtaskTitle"
            type="text"
            className={inputClassName}
            maxLength={200}
            required
            disabled={isCreating}
          />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs font-medium">
            Description{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </span>
          <textarea
            name="subtaskDescription"
            rows={2}
            maxLength={2000}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isCreating}
          />
        </label>
        {error ? (
          <p role="alert" className="text-sm text-destructive sm:col-span-2">
            {error}
          </p>
        ) : null}
        {createdTitle ? (
          <output className="text-sm text-primary sm:col-span-2">
            “{createdTitle}” was added successfully.
          </output>
        ) : null}
        <div className="sm:col-span-2">
          <Button type="submit" variant="outline" disabled={isCreating}>
            <Plus aria-hidden="true" />
            {isCreating ? "Adding subtask…" : "Add subtask"}
          </Button>
        </div>
      </form>
    </section>
  );
}
