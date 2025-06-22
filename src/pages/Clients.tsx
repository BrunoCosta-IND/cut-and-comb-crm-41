
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Phone, Mail, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientDialog } from '@/components/ClientDialog';
import { storage } from '@/lib/storage';
import { Client } from '@/types';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const loadedClients = storage.getClients('barbershop-1');
    setClients(loadedClients);
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'biweekly': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'monthly': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'rarely': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Semanal';
      case 'biweekly': return 'Quinzenal';
      case 'monthly': return 'Mensal';
      case 'rarely': return 'Raramente';
      default: return frequency;
    }
  };

  const getDaysSinceLastVisit = (lastVisit?: Date) => {
    if (!lastVisit) return 0;
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastVisit.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm) ||
                         (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFrequency = filterFrequency === 'all' || client.frequency === filterFrequency;
    return matchesSearch && matchesFrequency;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua base de clientes</p>
        </div>
        <ClientDialog onClientCreated={loadClients} />
      </div>

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">+{clients.filter(c => {
              const createdThisMonth = new Date(c.createdAt).getMonth() === new Date().getMonth();
              return createdThisMonth;
            }).length} novos este mês</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">
              {clients.filter(c => c.lastVisit && getDaysSinceLastVisit(c.lastVisit) <= 30).length}
            </div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">
              R$ {clients.reduce((sum, client) => sum + client.totalSpent, 0).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Receita acumulada</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Cliente</CardTitle>
            <TrendingUp className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">
              R$ {clients.length > 0 ? Math.round(clients.reduce((sum, client) => sum + client.totalSpent, 0) / clients.length).toLocaleString('pt-BR') : '0'}
            </div>
            <p className="text-xs text-muted-foreground">Valor médio gasto</p>
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
              <label className="text-sm font-medium">Frequência</label>
              <Select value={filterFrequency} onValueChange={setFilterFrequency}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="biweekly">Quinzenal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="rarely">Raramente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
                onClick={() => {
                  setSearchTerm('');
                  setFilterFrequency('all');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="glass-card hover:border-barbershop-gold/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-barbershop-gold/10 border border-barbershop-gold/30">
                    <Users className="h-6 w-6 text-barbershop-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{client.phone}</span>
                      </div>
                      {client.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{client.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Última Visita</p>
                    <p className="font-medium">
                      {client.lastVisit ? `${getDaysSinceLastVisit(client.lastVisit)} dias atrás` : 'Nunca'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total de Visitas</p>
                    <p className="font-medium">{client.totalVisits}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Gasto</p>
                    <p className="font-medium text-barbershop-gold">R$ {client.totalSpent.toLocaleString('pt-BR')}</p>
                  </div>
                  <Badge className={getFrequencyColor(client.frequency)}>
                    {getFrequencyText(client.frequency)}
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10">
                    Editar
                  </Button>
                  <Button size="sm" className="gradient-gold text-black font-medium hover:opacity-90">
                    Novo Agendamento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground">
              {clients.length === 0 
                ? 'Comece cadastrando seu primeiro cliente.' 
                : 'Tente ajustar os filtros ou cadastrar um novo cliente.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
