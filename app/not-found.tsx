import type { Metadata } from "next";
import { NotFoundPage } from "@/components/layout/not-found-page";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return <NotFoundPage />;
}
