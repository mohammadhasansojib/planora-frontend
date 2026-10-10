import { apiRequest } from "@/lib/api/client";

export type CreatedPayment = {
  paymentID: string;
  bkashURL: string;
  amount: string;
  currency: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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

export async function createPayment(): Promise<CreatedPayment> {
  let response: Response;
  try {
    response = await apiRequest("/payments/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Payment could not be started. Please try again.",
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an unreadable payment response.");
  }

  if (!response.ok || !isRecord(payload) || payload.success !== true) {
    throw new Error(
      getMessage(payload) ??
        `Payment could not be started (HTTP ${response.status}). Please try again.`,
    );
  }

  const data = payload.data;
  if (
    !isRecord(data) ||
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
