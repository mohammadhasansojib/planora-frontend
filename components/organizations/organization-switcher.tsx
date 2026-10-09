"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrganizations } from "./organization-provider";

export function OrganizationSwitcher() {
  const {
    organizations,
    selectedOrganization,
    isLoading,
    error,
    refreshOrganizations,
    selectOrganization,
  } = useOrganizations();

  if (isLoading && organizations.length === 0) {
    return (
      <output className="hidden text-xs text-muted-foreground sm:block">
        Loading organizations...
      </output>
    );
  }

  if (error && organizations.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden max-w-40 truncate text-xs text-destructive sm:block">
          Organizations unavailable
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Retry loading organizations"
          onClick={() => void refreshOrganizations()}
        >
          <RefreshCw aria-hidden="true" />
        </Button>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <span className="hidden text-xs text-muted-foreground sm:block">
        No organizations
      </span>
    );
  }

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">Active organization</span>
      <select
        aria-label="Active organization"
        value={selectedOrganization?.id ?? ""}
        disabled={isLoading}
        onChange={(event) => selectOrganization(event.currentTarget.value)}
        className="h-8 max-w-36 rounded-lg border bg-background px-2 text-xs sm:max-w-56 sm:text-sm"
      >
        {organizations.map((organization) => (
          <option key={organization.id} value={organization.id}>
            {organization.name}
          </option>
        ))}
      </select>
    </label>
  );
}
