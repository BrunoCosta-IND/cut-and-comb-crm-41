import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Plus,
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    newClientsThisMonth: 0
  });

  useEffect(() => {
    if (user?.barbershopId) {
      const appointments = storage.getAppointments(user.barbershopId);
      const clients = storage.getClients(user.barbershopId);
      
      // Calcular estatísticas reais
      const today = new Date();
      const todayAppointments = appointments.filter(apt => 
        apt.date.toDateString() === today.toDateString()
      ).length;
      
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthlyAppointments = appointments.filter(apt => apt.date >= monthStart);
      const monthlyRevenue = monthlyAppointments.reduce((sum, apt) => sum + (apt.price || 50), 0);
      
      const newClients = clients.filter(client => 
        client.createdAt >= monthStart
      ).length;
      
      setStats({
        todayAppointments,
        todayRevenue: todayAppointments * 45, // Estimativa
        monthlyRevenue,
        newClientsThisMonth: newClients
      });
    }
  }, [user]);

  // Dados mockados para demonstração
  const stats = {
    todayAppointments: 8,
    todayRevenue: 320,
    monthlyRevenue: 12500,
    newClientsThisMonth: 15
  };

  const nextAppointments = [
    { id: 1, client: 'João Silva', service: 'Corte + Barba', time: '14:00', barber: 'Carlos' },
    { id: 2, client: 'Pedro Santos', service: 'Corte Tradicional', time: '14:30', barber: 'Carlos' },
    { id: 3, client: 'Lucas Oliveira', service: 'Barba', time: '15:00', barber: 'Carlos' },
    { id: 4, client: 'André Costa', service: 'Corte + Barba', time: '15:30', barber: 'Carlos' },
    { id: 5, client: 'Rafael Lima', service: 'Corte Tradicional', time: '16:00', barber: 'Carlos' },
  ];

  const topServices = [
    { service: 'Corte + Barba', count: 45, revenue: 2025 },
    { service: 'Corte Tradicional', count: 38, revenue: 1140 },
    { service: 'Barba', count: 22, revenue: 440 },
  ];

  const inactiveClients = [
    { name: 'José Martins', lastVisit: '25 dias atrás' },
    { name: 'Roberto Silva', lastVisit: '30 dias atrás' },
  ];

  if (user?.role === 'creator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Painel do Criador</h1>
            <p className="text-muted-foreground">Gerencie todas as barbearias do sistema</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Barbearias Ativas</CardTitle>
              <Users className="h-4 w-4 text-barbershop-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barbershop-gold">1</div>
              <p className="text-xs text-muted-foreground">Sistema funcionando</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Webhooks Configurados</CardTitle>
              <TrendingUp className="h-4 w-4 text-barbershop-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barbershop-gold">0</div>
              <p className="text-xs text-muted-foreground">Pronto para configurar</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-barbershop-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barbershop-gold">2</div>
              <p className="text-xs text-muted-foreground">Admin + Criador</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sistema</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Online</div>
              <p className="text-xs text-muted-foreground">Funcionando perfeitamente</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-barbershop-gold">Ações Rápidas</CardTitle>
            <CardDescription>Configure e gerencie o sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Button 
                onClick={() => navigate('/settings')}
                className="gradient-gold text-black font-medium hover:opacity-90"
              >
                Configurar Webhooks
              </Button>
              <Button 
                variant="outline"
                className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
              >
                Gerenciar Temas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua barbearia</p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card hover:border-barbershop-gold/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">+2 que ontem</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:border-barbershop-gold/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">
              R$ {stats.todayRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">+12% que ontem</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:border-barbershop-gold/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">
              R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">+8% que mês passado</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:border-barbershop-gold/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">{stats.newClientsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Neste mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Próximos agendamentos */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-barbershop-gold">Próximos Agendamentos</CardTitle>
              <CardDescription>Agendamentos para hoje</CardDescription>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate('/appointments')}
              className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
            >
              Ver Todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-barbershop-gold/10 border border-barbershop-gold/30">
                    <Clock className="h-4 w-4 text-barbershop-gold" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.client}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-barbershop-gold">{appointment.time}</p>
                  <p className="text-sm text-muted-foreground">{appointment.barber}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ações rápidas e alertas */}
        <div className="space-y-6">
          {/* Ações rápidas */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-barbershop-gold">Ações Rápidas</CardTitle>
              <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/appointments')}
                className="w-full gradient-gold text-black font-medium hover:opacity-90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Agendamento
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/clients')}
                  className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Ver Clientes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/reports')}
                  className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Ver Relatórios
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card className="glass-card border-yellow-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-500">
                <AlertTriangle className="h-5 w-5" />
                <span>Alertas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inactiveClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">Último atendimento: {client.lastVisit}</p>
                  </div>
                  <Badge variant="outline" className="border-yellow-500/30 text-yellow-500">
                    Inativo
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Serviços mais vendidos */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-barbershop-gold">Serviços Mais Vendidos</CardTitle>
          <CardDescription>Desempenho dos serviços neste mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-barbershop-gold text-black font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{service.service}</p>
                    <p className="text-sm text-muted-foreground">{service.count} vendas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-barbershop-gold">
                    R$ {service.revenue.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground">Total faturado</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
