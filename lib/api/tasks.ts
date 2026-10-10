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

export type Subtask = {
  id: string;
  title: string;
  description: string | null;
  taskId: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskComment = {
  id: string;
  content: string;
  userId: string;
  taskId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
  };
};

export type TaskAttachment = {
  id: string;
  taskId: string;
  userId: string;
  originalName: string;
  fileURL: string;
  createdAt: string;
  updatedAt: string;
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
  subtasks: Subtask[];
  attachments: TaskAttachment[];
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

function isSubtask(value: unknown): value is Subtask {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    (typeof value.description === "string" || value.description === null) &&
    typeof value.taskId === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isTaskComment(value: unknown): value is TaskComment {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.content === "string" &&
    typeof value.userId === "string" &&
    typeof value.taskId === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    isRecord(value.user) &&
    typeof value.user.username === "string"
  );
}

function isTaskAttachment(value: unknown): value is TaskAttachment {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.taskId === "string" &&
    typeof value.userId === "string" &&
    typeof value.originalName === "string" &&
    typeof value.fileURL === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
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
    (value.sprint === null || isTaskSprint(value.sprint)) &&
    Array.isArray(value.subtasks) &&
    value.subtasks.every(isSubtask) &&
    Array.isArray(value.attachments) &&
    value.attachments.every(isTaskAttachment)
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

export async function createSubtask(input: {
  taskId: string;
  title: string;
  description: string;
}): Promise<Subtask> {
  const payload = await requestPayload(
    `/tasks/${encodeURIComponent(input.taskId)}/subtasks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: input.title,
        description: input.description,
      }),
    },
    "Subtask creation",
  );
  const data = payload.data;

  if (!isRecord(data) || !isSubtask(data.subtask)) {
    throw new TaskApiError(
      "The server returned an unexpected subtask creation response.",
    );
  }

  return data.subtask;
}

export async function getTaskComments(taskId: string): Promise<TaskComment[]> {
  const query = new URLSearchParams({ taskId });
  const payload = await requestPayload(
    `/comments?${query.toString()}`,
    { method: "GET" },
    "Comment loading",
  );
  const data = payload.data;

  if (
    !isRecord(data) ||
    !Array.isArray(data.comments) ||
    !data.comments.every(isTaskComment)
  ) {
    throw new TaskApiError("The server returned an unexpected comment list.");
  }

  return data.comments;
}

export async function createTaskComment(input: {
  taskId: string;
  content: string;
}): Promise<TaskComment> {
  const payload = await requestPayload(
    "/comments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
    "Comment creation",
  );
  const data = payload.data;

  if (!isRecord(data) || !isTaskComment(data.comment)) {
    throw new TaskApiError(
      "The server returned an unexpected comment creation response.",
    );
  }

  return data.comment;
}

export async function uploadTaskAttachment(input: {
  taskId: string;
  file: File;
}): Promise<TaskAttachment> {
  const formData = new FormData();
  formData.append("attachment", input.file);

  const payload = await requestPayload(
    `/tasks/${encodeURIComponent(input.taskId)}/attachment`,
    {
      method: "POST",
      body: formData,
    },
    "Attachment upload",
  );
  const data = payload.data;

  if (!isRecord(data) || !isTaskAttachment(data.attachment)) {
    throw new TaskApiError(
      "The server returned an unexpected attachment upload response.",
    );
  }

  return data.attachment;
}
