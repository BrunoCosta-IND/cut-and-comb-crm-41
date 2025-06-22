import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Search, Filter, User, Scissors, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppointmentDialog } from '@/components/AppointmentDialog';

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Dados mockados
  const appointments = [
    {
      id: 1,
      client: 'João Silva',
      service: 'Corte + Barba',
      barber: 'Carlos',
      time: '09:00',
      price: 45,
      status: 'confirmed',
      phone: '(11) 99999-9999'
    },
    {
      id: 2,
      client: 'Pedro Santos',
      service: 'Corte Tradicional',
      barber: 'Carlos',
      time: '10:30',
      price: 30,
      status: 'scheduled',
      phone: '(11) 88888-8888'
    },
    {
      id: 3,
      client: 'Lucas Oliveira',
      service: 'Barba',
      barber: 'Marco',
      time: '14:00',
      price: 20,
      status: 'completed',
      phone: '(11) 77777-7777'
    },
    {
      id: 4,
      client: 'André Costa',
      service: 'Corte + Barba',
      barber: 'Carlos',
      time: '15:30',
      price: 45,
      status: 'cancelled',
      phone: '(11) 66666-6666'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'scheduled': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'completed': return 'bg-barbershop-gold/10 text-barbershop-gold border-barbershop-gold/30';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'scheduled': return 'Agendado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Agendamentos</h1>
          <p className="text-muted-foreground">Gerencie todos os agendamentos da barbearia</p>
        </div>
        <div className="flex space-x-2">
          <AppointmentDialog />
          <Button asChild className="gradient-gold text-black font-medium hover:opacity-90">
            <Link to="/appointments/new">
              <Plus className="mr-2 h-4 w-4" />
              Página Completa
            </Link>
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-barbershop-gold">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Data</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cliente ou serviço..."
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
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10">
                <Filter className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agendamentos */}
      <div className="grid gap-4">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="glass-card hover:border-barbershop-gold/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-barbershop-gold/10 border border-barbershop-gold/30">
                    <Clock className="h-6 w-6 text-barbershop-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{appointment.client}</h3>
                    <p className="text-muted-foreground">{appointment.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Horário</p>
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Serviço</p>
                    <p className="font-medium">{appointment.service}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Barbeiro</p>
                    <p className="font-medium">{appointment.barber}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium text-barbershop-gold">R$ {appointment.price}</p>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusText(appointment.status)}
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10">
                    Editar
                  </Button>
                  {appointment.status === 'scheduled' && (
                    <Button size="sm" className="gradient-gold text-black font-medium hover:opacity-90">
                      Confirmar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou criar um novo agendamento.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
