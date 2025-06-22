
import { Client, Barber, Service, Appointment } from '@/types';

export const mockClients: Client[] = [
  {
    id: 'client-1',
    barbershopId: 'barbershop-1',
    name: 'João Silva',
    phone: '(11) 99999-9999',
    email: 'joao@email.com',
    frequency: 'monthly',
    totalVisits: 15,
    totalSpent: 675,
    lastVisit: new Date('2024-06-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-15')
  },
  {
    id: 'client-2',
    barbershopId: 'barbershop-1',
    name: 'Pedro Santos',
    phone: '(11) 88888-8888',
    email: 'pedro@email.com',
    frequency: 'biweekly',
    totalVisits: 8,
    totalSpent: 320,
    lastVisit: new Date('2024-06-10'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-06-10')
  }
];

export const mockBarbers: Barber[] = [
  {
    id: 'barber-1',
    barbershopId: 'barbershop-1',
    name: 'Carlos Barbeiro',
    phone: '(11) 77777-7777',
    email: 'carlos@barbearia.com',
    status: 'active',
    availability: {
      monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
      sunday: { isOpen: false, openTime: '00:00', closeTime: '00:00' }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'barber-2',
    barbershopId: 'barbershop-1',
    name: 'Marco Silva',
    phone: '(11) 66666-6666',
    email: 'marco@barbearia.com',
    status: 'active',
    availability: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '15:00' },
      sunday: { isOpen: false, openTime: '00:00', closeTime: '00:00' }
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];

export const mockServices: Service[] = [
  {
    id: 'service-1',
    barbershopId: 'barbershop-1',
    name: 'Corte Tradicional',
    description: 'Corte de cabelo tradicional',
    price: 30,
    duration: 30,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'service-2',
    barbershopId: 'barbershop-1',
    name: 'Corte + Barba',
    description: 'Corte de cabelo com barba',
    price: 45,
    duration: 45,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'service-3',
    barbershopId: 'barbershop-1',
    name: 'Barba',
    description: 'Apenas barba',
    price: 20,
    duration: 20,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'appointment-1',
    barbershopId: 'barbershop-1',
    clientId: 'client-1',
    barberId: 'barber-1',
    serviceId: 'service-2',
    date: new Date('2024-06-22'),
    time: '09:00',
    status: 'confirmed',
    price: 45,
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-21')
  },
  {
    id: 'appointment-2',
    barbershopId: 'barbershop-1',
    clientId: 'client-2',
    barberId: 'barber-1',
    serviceId: 'service-1',
    date: new Date('2024-06-22'),
    time: '10:30',
    status: 'scheduled',
    price: 30,
    createdAt: new Date('2024-06-21'),
    updatedAt: new Date('2024-06-21')
  }
];
