
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Scissors, Plus, Search, Phone, Mail, Clock, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarberDialog } from '@/components/BarberDialog';
import { storage } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Barber } from '@/types';

export default function Barbers() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>();

  useEffect(() => {
    if (user?.barbershopId) {
      loadBarbers();
    }
  }, [user]);

  const loadBarbers = () => {
    if (user?.barbershopId) {
      const loadedBarbers = storage.getBarbers(user.barbershopId);
      setBarbers(loadedBarbers);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'inactive': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      default: return status;
    }
  };

  const getWorkingDays = (availability: any) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    
    return days
      .filter(day => availability[day]?.isOpen)
      .map(day => dayNames[days.indexOf(day)])
      .join(', ');
  };

  const handleEditBarber = (barber: Barber) => {
    setSelectedBarber(barber);
    setDialogOpen(true);
  };

  const handleNewBarber = () => {
    setSelectedBarber(undefined);
    setDialogOpen(true);
  };

  const handleDeleteBarber = (barberId: string) => {
    if (user?.barbershopId && confirm('Tem certeza que deseja excluir este barbeiro?')) {
      storage.deleteBarber(user.barbershopId, barberId);
      loadBarbers();
      toast({
        title: "Barbeiro excluído",
        description: "O barbeiro foi removido com sucesso.",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  const filteredBarbers = barbers.filter(barber => {
    const matchesSearch = barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         barber.phone.includes(searchTerm) ||
                         barber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || barber.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeBarbers = barbers.filter(b => b.status === 'active').length;
  const totalAppointments = barbers.reduce((sum, barber) => sum + (barber.totalAppointments || 0), 0);
  const totalRevenue = barbers.reduce((sum, barber) => sum + (barber.monthlyRevenue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Barbeiros</h1>
          <p className="text-muted-foreground">Gerencie a equipe de barbeiros</p>
        </div>
        <Button 
          onClick={handleNewBarber}
          className="gradient-gold text-black font-medium hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Cadastrar Barbeiro
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Barbeiros</CardTitle>
            <Scissors className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">{barbers.length}</div>
            <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barbeiros Ativos</CardTitle>
            <User className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">{activeBarbers}</div>
            <p className="text-xs text-muted-foreground">Disponíveis para atendimento</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos no Mês</CardTitle>
            <Clock className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Total de atendimentos</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita da Equipe</CardTitle>
            <Scissors className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">
              R$ {totalRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-barbershop-gold">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome, telefone ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Barbeiros */}
      <div className="grid gap-4">
        {filteredBarbers.map((barber) => (
          <Card key={barber.id} className="glass-card hover:border-barbershop-gold/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-barbershop-gold/10 border border-barbershop-gold/30">
                    <Scissors className="h-6 w-6 text-barbershop-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{barber.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{barber.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{barber.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Dias de Trabalho</p>
                    <p className="font-medium">{getWorkingDays(barber.availability)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Atendimentos</p>
                    <p className="font-medium">{barber.totalAppointments || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Receita Mensal</p>
                    <p className="font-medium text-barbershop-gold">R$ {(barber.monthlyRevenue || 0).toLocaleString('pt-BR')}</p>
                  </div>
                  <Badge className={getStatusColor(barber.status)}>
                    {getStatusText(barber.status)}
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEditBarber(barber)}
                    className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
                  >
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteBarber(barber.id)}
                    className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBarbers.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Scissors className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum barbeiro encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou cadastrar um novo barbeiro.</p>
          </CardContent>
        </Card>
      )}

      <BarberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        barber={selectedBarber}
        onSave={loadBarbers}
      />
    </div>
  );
}
