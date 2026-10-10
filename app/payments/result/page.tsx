import {
  ArrowLeft,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock3,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment result",
};

type PaymentStatus = "success" | "failure" | "cancelled";

const resultDetails: Record<
  PaymentStatus,
  {
    title: string;
    description: string;
    icon: typeof CircleCheck;
    style: string;
  }
> = {
  success: {
    title: "Payment successful",
    description: "bKash confirmed your payment. Thank you.",
    icon: CircleCheck,
    style: "bg-primary/10 text-primary",
  },
  failure: {
    title: "Payment unsuccessful",
    description:
      "The payment was not completed. You can return to Payments and try again.",
    icon: CircleX,
    style: "bg-destructive/10 text-destructive",
  },
  cancelled: {
    title: "Payment cancelled",
    description: "The checkout was cancelled. No payment was completed.",
    icon: Clock3,
    style: "bg-muted text-muted-foreground",
  },
};

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const query = await searchParams;
  const rawStatus = query.status;
  const paymentStatus =
    rawStatus === "success" ||
    rawStatus === "failure" ||
    rawStatus === "cancelled"
      ? rawStatus
      : null;
  const result = paymentStatus ? resultDetails[paymentStatus] : null;
  const Icon = result?.icon ?? CircleHelp;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-5">
      <section className="w-full max-w-lg rounded-xl border bg-card p-6 text-center shadow-sm sm:p-8">
        <span
          className={`mx-auto flex size-14 items-center justify-center rounded-full ${
            result?.style ?? "bg-muted text-muted-foreground"
          }`}
        >
          <Icon aria-hidden="true" className="size-7" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          {result?.title ?? "Payment result unavailable"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {result?.description ??
            "We couldn’t determine the payment result. Check your bKash transaction history before trying again."}
        </p>
        <Button asChild className="mt-6">
          <Link href={paymentStatus === "success" ? "/" : "/payments"}>
            <ArrowLeft aria-hidden="true" />
            {paymentStatus === "success"
              ? "Return to dashboard"
              : "Back to payments"}
          </Link>
        </Button>
      </section>
    </main>
  );
}
