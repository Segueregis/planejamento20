
// Service Order Types
export enum ServiceOrderStatus {
  COMPLETED = "OS Concluídas",
  WAITING_SCHEDULE = "Aguardando Programação",
  IN_PROGRESS = "Em Andamento", 
  SCHEDULED = "Programado",
  PRIORITY = "Prioridade",
  WAITING_PHOTO_EMAIL = "Foto Email",
  WAITING_MATERIAL = "Aguardando Material"
}

export interface ServiceOrder {
  id: string;
  osPrisma: string;
  osMaximo: string;
  description: string;
  workshop: string;
  technicians: string[]; // Changed to support multiple technicians
  location: string;
  sector: string;
  status: ServiceOrderStatus;
  createdDate: string;
  scheduledDate?: string;
  completedDate?: string;
}

// Technician Types  
export enum TechnicianStatus {
  AVAILABLE = "Disponível",
  BUSY = "Ocupado",
  MAINTENANCE = "Em Manutenção",
  VACATION = "Férias"
}

export interface Technician {
  id: string;
  name: string;
  specialization: string;
  workshop: string;
  contact: string;
  status: TechnicianStatus;
  activeOrders: number;
}

// Workshop Types
export interface Workshop {
  id: string;
  name: string;
  location: string;
  capacity: number;
  activeOrders: number;
}

// Dashboard Types
export interface DashboardStats {
  totalServiceOrders: number;
  completed: number;
  waitingSchedule: number;
  inProgress: number;
  scheduled: number;
  priority: number;
  waitingPhotoEmail: number;
  waitingMaterial: number;
  totalTechnicians: number;
  availableTechnicians: number;
  busyTechnicians: number;
  techniciansOnMaintenance: number;
}

// Common Component Props
export interface StatusCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  status?: "success" | "warning" | "danger" | "info" | "neutral";
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
  onClick?: () => void;
}
