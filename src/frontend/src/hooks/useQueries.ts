import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Status,
  Status__1,
  Status__2,
  T,
  T__1,
  T__2,
  T__3,
  T__4,
  UserRole,
} from "../backend.d";
import { useActor } from "./useActor";

export type {
  T,
  T__1,
  T__2,
  T__3,
  T__4,
  UserRole,
  Status,
  Status__1,
  Status__2,
};

// ── Auth & Profile ──────────────────────────────────────────────────────────

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return "guest" as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<T__4 | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    gcTime: 120_000,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: T__4) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// ── Clients ─────────────────────────────────────────────────────────────────

export function useClients() {
  const { actor, isFetching } = useActor();
  return useQuery<T__2[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useClient(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<T__2 | null>({
    queryKey: ["client", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getClient(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useCreateClient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (client: T__2) => {
      if (!actor) throw new Error("Not connected");
      return actor.createClient(client);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useUpdateClient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, client }: { id: bigint; client: T__2 }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateClient(id, client);
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client", id.toString()] });
    },
  });
}

export function useDeleteClient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteClient(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useTotalClientsCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalClientsCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalClientsCount();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

// ── Interactions ─────────────────────────────────────────────────────────────

export function useInteractions() {
  const { actor, isFetching } = useActor();
  return useQuery<T__1[]>({
    queryKey: ["interactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInteractions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useInteractionsSummary() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    won: bigint;
    closed: bigint;
    lost: bigint;
    open: bigint;
    inProgress: bigint;
  }>({
    queryKey: ["interactionsSummary"],
    queryFn: async () => {
      if (!actor)
        return { won: 0n, closed: 0n, lost: 0n, open: 0n, inProgress: 0n };
      return actor.getInteractionsSummary();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function usePipelineStats() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    offer: bigint;
    order: bigint;
    inquiry: bigint;
    followup: bigint;
  }>({
    queryKey: ["pipelineStats"],
    queryFn: async () => {
      if (!actor) return { offer: 0n, order: 0n, inquiry: 0n, followup: 0n };
      return actor.getPipelineStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useCreateInteraction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (interaction: T__1) => {
      if (!actor) throw new Error("Not connected");
      return actor.createInteraction(interaction);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interactions"] });
      qc.invalidateQueries({ queryKey: ["interactionsSummary"] });
      qc.invalidateQueries({ queryKey: ["pipelineStats"] });
    },
  });
}

export function useUpdateInteraction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      interaction,
    }: { id: bigint; interaction: T__1 }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateInteraction(id, interaction);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interactions"] });
      qc.invalidateQueries({ queryKey: ["interactionsSummary"] });
      qc.invalidateQueries({ queryKey: ["pipelineStats"] });
    },
  });
}

export function useDeleteInteraction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteInteraction(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interactions"] });
      qc.invalidateQueries({ queryKey: ["interactionsSummary"] });
      qc.invalidateQueries({ queryKey: ["pipelineStats"] });
    },
  });
}

// ── Visits ───────────────────────────────────────────────────────────────────

export function useAllVisits(enabled = true) {
  const { actor, isFetching } = useActor();
  return useQuery<T[]>({
    queryKey: ["allVisits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVisits();
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useMyVisits(enabled = true) {
  const { actor, isFetching } = useActor();
  return useQuery<T[]>({
    queryKey: ["myVisits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVisitsForCaller();
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useCreateVisit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (visit: T) => {
      if (!actor) throw new Error("Not connected");
      return actor.createVisitLog(visit);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allVisits"] });
      qc.invalidateQueries({ queryKey: ["myVisits"] });
    },
  });
}

export function useUpdateVisit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, visit }: { id: bigint; visit: T }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateVisitLog(id, visit);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allVisits"] });
      qc.invalidateQueries({ queryKey: ["myVisits"] });
    },
  });
}

export function useDeleteVisit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteVisitLog(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allVisits"] });
      qc.invalidateQueries({ queryKey: ["myVisits"] });
    },
  });
}

export function useVisitLogsCountPerStaff() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[Principal, bigint]>>({
    queryKey: ["visitLogsCountPerStaff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVisitLogsCountPerStaff();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

// ── TA DA Claims ─────────────────────────────────────────────────────────────

export function useAllClaims(enabled = true) {
  const { actor, isFetching } = useActor();
  return useQuery<T__3[]>({
    queryKey: ["allClaims"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClaims();
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useMyClaims(enabled = true) {
  const { actor, isFetching } = useActor();
  return useQuery<T__3[]>({
    queryKey: ["myClaims"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClaimsForCaller();
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useSubmitClaim() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (claim: T__3) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitClaim(claim);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allClaims"] });
      qc.invalidateQueries({ queryKey: ["myClaims"] });
      qc.invalidateQueries({ queryKey: ["claimsSummaryPerStaff"] });
    },
  });
}

export function useApproveClaim() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, remarks }: { id: bigint; remarks: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.approveClaim(id, remarks);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allClaims"] });
      qc.invalidateQueries({ queryKey: ["claimsSummaryPerStaff"] });
    },
  });
}

export function useRejectClaim() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, remarks }: { id: bigint; remarks: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.rejectClaim(id, remarks);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allClaims"] });
      qc.invalidateQueries({ queryKey: ["claimsSummaryPerStaff"] });
    },
  });
}

export function useClaimsSummaryPerStaff() {
  const { actor, isFetching } = useActor();
  return useQuery<
    Array<[Principal, { totalApprovedAmount: bigint; totalSubmitted: bigint }]>
  >({
    queryKey: ["claimsSummaryPerStaff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClaimsSummaryPerStaff();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

// ── Staff Management ─────────────────────────────────────────────────────────

export function useAssignRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Not connected");
      await actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userRole"] });
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useGetUserProfile(user: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<T__4 | null>({
    queryKey: ["userProfile", user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      return actor.getUserProfile(user);
    },
    enabled: !!actor && !isFetching && user !== null,
  });
}
