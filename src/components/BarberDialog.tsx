
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Barber } from '@/types';
import { storage } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface BarberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber?: Barber;
  onSave: () => void;
}

export function BarberDialog({ open, onOpenChange, barber, onSave }: BarberDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: barber?.name || '',
    phone: barber?.phone || '',
    email: barber?.email || '',
    status: barber?.status || 'active',
    availability: barber?.availability || {
      monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
      sunday: { isOpen: false, openTime: '', closeTime: '' }
    }
  });

  const handleSave = () => {
    if (!user?.barbershopId) return;

    const barberData: Barber = {
      id: barber?.id || `barber-${Date.now()}`,
      barbershopId: user.barbershopId,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      status: formData.status as 'active' | 'inactive',
      availability: formData.availability,
      createdAt: barber?.createdAt || new Date(),
      updatedAt: new Date()
    };

    storage.saveBarber(barberData);
    
    toast({
      title: barber ? "Barbeiro atualizado" : "Barbeiro cadastrado",
      description: `${formData.name} foi ${barber ? 'atualizado' : 'cadastrado'} com sucesso.`,
    });

    onSave();
    onOpenChange(false);
  };

  const days = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{barber ? 'Editar Barbeiro' : 'Cadastrar Barbeiro'}</DialogTitle>
          <DialogDescription>
            {barber ? 'Atualize as informações do barbeiro.' : 'Cadastre um novo barbeiro na equipe.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="col-span-3"
            />
          </div>

          <div className="space-y-4">
            <Label>Horários de Trabalho</Label>
            {days.map((day) => (
              <div key={day.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.availability[day.key as keyof typeof formData.availability].isOpen}
                    onCheckedChange={(checked) => 
                      setFormData({
                        ...formData,
                        availability: {
                          ...formData.availability,
                          [day.key]: {
                            ...formData.availability[day.key as keyof typeof formData.availability],
                            isOpen: checked
                          }
                        }
                      })
                    }
                  />
                  <Label className="w-24">{day.label}</Label>
                </div>
                
                {formData.availability[day.key as keyof typeof formData.availability].isOpen && (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={formData.availability[day.key as keyof typeof formData.availability].openTime}
                      onChange={(e) => 
                        setFormData({
                          ...formData,
                          availability: {
                            ...formData.availability,
                            [day.key]: {
                              ...formData.availability[day.key as keyof typeof formData.availability],
                              openTime: e.target.value
                            }
                          }
                        })
                      }
                      className="w-24"
                    />
                    <span>às</span>
                    <Input
                      type="time"
                      value={formData.availability[day.key as keyof typeof formData.availability].closeTime}
                      onChange={(e) => 
                        setFormData({
                          ...formData,
                          availability: {
                            ...formData.availability,
                            [day.key]: {
                              ...formData.availability[day.key as keyof typeof formData.availability],
                              closeTime: e.target.value
                            }
                          }
                        })
                      }
                      className="w-24"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="gradient-gold text-black">
            {barber ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
