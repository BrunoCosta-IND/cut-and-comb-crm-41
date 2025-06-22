
import { User, Barbershop, Client, Barber, Service, Appointment, Notification } from '@/types';
import { mockClients, mockBarbers, mockServices, mockAppointments } from './mockData';

class Storage {
  // User methods
  saveUser(user: User): void {
    localStorage.setItem(`user-${user.id}`, JSON.stringify(user));
    localStorage.setItem('currentUser', user.id);
  }

  getCurrentUser(): User | null {
    const currentUserId = localStorage.getItem('currentUser');
    if (!currentUserId) return null;
    
    const userData = localStorage.getItem(`user-${currentUserId}`);
    return userData ? JSON.parse(userData) : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', user.id);
    localStorage.setItem(`user-${user.id}`, JSON.stringify(user));
  }

  clearCurrentUser(): void {
    localStorage.removeItem('currentUser');
  }

  getUserByEmail(email: string): User | null {
    // Verificar usuários padrão do sistema
    const defaultUsers = this.getDefaultUsers();
    const defaultUser = defaultUsers.find(user => user.email === email);
    if (defaultUser) {
      return defaultUser;
    }

    // Verificar usuários salvos no localStorage
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('user-')) {
        const userData = localStorage.getItem(key);
        if (userData) {
          const user = JSON.parse(userData);
          if (user.email === email) {
            return user;
          }
        }
      }
    }
    
    return null;
  }

  private getDefaultUsers(): User[] {
    return [
      {
        id: 'creator-1',
        name: 'Creator',
        email: 'creator@barbershop.com',
        role: 'creator',
        barbershopId: 'barbershop-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'admin-1',
        name: 'Administrador',
        email: 'admin@barbeariaelegante.com',
        role: 'admin',
        barbershopId: 'barbershop-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  // Barbershop methods
  saveBarbershop(barbershop: Barbershop): void {
    localStorage.setItem(`barbershop-${barbershop.id}`, JSON.stringify(barbershop));
  }

  getBarbershop(id: string): Barbershop | null {
    const data = localStorage.getItem(`barbershop-${id}`);
    return data ? JSON.parse(data) : null;
  }

  // Client methods
  saveClient(client: Client): void {
    const clients = this.getClients(client.barbershopId);
    const existingIndex = clients.findIndex(c => c.id === client.id);
    
    if (existingIndex >= 0) {
      clients[existingIndex] = client;
    } else {
      clients.push(client);
    }
    
    localStorage.setItem(`clients-${client.barbershopId}`, JSON.stringify(clients));
  }

  getClients(barbershopId: string): Client[] {
    const data = localStorage.getItem(`clients-${barbershopId}`);
    if (data) {
      return JSON.parse(data).map((client: any) => ({
        ...client,
        createdAt: new Date(client.createdAt),
        updatedAt: new Date(client.updatedAt),
        birthDate: client.birthDate ? new Date(client.birthDate) : undefined,
        lastVisit: client.lastVisit ? new Date(client.lastVisit) : undefined
      }));
    }
    return mockClients;
  }

  deleteClient(barbershopId: string, clientId: string): void {
    const clients = this.getClients(barbershopId);
    const filtered = clients.filter(c => c.id !== clientId);
    localStorage.setItem(`clients-${barbershopId}`, JSON.stringify(filtered));
  }

  // Barber methods
  saveBarber(barber: Barber): void {
    const barbers = this.getBarbers(barber.barbershopId);
    const existingIndex = barbers.findIndex(b => b.id === barber.id);
    
    if (existingIndex >= 0) {
      barbers[existingIndex] = barber;
    } else {
      barbers.push(barber);
    }
    
    localStorage.setItem(`barbers-${barber.barbershopId}`, JSON.stringify(barbers));
  }

  getBarbers(barbershopId: string): Barber[] {
    const data = localStorage.getItem(`barbers-${barbershopId}`);
    if (data) {
      return JSON.parse(data).map((barber: any) => ({
        ...barber,
        createdAt: new Date(barber.createdAt),
        updatedAt: new Date(barber.updatedAt)
      }));
    }
    return mockBarbers;
  }

  deleteBarber(barbershopId: string, barberId: string): void {
    const barbers = this.getBarbers(barbershopId);
    const filtered = barbers.filter(b => b.id !== barberId);
    localStorage.setItem(`barbers-${barbershopId}`, JSON.stringify(filtered));
  }

  // Service methods
  saveService(service: Service): void {
    const services = this.getServices(service.barbershopId);
    const existingIndex = services.findIndex(s => s.id === service.id);
    
    if (existingIndex >= 0) {
      services[existingIndex] = service;
    } else {
      services.push(service);
    }
    
    localStorage.setItem(`services-${service.barbershopId}`, JSON.stringify(services));
  }

  getServices(barbershopId: string): Service[] {
    const data = localStorage.getItem(`services-${barbershopId}`);
    if (data) {
      return JSON.parse(data).map((service: any) => ({
        ...service,
        createdAt: new Date(service.createdAt),
        updatedAt: new Date(service.updatedAt)
      }));
    }
    return mockServices;
  }

  deleteService(barbershopId: string, serviceId: string): void {
    const services = this.getServices(barbershopId);
    const filtered = services.filter(s => s.id !== serviceId);
    localStorage.setItem(`services-${barbershopId}`, JSON.stringify(filtered));
  }

  // Appointment methods
  saveAppointment(appointment: Appointment): void {
    const appointments = this.getAppointments(appointment.barbershopId);
    const existingIndex = appointments.findIndex(a => a.id === appointment.id);
    
    if (existingIndex >= 0) {
      appointments[existingIndex] = appointment;
    } else {
      appointments.push(appointment);
    }
    
    localStorage.setItem(`appointments-${appointment.barbershopId}`, JSON.stringify(appointments));
  }

  getAppointments(barbershopId: string): Appointment[] {
    const data = localStorage.getItem(`appointments-${barbershopId}`);
    if (data) {
      return JSON.parse(data).map((appointment: any) => ({
        ...appointment,
        date: new Date(appointment.date),
        createdAt: new Date(appointment.createdAt),
        updatedAt: new Date(appointment.updatedAt)
      }));
    }
    return mockAppointments.map(apt => ({
      ...apt,
      date: new Date(apt.date),
      createdAt: new Date(apt.createdAt),
      updatedAt: new Date(apt.updatedAt)
    }));
  }

  deleteAppointment(barbershopId: string, appointmentId: string): void {
    const appointments = this.getAppointments(barbershopId);
    const filtered = appointments.filter(a => a.id !== appointmentId);
    localStorage.setItem(`appointments-${barbershopId}`, JSON.stringify(filtered));
  }

  // Notification methods
  saveNotification(notification: Notification): void {
    const notifications = this.getNotifications(notification.barbershopId);
    notifications.push(notification);
    localStorage.setItem(`notifications-${notification.barbershopId}`, JSON.stringify(notifications));
  }

  getNotifications(barbershopId: string): Notification[] {
    const data = localStorage.getItem(`notifications-${barbershopId}`);
    if (data) {
      return JSON.parse(data).map((notification: any) => ({
        ...notification,
        createdAt: new Date(notification.createdAt)
      }));
    }
    return [];
  }

  markNotificationAsRead(barbershopId: string, notificationId: string): void {
    const notifications = this.getNotifications(barbershopId);
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      localStorage.setItem(`notifications-${barbershopId}`, JSON.stringify(notifications));
    }
  }

  // Clear all data
  clearAllData(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('user-') || 
          key.startsWith('barbershop-') || 
          key.startsWith('clients-') || 
          key.startsWith('barbers-') || 
          key.startsWith('services-') || 
          key.startsWith('appointments-') || 
          key.startsWith('notifications-') ||
          key === 'currentUser') {
        localStorage.removeItem(key);
      }
    });
  }
}

export const storage = new Storage();

// Initialize default data function
export const initializeDefaultData = () => {
  const hasInitialized = localStorage.getItem('initialized');
  if (!hasInitialized) {
    // Inicializar barbearia padrão
    const defaultBarbershop: Barbershop = {
      id: 'barbershop-1',
      name: 'Barbearia Elegante',
      phone: '(11) 99999-9999',
      email: 'contato@barbeariaelegante.com',
      workingHours: {
        monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        saturday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
        sunday: { isOpen: false, openTime: '', closeTime: '' }
      },
      webhooks: {
        appointmentConfirmed: {
          url: 'https://n8n.exemplo.com/webhook/confirmacao',
          enabled: true
        },
        appointmentReminder: {
          url: 'https://n8n.exemplo.com/webhook/lembrete',
          enabled: true
        },
        inactiveClient: {
          url: 'https://n8n.exemplo.com/webhook/cliente-inativo',
          enabled: false
        }
      },
      theme: {
        primaryColor: '#D4AF37',
        secondaryColor: '#F4E4BC'
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    };
    
    storage.saveBarbershop(defaultBarbershop);
    
    // Initialize with mock data
    mockClients.forEach(client => storage.saveClient(client));
    mockBarbers.forEach(barber => storage.saveBarber(barber));
    mockServices.forEach(service => storage.saveService(service));
    mockAppointments.forEach(appointment => storage.saveAppointment(appointment));
    
    localStorage.setItem('initialized', 'true');
  }
};
