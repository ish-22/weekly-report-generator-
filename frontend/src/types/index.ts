export enum RoleName {
    TEAM_MEMBER = 'TEAM_MEMBER',
    MANAGER = 'MANAGER',
    ADMIN = 'ADMIN'
}

export enum ReportStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    NEEDS_CORRECTION = 'NEEDS_CORRECTION',
    APPROVED = 'APPROVED'
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export enum TaskStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    BLOCKED = 'BLOCKED'
}

export enum TaskType {
    DEVELOPMENT = 'DEVELOPMENT',
    TESTING = 'TESTING',
    MEETING = 'MEETING',
    DOCUMENTATION = 'DOCUMENTATION',
    DESIGN = 'DESIGN',
    RESEARCH = 'RESEARCH',
    OTHER = 'OTHER'
}

export enum ReviewAction {
    APPROVED = 'APPROVED',
    REQUESTED_CHANGES = 'REQUESTED_CHANGES'
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    roleId: string;
    avatarUrl?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    role?: Role;
}

export interface Role {
    id: string;
    name: RoleName;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ReportTask {
    id: string;
    reportId: string;
    name: string;
    priority: TaskPriority;
    taskType: TaskType;
    status: TaskStatus;
    plannedPercentage: number;
    actualPercentage: number;
    plannedHours: number;
    timeSpentHours: number;
    outputDeliverable?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Report {
    id: string;
    userId: string;
    projectId: string;
    weekStartDate: string;
    weekEndDate: string;
    status: ReportStatus;
    currentVersionNumber: number;
    tasksPlannedNextWeek?: string | null;
    blockers?: string | null;
    isKeyBlocker: boolean;
    achievements?: string | null;
    isKeyAchievement: boolean;
    optionalNotes?: string | null;
    createdAt: string;
    updatedAt: string;
    user?: User;
    project?: Project;
    tasks?: ReportTask[];
    versions?: ReportVersion[];
    reviewHistories?: ReviewHistory[];
}

export interface ReportVersion {
    id: string;
    reportId: string;
    versionNumber: number;
    snapshotData: any; // Defines JSON
    statusAtSubmission: ReportStatus;
    submittedAt: string;
    submittedByUserId: string;
    submittedByUser?: User;
    reviews?: ReviewHistory[];
}

export interface ReviewHistory {
    id: string;
    reportId: string;
    reportVersionId: string;
    reviewerId: string;
    action: ReviewAction;
    comment?: string | null;
    createdAt: string;
    reviewer?: User;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: any;
    meta?: any;
}

export interface PaginatedData<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
