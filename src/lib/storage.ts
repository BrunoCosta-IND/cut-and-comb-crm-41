import { User, Barbershop, Client, Barber, Service, Appointment, Notification } from '@/types';
import { mockClients, mockBarbers, mockServices, mockAppointments } from './mockData';
import { AppError } from './errorHandler';

class Storage {
  private validateBarbershopId(barbershopId: string): void {
    if (!barbershopId || barbershopId.trim() === '') {
      throw new AppError('ID da barbearia é obrigatório');
    }
  }

  private validateId(id: string, entityName: string): void {
    if (!id || id.trim() === '') {
      throw new AppError(`ID do ${entityName} é obrigatório`);
    }
  }

  private safeJsonParse<T>(data: string | null, fallback: T): T {
    if (!data) return fallback;
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      return fallback;
    }
  }

  private safeJsonStringify(data: any): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error('Erro ao stringify JSON:', error);
      throw new AppError('Erro ao salvar dados');
    }
  }

  // User methods
  saveUser(user: User): void {
    try {
      this.validateId(user.id, 'usuário');
      localStorage.setItem(`user-${user.id}`, this.safeJsonStringify(user));
      localStorage.setItem('currentUser', user.id);
    } catch (error) {
      throw new AppError('Erro ao salvar usuário');
    }
  }

  getCurrentUser(): User | null {
    try {
      const currentUserId = localStorage.getItem('currentUser');
      if (!currentUserId) return null;
      
      const userData = localStorage.getItem(`user-${currentUserId}`);
      return this.safeJsonParse(userData, null);
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  }

  setCurrentUser(user: User): void {
    try {
      this.validateId(user.id, 'usuário');
      localStorage.setItem('currentUser', user.id);
      localStorage.setItem(`user-${user.id}`, this.safeJsonStringify(user));
    } catch (error) {
      throw new AppError('Erro ao definir usuário atual');
    }
  }

  clearCurrentUser(): void {
    try {
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Erro ao limpar usuário atual:', error);
    }
  }

  getUserByEmail(email: string): User | null {
    if (!email || !email.includes('@')) {
      throw new AppError('Email inválido');
    }

    try {
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
            const user = this.safeJsonParse(userData, null);
            if (user && user.email === email) {
              return user;
            }
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      return null;
    }
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
    try {
      this.validateId(barbershop.id, 'barbearia');
      localStorage.setItem(`barbershop-${barbershop.id}`, this.safeJsonStringify(barbershop));
    } catch (error) {
      throw new AppError('Erro ao salvar barbearia');
    }
  }

  getBarbershop(id: string): Barbershop | null {
    try {
      this.validateId(id, 'barbearia');
      const data = localStorage.getItem(`barbershop-${id}`);
      return this.safeJsonParse(data, null);
    } catch (error) {
      console.error('Erro ao buscar barbearia:', error);
      return null;
    }
  }

  // Client methods
  saveClient(client: Client): void {
    try {
      this.validateBarbershopId(client.barbershopId);
      this.validateId(client.id, 'cliente');
      
      const clients = this.getClients(client.barbershopId);
      const existingIndex = clients.findIndex(c => c.id === client.id);
      
      if (existingIndex >= 0) {
        clients[existingIndex] = client;
      } else {
        clients.push(client);
      }
      
      localStorage.setItem(`clients-${client.barbershopId}`, this.safeJsonStringify(clients));
    } catch (error) {
      throw new AppError('Erro ao salvar cliente');
    }
  }

  getClients(barbershopId: string): Client[] {
    try {
      this.validateBarbershopId(barbershopId);
      const data = localStorage.getItem(`clients-${barbershopId}`);
      if (data) {
        const clients = this.safeJsonParse(data, []);
        return clients.map((client: any) => ({
          ...client,
          createdAt: new Date(client.createdAt),
          updatedAt: new Date(client.updatedAt),
          birthDate: client.birthDate ? new Date(client.birthDate) : undefined,
          lastVisit: client.lastVisit ? new Date(client.lastVisit) : undefined
        }));
      }
      return mockClients;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return mockClients;
    }
  }

  deleteClient(barbershopId: string, clientId: string): void {
    try {
      this.validateBarbershopId(barbershopId);
      this.validateId(clientId, 'cliente');
      
      const clients = this.getClients(barbershopId);
      const filtered = clients.filter(c => c.id !== clientId);
      localStorage.setItem(`clients-${barbershopId}`, this.safeJsonStringify(filtered));
    } catch (error) {
      throw new AppError('Erro ao deletar cliente');
    }
  }

  // Barber methods
  saveBarber(barber: Barber): void {
    try {
      this.validateBarbershopId(barber.barbershopId);
      this.validateId(barber.id, 'barbeiro');
      
      const barbers = this.getBarbers(barber.barbershopId);
      const existingIndex = barbers.findIndex(b => b.id === barber.id);
      
      if (existingIndex >= 0) {
        barbers[existingIndex] = barber;
      } else {
        barbers.push(barber);
      }
      
      localStorage.setItem(`barbers-${barber.barbershopId}`, this.safeJsonStringify(barbers));
    } catch (error) {
      throw new AppError('Erro ao salvar barbeiro');
    }
  }

  getBarbers(barbershopId: string): Barber[] {
    try {
      this.validateBarbershopId(barbershopId);
      const data = localStorage.getItem(`barbers-${barbershopId}`);
      if (data) {
        const barbers = this.safeJsonParse(data, []);
        return barbers.map((barber: any) => ({
          ...barber,
          createdAt: new Date(barber.createdAt),
          updatedAt: new Date(barber.updatedAt)
        }));
      }
      return mockBarbers;
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error);
      return mockBarbers;
    }
  }

  deleteBarber(barbershopId: string, barberId: string): void {
    try {
      this.validateBarbershopId(barbershopId);
      this.validateId(barberId, 'barbeiro');
      
      const barbers = this.getBarbers(barbershopId);
      const filtered = barbers.filter(b => b.id !== barberId);
      localStorage.setItem(`barbers-${barbershopId}`, this.safeJsonStringify(filtered));
    } catch (error) {
      throw new AppError('Erro ao deletar barbeiro');
    }
  }

  // Service methods
  saveService(service: Service): void {
    try {
      this.validateBarbershopId(service.barbershopId);
      this.validateId(service.id, 'serviço');
      
      const services = this.getServices(service.barbershopId);
      const existingIndex = services.findIndex(s => s.id === service.id);
      
      if (existingIndex >= 0) {
        services[existingIndex] = service;
      } else {
        services.push(service);
      }
      
      localStorage.setItem(`services-${service.barbershopId}`, this.safeJsonStringify(services));
    } catch (error) {
      throw new AppError('Erro ao salvar serviço');
    }
  }

  getServices(barbershopId: string): Service[] {
    try {
      this.validateBarbershopId(barbershopId);
      const data = localStorage.getItem(`services-${barbershopId}`);
      if (data) {
        const services = this.safeJsonParse(data, []);
        return services.map((service: any) => ({
          ...service,
          createdAt: new Date(service.createdAt),
          updatedAt: new Date(service.updatedAt)
        }));
      }
      return mockServices;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return mockServices;
    }
  }

  deleteService(barbershopId: string, serviceId: string): void {
    try {
      this.validateBarbershopId(barbershopId);
      this.validateId(serviceId, 'serviço');
      
      const services = this.getServices(barbershopId);
      const filtered = services.filter(s => s.id !== serviceId);
      localStorage.setItem(`services-${barbershopId}`, this.safeJsonStringify(filtered));
    } catch (error) {
      throw new AppError('Erro ao deletar serviço');
    }
  }

  // Appointment methods
  saveAppointment(appointment: Appointment): void {
    try {
      this.validateBarbershopId(appointment.barbershopId);
      this.validateId(appointment.id, 'agendamento');
      
      const appointments = this.getAppointments(appointment.barbershopId);
      const existingIndex = appointments.findIndex(a => a.id === appointment.id);
      
      if (existingIndex >= 0) {
        appointments[existingIndex] = appointment;
      } else {
        appointments.push(appointment);
      }
      
      localStorage.setItem(`appointments-${appointment.barbershopId}`, this.safeJsonStringify(appointments));
    } catch (error) {
      throw new AppError('Erro ao salvar agendamento');
    }
  }

  getAppointments(barbershopId: string): Appointment[] {
    try {
      this.validateBarbershopId(barbershopId);
      const data = localStorage.getItem(`appointments-${barbershopId}`);
      if (data) {
        const appointments = this.safeJsonParse(data, []);
        return appointments.map((appointment: any) => ({
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
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return mockAppointments.map(apt => ({
        ...apt,
        date: new Date(apt.date),
        createdAt: new Date(apt.createdAt),
        updatedAt: new Date(apt.updatedAt)
      }));
    }
  }

  deleteAppointment(barbershopId: string, appointmentId: string): void {
    try {
      this.validateBarbershopId(barbershopId);
      this.validateId(appointmentId, 'agendamento');
      
      const appointments = this.getAppointments(barbershopId);
      const filtered = appointments.filter(a => a.id !== appointmentId);
      localStorage.setItem(`appointments-${barbershopId}`, this.safeJsonStringify(filtered));
    } catch (error) {
      throw new AppError('Erro ao deletar agendamento');
    }
  }

  // Notification methods
  saveNotification(notification: Notification): void {
    try {
      this.validateBarbershopId(notification.barbershopId);
      this.validateId(notification.id, 'notificação');
      
      const notifications = this.getNotifications(notification.barbershopId);
      notifications.push(notification);
      localStorage.setItem(`notifications-${notification.barbershopId}`, this.safeJsonStringify(notifications));
    } catch (error) {
      throw new AppError('Erro ao salvar notificação');
    }
  }

  getNotifications(barbershopId: string): Notification[] {
    try {
      this.validateBarbershopId(barbershopId);
      const data = localStorage.getItem(`notifications-${barbershopId}`);
      if (data) {
        const notifications = this.safeJsonParse(data, []);
        return notifications.map((notification: any) => ({
          ...notification,
          createdAt: new Date(notification.createdAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return [];
    }
  }

  markNotificationAsRead(barbershopId: string, notificationId: string): void {
    try {
      this.validateBarbershopId(barbershopId);
      this.validateId(notificationId, 'notificação');
      
      const notifications = this.getNotifications(barbershopId);
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
        localStorage.setItem(`notifications-${barbershopId}`, this.safeJsonStringify(notifications));
      }
    } catch (error) {
      throw new AppError('Erro ao marcar notificação como lida');
    }
  }

  // Clear all data
  clearAllData(): void {
    try {
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
    } catch (error) {
      throw new AppError('Erro ao limpar dados');
    }
  }
}

export const storage = new Storage();

// Initialize default data function
export const initializeDefaultData = () => {
  try {
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
  } catch (error) {
    console.error('Erro ao inicializar dados padrão:', error);
  }
};
