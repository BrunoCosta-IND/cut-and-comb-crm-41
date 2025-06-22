
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Calendar, Clock, User, Scissors, DollarSign } from 'lucide-react';
import { Appointment, Client, Barber, Service } from '@/types';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const appointmentSchema = z.object({
  clientId: z.string().min(1, 'Selecione um cliente'),
  barberId: z.string().min(1, 'Selecione um barbeiro'),
  serviceId: z.string().min(1, 'Selecione um serviço'),
  date: z.string().min(1, 'Selecione uma data'),
  time: z.string().min(1, 'Selecione um horário'),
  notes: z.string().optional()
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentDialogProps {
  onAppointmentCreated?: (appointment: Appointment) => void;
  trigger?: React.ReactNode;
}

export function AppointmentDialog({ onAppointmentCreated, trigger }: AppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientId: '',
      barberId: '',
      serviceId: '',
      date: '',
      time: '',
      notes: ''
    }
  });

  const clients = storage.getClients('barbershop-1');
  const barbers = storage.getBarbers('barbershop-1');
  const services = storage.getServices('barbershop-1');

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const selectedService = services.find(s => s.id === data.serviceId);
      if (!selectedService) {
        toast({
          title: "Erro",
          description: "Serviço não encontrado.",
          variant: "destructive"
        });
        return;
      }

      const appointmentDateTime = new Date(`${data.date}T${data.time}`);
      
      // Verificar conflitos de horário
      const existingAppointments = storage.getAppointments('barbershop-1');
      const hasConflict = existingAppointments.some(apt => 
        apt.barberId === data.barberId &&
        new Date(apt.date).toDateString() === appointmentDateTime.toDateString() &&
        apt.time === data.time &&
        apt.status !== 'cancelled'
      );

      if (hasConflict) {
        toast({
          title: "Conflito de horário",
          description: "Este barbeiro já tem um agendamento neste horário.",
          variant: "destructive"
        });
        return;
      }

      const newAppointment: Appointment = {
        id: `appointment-${Date.now()}`,
        barbershopId: 'barbershop-1',
        clientId: data.clientId,
        barberId: data.barberId,
        serviceId: data.serviceId,
        date: appointmentDateTime,
        time: data.time,
        status: 'scheduled',
        price: selectedService.price,
        notes: data.notes || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      storage.saveAppointment(newAppointment);
      
      toast({
        title: "Agendamento criado",
        description: "Agendamento criado com sucesso!",
      });

      form.reset();
      setOpen(false);
      onAppointmentCreated?.(newAppointment);
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gradient-gold text-black font-medium hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-card">
        <DialogHeader>
          <DialogTitle className="text-barbershop-gold">Novo Agendamento</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo agendamento.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="barberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barbeiro *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecione um barbeiro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {barbers.filter(b => b.status === 'active').map((barber) => (
                        <SelectItem key={barber.id} value={barber.id}>
                          {barber.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.filter(s => s.isActive).map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - R$ {service.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="date"
                          className="pl-10 bg-background/50"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {generateTimeSlots().map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-background/50"
                      placeholder="Observações sobre o agendamento..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="gradient-gold text-black font-medium hover:opacity-90"
              >
                {form.formState.isSubmitting ? 'Criando...' : 'Criar Agendamento'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
