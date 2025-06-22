
// Sistema de armazenamento local simulando um banco de dados
import { User, Barbershop, Client, Barber, Service, Appointment, Notification } from '@/types';

class LocalStorage {
  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Users
  getUsers(): User[] {
    return this.getItem<User>('users');
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    this.setItem('users', users);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(user => user.email === email);
  }

  // Barbershops
  getBarbershops(): Barbershop[] {
    return this.getItem<Barbershop>('barbershops');
  }

  saveBarbershop(barbershop: Barbershop): void {
    const barbershops = this.getBarbershops();
    const existingIndex = barbershops.findIndex(b => b.id === barbershop.id);
    if (existingIndex >= 0) {
      barbershops[existingIndex] = barbershop;
    } else {
      barbershops.push(barbershop);
    }
    this.setItem('barbershops', barbershops);
  }

  getBarbershopById(id: string): Barbershop | undefined {
    return this.getBarbershops().find(b => b.id === id);
  }

  // Clients
  getClients(barbershopId: string): Client[] {
    return this.getItem<Client>('clients').filter(c => c.barbershopId === barbershopId);
  }

  saveClient(client: Client): void {
    const clients = this.getItem<Client>('clients');
    const existingIndex = clients.findIndex(c => c.id === client.id);
    if (existingIndex >= 0) {
      clients[existingIndex] = client;
    } else {
      clients.push(client);
    }
    this.setItem('clients', clients);
  }

  // Barbers
  getBarbers(barbershopId: string): Barber[] {
    return this.getItem<Barber>('barbers').filter(b => b.barbershopId === barbershopId);
  }

  saveBarber(barber: Barber): void {
    const barbers = this.getItem<Barber>('barbers');
    const existingIndex = barbers.findIndex(b => b.id === barber.id);
    if (existingIndex >= 0) {
      barbers[existingIndex] = barber;
    } else {
      barbers.push(barber);
    }
    this.setItem('barbers', barbers);
  }

  // Services
  getServices(barbershopId: string): Service[] {
    return this.getItem<Service>('services').filter(s => s.barbershopId === barbershopId);
  }

  saveService(service: Service): void {
    const services = this.getItem<Service>('services');
    const existingIndex = services.findIndex(s => s.id === service.id);
    if (existingIndex >= 0) {
      services[existingIndex] = service;
    } else {
      services.push(service);
    }
    this.setItem('services', services);
  }

  // Appointments
  getAppointments(barbershopId: string): Appointment[] {
    return this.getItem<Appointment>('appointments').filter(a => a.barbershopId === barbershopId);
  }

  saveAppointment(appointment: Appointment): void {
    const appointments = this.getItem<Appointment>('appointments');
    const existingIndex = appointments.findIndex(a => a.id === appointment.id);
    if (existingIndex >= 0) {
      appointments[existingIndex] = appointment;
    } else {
      appointments.push(appointment);
    }
    this.setItem('appointments', appointments);
  }

  // Notifications
  getNotifications(barbershopId: string): Notification[] {
    return this.getItem<Notification>('notifications').filter(n => n.barbershopId === barbershopId);
  }

  saveNotification(notification: Notification): void {
    const notifications = this.getItem<Notification>('notifications');
    notifications.push(notification);
    this.setItem('notifications', notifications);
  }

  markNotificationAsRead(id: string): void {
    const notifications = this.getItem<Notification>('notifications');
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.setItem('notifications', notifications);
    }
  }

  // Session
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  clearCurrentUser(): void {
    localStorage.removeItem('currentUser');
  }
}

export const storage = new LocalStorage();

// Inicializar dados de exemplo se não existirem
export const initializeDefaultData = () => {
  // Criar usuário criador padrão
  const creator: User = {
    id: 'creator-1',
    name: 'Sistema',
    email: 'creator@barbershop.com',
    role: 'creator',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Criar barbearia exemplo
  const barbershop: Barbershop = {
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
      sunday: { isOpen: false, openTime: '08:00', closeTime: '16:00' }
    },
    webhooks: {
      appointmentConfirmed: { url: '', enabled: false },
      appointmentReminder: { url: '', enabled: false },
      inactiveClient: { url: '', enabled: false }
    },
    theme: {
      primaryColor: '#D4AF37',
      secondaryColor: '#F4E4BC'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Criar usuário administrador
  const admin: User = {
    id: 'admin-1',
    name: 'João Silva',
    email: 'admin@barbeariaelegante.com',
    phone: '(11) 98888-8888',
    role: 'admin',
    barbershopId: 'barbershop-1',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Verificar se já existem dados
  const existingUsers = storage.getUsers();
  if (existingUsers.length === 0) {
    storage.saveUser(creator);
    storage.saveUser(admin);
    storage.saveBarbershop(barbershop);
    
    // Criar alguns serviços exemplo
    const services: Service[] = [
      {
        id: 'service-1',
        barbershopId: 'barbershop-1',
        name: 'Corte Tradicional',
        description: 'Corte clássico masculino',
        price: 30,
        duration: 30,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'service-2',
        barbershopId: 'barbershop-1',
        name: 'Barba',
        description: 'Aparar e finalizar barba',
        price: 20,
        duration: 20,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'service-3',
        barbershopId: 'barbershop-1',
        name: 'Corte + Barba',
        description: 'Pacote completo',
        price: 45,
        duration: 45,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    services.forEach(service => storage.saveService(service));

    // Criar barbeiro exemplo
    const barber: Barber = {
      id: 'barber-1',
      barbershopId: 'barbershop-1',
      name: 'Carlos Barbeiro',
      phone: '(11) 97777-7777',
      email: 'carlos@barbeariaelegante.com',
      status: 'active',
      availability: {
        monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        saturday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
        sunday: { isOpen: false, openTime: '08:00', closeTime: '16:00' }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    storage.saveBarber(barber);
  }
};
