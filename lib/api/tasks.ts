import { apiRequest } from "@/lib/api/client";

export type TaskProject = {
  id: string;
  name: string;
};

export type TaskSprint = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

export type Task = {
  id: string;
  projectId: string;
  sprintId: string | null;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  project: TaskProject;
  sprint: TaskSprint | null;
};

export type TaskSortField = "createdAt" | "updatedAt" | "title";
export type SortOrder = "asc" | "desc";

export type TaskPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TaskPage = {
  tasks: Task[];
  pagination: TaskPagination;
};

export class TaskApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTaskProject(value: unknown): value is TaskProject {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string"
  );
}

function isTaskSprint(value: unknown): value is TaskSprint {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.startTime === "string" &&
    typeof value.endTime === "string"
  );
}

function isTask(value: unknown): value is Task {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.projectId === "string" &&
    (typeof value.sprintId === "string" || value.sprintId === null) &&
    typeof value.title === "string" &&
    (typeof value.description === "string" || value.description === null) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    isTaskProject(value.project) &&
    (value.sprint === null || isTaskSprint(value.sprint))
  );
}

function isPagination(value: unknown): value is TaskPagination {
  return (
    isRecord(value) &&
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    typeof value.total === "number" &&
    typeof value.totalPages === "number"
  );
}

function getMessage(payload: unknown): string | undefined {
  if (
    isRecord(payload) &&
    typeof payload.message === "string" &&
    payload.message.trim()
  ) {
    return payload.message;
  }
  return undefined;
}

async function requestPayload(
  path: string,
  init: RequestInit,
  operation: string,
): Promise<Record<string, unknown>> {
  let response: Response;
  try {
    response = await apiRequest(path, init);
  } catch (error) {
    throw new TaskApiError(
      error instanceof Error
        ? error.message
        : `${operation} could not be completed. Please try again.`,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new TaskApiError(
      `The server returned an unreadable ${operation.toLowerCase()} response.`,
    );
  }

  if (!response.ok) {
    throw new TaskApiError(
      getMessage(payload) ??
        `${operation} failed (HTTP ${response.status}). Please try again.`,
    );
  }

  if (!isRecord(payload) || payload.success !== true) {
    throw new TaskApiError(
      getMessage(payload) ??
        `The server returned an unexpected ${operation.toLowerCase()} response.`,
    );
  }

  return payload;
}

export async function getTasks(options: {
  organizationId: string;
  page: number;
  limit: number;
  term: string;
  sortBy: TaskSortField;
  order: SortOrder;
}): Promise<TaskPage> {
  const query = new URLSearchParams({
    organizationId: options.organizationId,
    page: String(options.page),
    limit: String(options.limit),
    sortBy: options.sortBy,
    order: options.order,
  });
  if (options.term) {
    query.set("term", options.term);
  }

  const payload = await requestPayload(
    `/tasks?${query.toString()}`,
    { method: "GET" },
    "Task loading",
  );
  const data = payload.data;

  if (
    !isRecord(data) ||
    !Array.isArray(data.tasks) ||
    !data.tasks.every(isTask) ||
    !isPagination(data.pagination)
  ) {
    throw new TaskApiError("The server returned an unexpected task list.");
  }

  return {
    tasks: data.tasks,
    pagination: data.pagination,
  };
}

export async function createTask(input: {
  title: string;
  description: string;
  projectId: string;
  sprintId?: string;
}): Promise<Task> {
  const payload = await requestPayload(
    "/tasks",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
    "Task creation",
  );
  const data = payload.data;

  if (!isRecord(data) || !isTask(data.task)) {
    throw new TaskApiError(
      "The server returned an unexpected task creation response.",
    );
  }

  return data.task;
}

export async function assignTaskToSprint(
  taskId: string,
  sprintId: string,
): Promise<Task> {
  const payload = await requestPayload(
    `/tasks/${encodeURIComponent(taskId)}/assign`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sprintId }),
    },
    "Task assignment",
  );
  const data = payload.data;

  if (!isRecord(data) || !isTask(data.task)) {
    throw new TaskApiError(
      "The server returned an unexpected task assignment response.",
    );
  }

  return data.task;
}
