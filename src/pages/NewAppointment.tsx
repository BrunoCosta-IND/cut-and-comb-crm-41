
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Users, Scissors } from 'lucide-react';
import { AppointmentDialog } from '@/components/AppointmentDialog';

export default function NewAppointment() {
  const navigate = useNavigate();

  const handleAppointmentCreated = () => {
    navigate('/appointments');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/appointments')}
          className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Novo Agendamento</h1>
          <p className="text-muted-foreground">Crie um novo agendamento para seu cliente</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">12</div>
            <p className="text-xs text-muted-foreground">+2 desde ontem</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Horário</CardTitle>
            <Clock className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">14:30</div>
            <p className="text-xs text-muted-foreground">João Silva</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">156</div>
            <p className="text-xs text-muted-foreground">Base de clientes</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
            <Scissors className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">8</div>
            <p className="text-xs text-muted-foreground">Disponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-barbershop-gold">Criar Agendamento</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar um novo agendamento. Certifique-se de que todos os campos obrigatórios estão preenchidos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-12">
          <AppointmentDialog onAppointmentCreated={handleAppointmentCreated} />
        </CardContent>
      </Card>
    </div>
  );
}
