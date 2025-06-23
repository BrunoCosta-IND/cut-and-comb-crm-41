
import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  notes: z.string().max(500, 'Observações muito longas').optional(),
});

export const barberSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  specialties: z.array(z.string()).min(1, 'Selecione pelo menos uma especialidade'),
  workingHours: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'),
  }),
});

export const appointmentSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  barberId: z.string().min(1, 'Barbeiro é obrigatório'),
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  date: z.date({ required_error: 'Data é obrigatória' }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'),
  notes: z.string().max(500, 'Observações muito longas').optional(),
});

export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new Error(firstError.message);
    }
    throw new Error('Dados inválidos');
  }
};
