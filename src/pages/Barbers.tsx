
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Calendar,
  DollarSign 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { storage } from '@/lib/storage';
import { Barber } from '@/types';
import { BarberDialog } from '@/components/BarberDialog';
import { toast } from '@/hooks/use-toast';

export default function Barbers() {
  const { user } = useAuth();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>();

  useEffect(() => {
    if (user?.barbershopId) {
      const barbersData = storage.getBarbers(user.barbershopId);
      setBarbers(barbersData);
      setFilteredBarbers(barbersData);
    }
  }, [user]);

  useEffect(() => {
    const filtered = barbers.filter(barber =>
      barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barber.phone.includes(searchTerm)
    );
    setFilteredBarbers(filtered);
  }, [searchTerm, barbers]);

  const calculateBarberStats = (barberId: string) => {
    if (!user?.barbershopId) return { totalAppointments: 0, monthlyRevenue: 0 };
    
    const appointments = storage.getAppointments(user.barbershopId);
    const barberAppointments = appointments.filter(apt => apt.barberId === barberId);
    
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthlyAppointments = barberAppointments.filter(apt => apt.date >= monthStart);
    const monthlyRevenue = monthlyAppointments.reduce((sum, apt) => sum + (apt.price || 50), 0);
    
    return {
      totalAppointments: barberAppointments.length,
      monthlyRevenue
    };
  };

  const handleEdit = (barber: Barber) => {
    setSelectedBarber(barber);
    setIsDialogOpen(true);
  };

  const handleDelete = (barberId: string) => {
    if (!user?.barbershopId) return;
    
    if (confirm('Tem certeza que deseja excluir este barbeiro?')) {
      storage.deleteBarber(user.barbershopId, barberId);
      const updatedBarbers = barbers.filter(b => b.id !== barberId);
      setBarbers(updatedBarbers);
      setFilteredBarbers(updatedBarbers);
      
      toast({
        title: "Barbeiro excluído",
        description: "O barbeiro foi excluído com sucesso.",
      });
    }
  };

  const handleNewBarber = () => {
    setSelectedBarber(undefined);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (user?.barbershopId) {
      const updatedBarbers = storage.getBarbers(user.barbershopId);
      setBarbers(updatedBarbers);
      setFilteredBarbers(updatedBarbers);
    }
  };

  const activeBarbers = barbers.filter(b => b.status === 'active');
  const totalAppointments = barbers.reduce((total, barber) => {
    const stats = calculateBarberStats(barber.id);
    return total + stats.totalAppointments;
  }, 0);
  const totalRevenue = barbers.reduce((total, barber) => {
    const stats = calculateBarberStats(barber.id);
    return total + stats.monthlyRevenue;
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Equipe</h1>
          <p className="text-muted-foreground">Gerencie os barbeiros da sua equipe</p>
        </div>
        <Button onClick={handleNewBarber} className="gradient-gold text-black font-medium">
          <Plus className="mr-2 h-4 w-4" />
          Novo Barbeiro
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Barbeiros</CardTitle>
            <Users className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">{barbers.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeBarbers.length} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Total</CardTitle>
            <Calendar className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Todos os barbeiros</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">
              R$ {totalRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">{activeBarbers.length > 0 ? '98%' : '0%'}</div>
            <p className="text-xs text-muted-foreground">Satisfação média</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar barbeiros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de barbeiros */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBarbers.map((barber) => {
          const stats = calculateBarberStats(barber.id);
          return (
            <Card key={barber.id} className="glass-card hover:border-barbershop-gold/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-barbershop-gold/10 border border-barbershop-gold/30 flex items-center justify-center">
                      <Users className="h-6 w-6 text-barbershop-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{barber.name}</CardTitle>
                      <Badge 
                        variant={barber.status === 'active' ? 'default' : 'secondary'}
                        className={barber.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/30' : ''}
                      >
                        {barber.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(barber)}
                      className="text-barbershop-gold hover:bg-barbershop-gold/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(barber.id)}
                      className="text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    📧 {barber.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📱 {barber.phone}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-barbershop-gold">{stats.totalAppointments}</p>
                    <p className="text-xs text-muted-foreground">Atendimentos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-barbershop-gold">
                      R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-muted-foreground">Faturamento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBarbers.length === 0 && (
        <Card className="glass-card">
          <CardContent className="pt-6 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum barbeiro encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Nenhum barbeiro corresponde aos critérios de busca.' 
                : 'Cadastre o primeiro barbeiro da sua equipe.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleNewBarber} className="gradient-gold text-black font-medium">
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Barbeiro
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <BarberDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        barber={selectedBarber}
        onSave={handleSave}
      />
    </div>
  );
}
