import type { Metadata } from "next";
import { PaymentManagement } from "@/components/payments/payment-management";

export const metadata: Metadata = {
  title: "Payments",
};

export default function PaymentsPage() {
  return <PaymentManagement />;
}
