
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'creator';
  barbershopId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Barbershop {
  id: string;
  name: string;
  logo?: string;
  phone: string;
  email: string;
  workingHours: WorkingHours;
  webhooks: Webhooks;
  theme: Theme;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface Webhooks {
  appointmentConfirmed: WebhookConfig;
  appointmentReminder: WebhookConfig;
  inactiveClient: WebhookConfig;
}

export interface WebhookConfig {
  url: string;
  enabled: boolean;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
}

export interface Client {
  id: string;
  barbershopId: string;
  name: string;
  phone: string;
  email?: string;
  birthDate?: Date;
  notes?: string;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'rarely';
  lastVisit?: Date;
  totalVisits: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Barber {
  id: string;
  barbershopId: string;
  name: string;
  phone: string;
  email?: string;
  status: 'active' | 'inactive';
  availability: WorkingHours;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  barbershopId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // em minutos
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  barbershopId: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  price: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  client?: Client;
  barber?: Barber;
  service?: Service;
}

export interface Notification {
  id: string;
  barbershopId: string;
  type: 'appointment_reminder' | 'appointment_confirmed' | 'appointment_cancelled' | 'client_inactive';
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string; // ID do agendamento ou cliente relacionado
  createdAt: Date;
}

export interface DashboardStats {
  todayAppointments: number;
  todayRevenue: number;
  monthlyRevenue: number;
  newClientsThisMonth: number;
  nextAppointments: Appointment[];
  topServices: ServiceStats[];
  inactiveClients: Client[];
}

export interface ServiceStats {
  service: Service;
  count: number;
  revenue: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  appointments: number;
}
