// Type definitions for the mail management system

export interface User {
  id: string
  email: string
  name: string
  password: string
  role: Role
  entityId?: string
  createdAt: Date
  isActive: boolean
}

export enum Role {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  CHEF = "chef",
  AGENT = "agent",
  AUDITOR = "auditor",
}

export interface Entity {
  id: string
  label: string
  description: string
  parentEntityId?: string
  chefId?: string
  email?: string
  phone?: string
  code?: string
  createdAt: Date
}

export interface Courier {
  id: string
  reference: string
  fromEntity?: string
  toEntity: string
  type: string // Changed from CourierType to string to avoid redeclaration
  category: string
  state: CourierState
  subject: string
  description: string
  priority: Priority
  createdBy: string
  createdAt: Date
  attachments: Attachment[]
  assignedTo?: string
  history: StateHistory[]
}

export enum CourierState {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  TREATED = "treated",
  REJECTED = "rejected",
  ARCHIVED = "archived",
}

export enum Priority {
  NORMAL = "normal",
  URGENT = "urgent",
  VERY_URGENT = "very_urgent",
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

export interface StateHistory {
  state: CourierState
  changedBy: string
  changedAt: Date
  notes?: string
}

export interface Category {
  id: string
  label: string
  description: string
}

export interface RefState {
  id: string
  label: string
  description: string
  color?: string
}

export interface DashboardStats {
  totalCourriers: number
  couriersByState: Record<CourierState, number>
  couriersByType: Record<string, number> // Changed from CourierType to string to avoid redeclaration
  couriersByCategory: Record<string, number>
  couriersByPriority: Record<Priority, number>
  monthlyTrend: Array<{ month: string; count: number }>
}

export interface CourierType {
  id: string
  label: string
  description: string
}
