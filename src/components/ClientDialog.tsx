
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Phone, Mail, Calendar, User } from 'lucide-react';
import { Client } from '@/types';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface ClientDialogProps {
  onClientCreated?: (client: Client) => void;
}

export function ClientDialog({ onClientCreated }: ClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    notes: '',
    frequency: 'monthly' as 'weekly' | 'biweekly' | 'monthly' | 'rarely'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar telefone único
      const existingClients = storage.getClients('barbershop-1');
      const phoneExists = existingClients.some(client => client.phone === formData.phone);
      
      if (phoneExists) {
        toast({
          title: "Cliente já existe",
          description: "Já existe um cliente cadastrado com este telefone.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const newClient: Client = {
        id: `client-${Date.now()}`,
        barbershopId: 'barbershop-1',
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
        notes: formData.notes || undefined,
        frequency: formData.frequency,
        totalVisits: 0,
        totalSpent: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      storage.saveClient(newClient);
      
      toast({
        title: "Cliente cadastrado",
        description: "Cliente cadastrado com sucesso!",
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        birthDate: '',
        notes: '',
        frequency: 'monthly'
      });

      setOpen(false);
      onClientCreated?.(newClient);
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar cliente. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-gold text-black font-medium hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Cadastrar Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-card">
        <DialogHeader>
          <DialogTitle className="text-barbershop-gold">Cadastrar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente. Campos obrigatórios estão marcados com *.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="pl-10 bg-background/50"
                placeholder="João Silva"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Telefone/WhatsApp *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="pl-10 bg-background/50"
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10 bg-background/50"
                placeholder="joao@email.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                className="pl-10 bg-background/50"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="frequency">Frequência de Visitas</Label>
            <Select value={formData.frequency} onValueChange={(value: any) => setFormData(prev => ({ ...prev, frequency: value }))}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="biweekly">Quinzenal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="rarely">Raramente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-background/50"
              placeholder="Informações adicionais sobre o cliente..."
              rows={3}
            />
          </div>

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
              disabled={isLoading}
              className="gradient-gold text-black font-medium hover:opacity-90"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
