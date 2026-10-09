"use client";

import { Building2, Check, Plus, RefreshCw, UsersRound } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  addOrganizationMember,
  getOrganizationMembers,
  type OrganizationMember,
  type OrganizationMemberWithUser,
} from "@/lib/api/organizations";
import { useOrganizations } from "./organization-provider";

const inputClassName =
  "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

export function OrganizationManagement() {
  const {
    organizations,
    selectedOrganization,
    isLoading,
    error,
    refreshOrganizations,
    selectOrganization,
    createOrganization,
  } = useOrganizations();
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdOrganizationName, setCreatedOrganizationName] = useState<
    string | null
  >(null);
  const [membersRefreshKey, setMembersRefreshKey] = useState(0);

  function refreshMembers() {
    setMembersRefreshKey((currentKey) => currentKey + 1);
  }

  async function handleCreateOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreatedOrganizationName(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("organizationName") ?? "").trim();

    if (!name) {
      setCreateError("Enter an organization name.");
      return;
    }

    setIsCreating(true);
    try {
      await createOrganization(name);
      setCreatedOrganizationName(name);
      form.reset();
    } catch (creationError) {
      setCreateError(
        creationError instanceof Error
          ? creationError.message
          : "The organization could not be created. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Organizations"
        description="Create and manage the organizations where your teams work."
      />

      {error ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refreshOrganizations()}
          >
            <RefreshCw aria-hidden="true" />
            Retry
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <output className="text-sm text-muted-foreground">
          Loading organizations...
        </output>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section
          aria-labelledby="organization-list-heading"
          className="rounded-xl border bg-card p-5 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2
                id="organization-list-heading"
                className="font-semibold tracking-tight"
              >
                Your organizations
              </h2>
              <p className="text-sm text-muted-foreground">
                Select one to make it your active workspace.
              </p>
            </div>
          </div>

          {organizations.length > 0 ? (
            <ul className="space-y-2">
              {organizations.map((organization) => {
                const isSelected = organization.id === selectedOrganization?.id;
                return (
                  <li key={organization.id}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => selectOrganization(organization.id)}
                      className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-lg border px-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isSelected
                          ? "border-primary/40 bg-primary/5"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <span className="truncate text-sm font-medium">
                        {organization.name}
                      </span>
                      {isSelected ? (
                        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                          <Check aria-hidden="true" className="size-4" />
                          Active
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : isLoading || error ? null : (
            <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
              You do not belong to any organizations yet. Create one to get
              started.
            </p>
          )}
        </section>

        <section
          aria-labelledby="create-organization-heading"
          className="rounded-xl border bg-card p-5 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Plus aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2
                id="create-organization-heading"
                className="font-semibold tracking-tight"
              >
                Create an organization
              </h2>
              <p className="text-sm text-muted-foreground">
                Set up a new home for your team's work.
              </p>
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleCreateOrganization}>
            <div className="space-y-2">
              <label htmlFor="organizationName" className="text-sm font-medium">
                Organization name
              </label>
              <input
                id="organizationName"
                name="organizationName"
                type="text"
                autoComplete="organization"
                placeholder="e.g. Acme Studio"
                className={inputClassName}
                required
                disabled={isCreating}
              />
            </div>
            {createError ? (
              <p role="alert" className="text-sm text-destructive">
                {createError}
              </p>
            ) : null}
            {createdOrganizationName ? (
              <output className="text-sm text-primary">
                {createdOrganizationName} was created and selected as the active
                organization.
              </output>
            ) : null}
            <Button type="submit" disabled={isCreating}>
              <Plus aria-hidden="true" />
              {isCreating ? "Creating..." : "Create organization"}
            </Button>
          </form>
        </section>
      </div>

      <OrganizationMembersList
        key={`${selectedOrganization?.id ?? "no-organization"}-${membersRefreshKey}`}
        organization={selectedOrganization}
      />
      <AddOrganizationMember
        key={selectedOrganization?.id ?? "no-organization"}
        organization={selectedOrganization}
        onMemberAdded={refreshMembers}
      />
    </div>
  );
}

function AddOrganizationMember({
  organization,
  onMemberAdded,
}: {
  organization: { id: string; name: string } | null;
  onMemberAdded: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedMember, setAddedMember] = useState<{
    member: OrganizationMember;
    email: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setAddedMember(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();

    if (!organization) {
      setError("Select an organization before adding a member.");
      return;
    }

    if (!email) {
      setError("Enter the user's email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const member = await addOrganizationMember(organization.id, email);
      setAddedMember({ member, email });
      form.reset();
      onMemberAdded();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The member could not be added. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="organization-members-heading"
      className="rounded-xl border bg-card p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <UsersRound aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2
            id="organization-members-heading"
            className="font-semibold tracking-tight"
          >
            Add an organization member
          </h2>
          <p className="text-sm text-muted-foreground">
            {organization
              ? `Add an existing user to ${organization.name}.`
              : "Select or create an organization before adding a member."}
          </p>
        </div>
      </div>

      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={handleSubmit}
      >
        <div className="min-w-0 flex-1 space-y-2">
          <label
            htmlFor="organizationMemberEmail"
            className="text-sm font-medium"
          >
            Email address
          </label>
          <input
            id="organizationMemberEmail"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="member@example.com"
            className={inputClassName}
            required
            disabled={!organization || isSubmitting}
          />
          <p className="text-xs text-muted-foreground">
            The email address must belong to an existing Planora user.
          </p>
        </div>
        <Button
          type="submit"
          disabled={!organization || isSubmitting}
          className="sm:mb-6"
        >
          <UsersRound aria-hidden="true" />
          {isSubmitting ? "Adding..." : "Add member"}
        </Button>
      </form>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {addedMember ? (
        <output className="mt-4 text-sm text-primary">
          {addedMember.email} was added to {organization?.name}.
        </output>
      ) : null}
    </section>
  );
}

function OrganizationMembersList({
  organization,
}: {
  organization: { id: string; name: string } | null;
}) {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <OrganizationMembersListContent
      key={retryKey}
      organization={organization}
      onRetry={() => setRetryKey((currentKey) => currentKey + 1)}
    />
  );
}

function OrganizationMembersListContent({
  organization,
  onRetry,
}: {
  organization: { id: string; name: string } | null;
  onRetry: () => void;
}) {
  const [members, setMembers] = useState<OrganizationMemberWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(organization));
  const [error, setError] = useState<string | null>(null);
  const organizationId = organization?.id ?? null;

  useEffect(() => {
    let isCurrent = true;

    if (!organizationId) {
      setMembers([]);
      setError(null);
      setIsLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    setMembers([]);
    setError(null);
    setIsLoading(true);

    getOrganizationMembers(organizationId)
      .then((nextMembers) => {
        if (isCurrent) {
          setMembers(nextMembers);
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Organization members could not be loaded. Please try again.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [organizationId]);

  return (
    <section
      aria-labelledby="organization-member-list-heading"
      className="rounded-xl border bg-card p-5 sm:p-6"
      aria-busy={isLoading}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UsersRound aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2
              id="organization-member-list-heading"
              className="font-semibold tracking-tight"
            >
              Organization members
            </h2>
            <p className="text-sm text-muted-foreground">
              {organization
                ? `People in ${organization.name}.`
                : "Create or select an organization to view its members."}
            </p>
          </div>
        </div>
        {organization ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={onRetry}
          >
            <RefreshCw aria-hidden="true" />
            Refresh
          </Button>
        ) : null}
      </div>

      {isLoading ? (
        <output className="text-sm text-muted-foreground">
          Loading members...
        </output>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{error}</p>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw aria-hidden="true" />
            Retry
          </Button>
        </div>
      ) : null}

      {!isLoading && !error && organization && members.length === 0 ? (
        <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
          This organization does not have any members yet.
        </p>
      ) : null}

      {!isLoading && !error && members.length > 0 ? (
        <ul className="divide-y">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {member.user.username}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  {member.role}
                </span>
                <time
                  dateTime={member.createdAt}
                  className="text-xs text-muted-foreground"
                >
                  Joined{" "}
                  {new Date(member.createdAt).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                  })}
                </time>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
