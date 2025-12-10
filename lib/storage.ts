// Storage service for managing data persistence using JSON files
import type { User, Entity, Courrier, CourierType, Category, RefState } from "./types"
import { Role } from "./types"

interface StorageData {
  users: User[]
  entities: Entity[]
  courriers: Courrier[]
  courierTypes: CourierType[]
  categories: Category[]
  refStates: RefState[]
}

const STORAGE_KEY = "mail_system_data"

class StorageService {
  private data: StorageData

  constructor() {
    this.data = this.loadData()
  }

  private loadData(): StorageData {
    if (typeof window === "undefined") {
      return this.getDefaultData()
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        console.error("Failed to parse stored data, using defaults")
        return this.getDefaultData()
      }
    }
    return this.getDefaultData()
  }

  private getDefaultData(): StorageData {
    return {
      users: [
        {
          id: "1",
          email: "admin@estsb.edu",
          name: "Admin EST SB",
          password: "hashedPassword123",
          role: Role.SUPER_ADMIN,
          createdAt: new Date(),
          isActive: true,
        },
        {
          id: "2",
          email: "chef.info@estsb.edu",
          name: "Chef Informatique",
          password: "hashedPassword123",
          role: Role.CHEF,
          entityId: "1",
          createdAt: new Date(),
          isActive: true,
        },
        {
          id: "3",
          email: "agent.mail@estsb.edu",
          name: "Agent Courrier",
          password: "hashedPassword123",
          role: Role.AGENT,
          createdAt: new Date(),
          isActive: true,
        },
      ],
      entities: [
        {
          id: "1",
          label: "Informatique",
          description: "Department of Computer Science",
          chefId: "2",
          email: "info@estsb.edu",
          phone: "+212 5XX XXX XXX",
          code: "INFO",
          createdAt: new Date(),
        },
        {
          id: "2",
          label: "Génie Mécanique",
          description: "Department of Mechanical Engineering",
          email: "mechanic@estsb.edu",
          phone: "+212 5XX XXX XXX",
          code: "MECH",
          createdAt: new Date(),
        },
        {
          id: "3",
          label: "Administration",
          description: "Administrative Department",
          email: "admin@estsb.edu",
          phone: "+212 5XX XXX XXX",
          code: "ADM",
          createdAt: new Date(),
        },
      ],
      courriers: [],
      courierTypes: [
        {
          id: "1",
          label: "Entrant",
          description: "Incoming mail",
        },
        {
          id: "2",
          label: "Sortant",
          description: "Outgoing mail",
        },
        {
          id: "3",
          label: "Interne",
          description: "Internal mail",
        },
      ],
      categories: [
        { id: "1", label: "Réclamation", description: "Complaints" },
        { id: "2", label: "Incident", description: "Incidents" },
        { id: "3", label: "Demande", description: "Requests" },
        { id: "4", label: "Administration", description: "Administrative" },
        { id: "5", label: "Convocation", description: "Summons" },
        { id: "6", label: "Autre", description: "Other" },
      ],
      refStates: [
        { id: "1", label: "Nouveau", color: "#3B82F6" },
        { id: "2", label: "En cours", color: "#F59E0B" },
        { id: "3", label: "Traité", color: "#10B981" },
        { id: "4", label: "Rejeté", color: "#EF4444" },
        { id: "5", label: "Archivé", color: "#6B7280" },
      ],
    }
  }

  private save(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
      } catch (error) {
        console.error("Failed to save data to localStorage:", error)
      }
    }
  }

  getUsers(): User[] {
    return this.data.users
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id)
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email === email)
  }

  addUser(user: User): void {
    this.data.users.push(user)
    this.save()
  }

  updateUser(id: string, updates: Partial<User>): void {
    const user = this.data.users.find((u) => u.id === id)
    if (user) {
      Object.assign(user, updates)
      this.save()
    }
  }

  deleteUser(id: string): void {
    this.data.users = this.data.users.filter((u) => u.id !== id)
    this.save()
  }

  // Entity operations
  getEntities(): Entity[] {
    return this.data.entities
  }

  getEntityById(id: string): Entity | undefined {
    return this.data.entities.find((e) => e.id === id)
  }

  addEntity(entity: Entity): void {
    this.data.entities.push(entity)
    this.save()
  }

  updateEntity(id: string, updates: Partial<Entity>): void {
    const entity = this.data.entities.find((e) => e.id === id)
    if (entity) {
      Object.assign(entity, updates)
      this.save()
    }
  }

  deleteEntity(id: string): void {
    this.data.entities = this.data.entities.filter((e) => e.id !== id)
    this.save()
  }

  // Courrier operations
  getCourriers(): Courrier[] {
    return this.data.courriers
  }

  getCourrierById(id: string): Courrier | undefined {
    return this.data.courriers.find((c) => c.id === id)
  }

  addCourrier(courrier: Courrier): void {
    this.data.courriers.push(courrier)
    this.save()
  }

  updateCourrier(id: string, updates: Partial<Courrier>): void {
    const courrier = this.data.courriers.find((c) => c.id === id)
    if (courrier) {
      Object.assign(courrier, updates)
      this.save()
    }
  }

  deleteCourrier(id: string): void {
    this.data.courriers = this.data.courriers.filter((c) => c.id !== id)
    this.save()
  }

  // Referentials operations
  getCourierTypes(): CourierType[] {
    return this.data.courierTypes
  }

  addCourierType(type: CourierType): void {
    this.data.courierTypes.push(type)
    this.save()
  }

  updateCourierType(id: string, updates: Partial<CourierType>): void {
    const type = this.data.courierTypes.find((t) => t.id === id)
    if (type) {
      Object.assign(type, updates)
      this.save()
    }
  }

  deleteCourierType(id: string): void {
    this.data.courierTypes = this.data.courierTypes.filter((t) => t.id !== id)
    this.save()
  }

  getCategories(): Category[] {
    return this.data.categories
  }

  addCategory(category: Category): void {
    this.data.categories.push(category)
    this.save()
  }

  updateCategory(id: string, updates: Partial<Category>): void {
    const category = this.data.categories.find((c) => c.id === id)
    if (category) {
      Object.assign(category, updates)
      this.save()
    }
  }

  deleteCategory(id: string): void {
    this.data.categories = this.data.categories.filter((c) => c.id !== id)
    this.save()
  }

  getRefStates(): RefState[] {
    return this.data.refStates
  }

  addRefState(state: RefState): void {
    this.data.refStates.push(state)
    this.save()
  }

  updateRefState(id: string, updates: Partial<RefState>): void {
    const state = this.data.refStates.find((s) => s.id === id)
    if (state) {
      Object.assign(state, updates)
      this.save()
    }
  }

  deleteRefState(id: string): void {
    this.data.refStates = this.data.refStates.filter((s) => s.id !== id)
    this.save()
  }
}

export const storage = new StorageService()
