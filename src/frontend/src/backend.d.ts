import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface T__3 {
    id: bigint;
    status: Status__2;
    dailyAllowance: bigint;
    locationsVisited: string;
    userId: Principal;
    date: bigint;
    travelAllowance: bigint;
    submittedAt: bigint;
    notes: string;
    adminRemarks: string;
}
export interface T__2 {
    id: bigint;
    name: string;
    createdAt: bigint;
    createdBy: Principal;
    email: string;
    updatedAt: bigint;
    company: string;
    address: string;
    notes: string;
    phone: string;
}
export interface T {
    id: bigint;
    plannedDate: bigint;
    status: Status;
    completedAt: bigint;
    clientId: bigint;
    userId: Principal;
    purpose: string;
    completionNotes: string;
}
export interface T__1 {
    id: bigint;
    status: Status__1;
    title: string;
    clientId: bigint;
    date: bigint;
    createdBy: Principal;
    type: string;
    description: string;
    updatedAt: bigint;
    amount?: bigint;
}
export interface T__4 {
    name: string;
    createdAt: bigint;
}
export enum Status {
    cancelled = "cancelled",
    completed = "completed",
    planned = "planned"
}
export enum Status__1 {
    won = "won",
    closed = "closed",
    lost = "lost",
    open = "open",
    inProgress = "inProgress"
}
export enum Status__2 {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveClaim(id: bigint, remarks: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createClient(client: T__2): Promise<bigint>;
    createInteraction(interaction: T__1): Promise<bigint>;
    createVisitLog(visit: T): Promise<bigint>;
    deleteClient(id: bigint): Promise<void>;
    deleteInteraction(id: bigint): Promise<void>;
    deleteVisitLog(id: bigint): Promise<void>;
    getAllClaims(): Promise<Array<T__3>>;
    getAllClients(): Promise<Array<T__2>>;
    getAllInteractions(): Promise<Array<T__1>>;
    getAllVisits(): Promise<Array<T>>;
    getCallerUserProfile(): Promise<T__4 | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClaimsForCaller(): Promise<Array<T__3>>;
    getClaimsSummaryPerStaff(): Promise<Array<[Principal, {
            totalApprovedAmount: bigint;
            totalSubmitted: bigint;
        }]>>;
    getClient(id: bigint): Promise<T__2 | null>;
    getInteraction(id: bigint): Promise<T__1 | null>;
    getInteractionsSummary(): Promise<{
        won: bigint;
        closed: bigint;
        lost: bigint;
        open: bigint;
        inProgress: bigint;
    }>;
    getPipelineStats(): Promise<{
        offer: bigint;
        order: bigint;
        inquiry: bigint;
        followup: bigint;
    }>;
    getTotalClientsCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<T__4 | null>;
    getVisitLogsCountPerStaff(): Promise<Array<[Principal, bigint]>>;
    getVisitsForCaller(): Promise<Array<T>>;
    isCallerAdmin(): Promise<boolean>;
    rejectClaim(id: bigint, remarks: string): Promise<void>;
    saveCallerUserProfile(profile: T__4): Promise<void>;
    submitClaim(claimInput: T__3): Promise<bigint>;
    updateClient(id: bigint, client: T__2): Promise<void>;
    updateInteraction(id: bigint, interaction: T__1): Promise<void>;
    updateVisitLog(id: bigint, visit: T): Promise<void>;
}
