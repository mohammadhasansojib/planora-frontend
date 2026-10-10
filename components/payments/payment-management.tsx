"use client";

import { ArrowRight, CreditCard, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  createPayment,
  getPayments,
  type Payment,
  type PaymentPagination,
} from "@/lib/api/payments";

const PAGE_SIZE = 10;

const paymentStatusStyles = {
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  COMPLETED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  FAILED: "border-destructive/30 bg-destructive/10 text-destructive",
  CANCELLED: "border-muted bg-muted text-muted-foreground",
} as const;

function formatAmount(amount: string) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
}

export function PaymentManagement() {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<PaymentPagination | null>(null);
  const [query, setQuery] = useState({ page: 1, refreshKey: 0 });
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    setIsLoadingPayments(true);
    setPaymentsError(null);

    getPayments(query.page, PAGE_SIZE)
      .then((result) => {
        if (isCurrent) {
          setPayments(result.payments);
          setPagination(result.pagination);
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setPaymentsError(
            loadError instanceof Error
              ? loadError.message
              : "Payments could not be loaded. Please try again.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoadingPayments(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [query]);

  function reloadPayments() {
    setQuery((current) => ({
      ...current,
      refreshKey: current.refreshKey + 1,
    }));
  }

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

      <section
        aria-labelledby="payment-history-heading"
        className="rounded-xl border bg-card p-5 sm:p-6"
        aria-busy={isLoadingPayments}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2
              id="payment-history-heading"
              className="font-semibold tracking-tight"
            >
              Payment history
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Checkout attempts and their latest status.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoadingPayments}
            onClick={reloadPayments}
          >
            <RefreshCw aria-hidden="true" />
            Refresh
          </Button>
        </div>

        {isLoadingPayments ? (
          <output className="text-sm text-muted-foreground">
            Loading payment history...
          </output>
        ) : null}

        {paymentsError ? (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
          >
            <p>{paymentsError}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={reloadPayments}
            >
              Retry
            </Button>
          </div>
        ) : null}

        {!isLoadingPayments && !paymentsError && payments.length === 0 ? (
          <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
            You have no payment attempts yet.
          </p>
        ) : null}

        {!isLoadingPayments && !paymentsError && payments.length > 0 ? (
          <>
            <ul className="divide-y">
              {payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex flex-col gap-3 py-4 first:pt-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {formatAmount(payment.amount)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {payment.transactionId
                        ? `Transaction ID: ${payment.transactionId}`
                        : `Payment ID: ${payment.paymentId}`}
                    </p>
                  </div>
                  <span
                    className={`w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${
                      paymentStatusStyles[payment.status]
                    }`}
                  >
                    {payment.status.charAt(0) +
                      payment.status.slice(1).toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
            {pagination ? (
              <div className="mt-3 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {pagination.total}{" "}
                  {pagination.total === 1 ? "payment" : "payments"} · Page{" "}
                  {query.page} of {Math.max(pagination.totalPages, 1)}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={query.page <= 1 || isLoadingPayments}
                    onClick={() =>
                      setQuery((current) => ({
                        ...current,
                        page: current.page - 1,
                      }))
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={
                      query.page >= Math.max(pagination.totalPages, 1) ||
                      isLoadingPayments
                    }
                    onClick={() =>
                      setQuery((current) => ({
                        ...current,
                        page: current.page + 1,
                      }))
                    }
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
  );
}
