"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createOrganization as createOrganizationRequest,
  getOrganizations,
  type Organization,
} from "@/lib/api/organizations";

type OrganizationContextValue = {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
  refreshOrganizations: () => Promise<void>;
  selectOrganization: (organizationId: string) => void;
  createOrganization: (name: string) => Promise<Organization>;
};

const OrganizationContext = createContext<OrganizationContextValue | null>(
  null,
);

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Organizations could not be loaded. Please try again.";
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextOrganizations = await getOrganizations();
      setOrganizations(nextOrganizations);
      setSelectedOrganizationId((currentId) => {
        if (nextOrganizations.some(({ id }) => id === currentId)) {
          return currentId;
        }

        return nextOrganizations[0]?.id ?? null;
      });
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshOrganizations();
  }, [refreshOrganizations]);

  const selectOrganization = useCallback(
    (organizationId: string) => {
      if (organizations.some(({ id }) => id === organizationId)) {
        setSelectedOrganizationId(organizationId);
      }
    },
    [organizations],
  );

  const createOrganization = useCallback(async (name: string) => {
    const organization = await createOrganizationRequest(name);
    setOrganizations((currentOrganizations) => [
      organization,
      ...currentOrganizations.filter(({ id }) => id !== organization.id),
    ]);
    setSelectedOrganizationId(organization.id);
    setError(null);
    return organization;
  }, []);

  const selectedOrganization =
    organizations.find(({ id }) => id === selectedOrganizationId) ?? null;

  const contextValue = useMemo(
    () => ({
      organizations,
      selectedOrganization,
      isLoading,
      error,
      refreshOrganizations,
      selectOrganization,
      createOrganization,
    }),
    [
      organizations,
      selectedOrganization,
      isLoading,
      error,
      refreshOrganizations,
      selectOrganization,
      createOrganization,
    ],
  );

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizations() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganizations must be used within an OrganizationProvider.",
    );
  }

  return context;
}
