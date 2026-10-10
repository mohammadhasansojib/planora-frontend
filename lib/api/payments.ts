import { apiRequest } from "@/lib/api/client";

export type CreatedPayment = {
  paymentID: string;
  bkashURL: string;
  amount: string;
  currency: string;
};

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

export type Payment = {
  id: string;
  paymentId: string;
  transactionId: string | null;
  amount: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};

export type PaymentPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaymentPage = {
  payments: Payment[];
  pagination: PaymentPagination;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPaymentStatus(value: unknown): value is PaymentStatus {
  return (
    value === "PENDING" ||
    value === "COMPLETED" ||
    value === "FAILED" ||
    value === "CANCELLED"
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

async function requestPaymentData(
  path: string,
  init: RequestInit,
  operation: string,
): Promise<Record<string, unknown>> {
  let response: Response;
  try {
    response = await apiRequest(path, init);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : `${operation} could not be completed. Please try again.`,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(
      `The server returned an unreadable ${operation.toLowerCase()} response.`,
    );
  }

  if (!response.ok || !isRecord(payload) || payload.success !== true) {
    throw new Error(
      getMessage(payload) ??
        `${operation} failed (HTTP ${response.status}). Please try again.`,
    );
  }

  const data = payload.data;
  if (!isRecord(data)) {
    throw new Error(
      `The server returned incomplete ${operation.toLowerCase()} information.`,
    );
  }

  return data;
}

export async function createPayment(): Promise<CreatedPayment> {
  const data = await requestPaymentData(
    "/payments/create-payment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
    "Payment creation",
  );
  if (
    typeof data.paymentID !== "string" ||
    typeof data.bkashURL !== "string" ||
    typeof data.amount !== "string" ||
    typeof data.currency !== "string"
  ) {
    throw new Error("The server returned incomplete payment information.");
  }

  let paymentURL: URL;
  try {
    paymentURL = new URL(data.bkashURL);
  } catch {
    throw new Error("The server returned an invalid bKash payment URL.");
  }
  if (paymentURL.protocol !== "https:") {
    throw new Error("The server returned an unsupported payment URL.");
  }

  return {
    paymentID: data.paymentID,
    bkashURL: data.bkashURL,
    amount: data.amount,
    currency: data.currency,
  };
}

function isPayment(value: unknown): value is Payment {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.paymentId === "string" &&
    (typeof value.transactionId === "string" || value.transactionId === null) &&
    typeof value.amount === "string" &&
    Number.isFinite(Number(value.amount)) &&
    isPaymentStatus(value.status) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isPaymentPagination(value: unknown): value is PaymentPagination {
  return (
    isRecord(value) &&
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    typeof value.total === "number" &&
    typeof value.totalPages === "number"
  );
}

export async function getPayments(
  page: number,
  limit: number,
): Promise<PaymentPage> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const data = await requestPaymentData(
    `/payments?${params.toString()}`,
    {},
    "Payment list",
  );

  if (
    !Array.isArray(data.payments) ||
    !data.payments.every(isPayment) ||
    !isPaymentPagination(data.pagination)
  ) {
    throw new Error("The server returned an invalid payment list.");
  }

  return {
    payments: data.payments,
    pagination: data.pagination,
  };
}
