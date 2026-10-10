"use client";

import { ArrowRight, CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { createPayment } from "@/lib/api/payments";

export function PaymentManagement() {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStartPayment() {
    setIsStarting(true);
    setError(null);
    try {
      const payment = await createPayment();
      window.location.assign(payment.bkashURL);
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "Payment could not be started. Please try again.",
      );
      setIsStarting(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payments"
        description="Continue to bKash to complete the configured payment."
      />

      <section
        aria-labelledby="payment-heading"
        className="max-w-2xl rounded-xl border bg-card p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 id="payment-heading" className="text-lg font-semibold">
              bKash payment
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The current backend checkout is configured for a fixed amount.
            </p>
          </div>
        </div>

        <dl className="mt-6 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted-foreground">Amount</dt>
            <dd className="text-lg font-semibold">৳600 BDT</dd>
          </div>
        </dl>

        <div className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-primary"
          />
          <p>
            You’ll be redirected to the payment URL returned by the backend.
            After bKash responds, you’ll return to Planora with your payment
            result.
          </p>
        </div>

        {error ? (
          <p role="alert" className="mt-5 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button
          type="button"
          className="mt-6 w-full sm:w-auto"
          disabled={isStarting}
          onClick={() => void handleStartPayment()}
        >
          {isStarting ? "Connecting to bKash…" : "Continue to bKash"}
          {!isStarting ? <ArrowRight aria-hidden="true" /> : null}
        </Button>
      </section>
    </div>
  );
}
