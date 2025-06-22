
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, Scissors } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedBarber, setSelectedBarber] = useState('all');

  // Dados mockados para gráficos
  const revenueData = [
    { date: '01/06', revenue: 450, appointments: 12 },
    { date: '02/06', revenue: 380, appointments: 10 },
    { date: '03/06', revenue: 520, appointments: 14 },
    { date: '04/06', revenue: 600, appointments: 16 },
    { date: '05/06', revenue: 480, appointments: 13 },
    { date: '06/06', revenue: 720, appointments: 18 },
    { date: '07/06', revenue: 650, appointments: 17 }
  ];

  const servicesData = [
    { name: 'Corte + Barba', value: 45, color: '#D4AF37' },
    { name: 'Corte Tradicional', value: 30, color: '#F4E4BC' },
    { name: 'Barba', value: 15, color: '#B8860B' },
    { name: 'Outros', value: 10, color: '#DAA520' }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Fev', revenue: 11800 },
    { month: 'Mar', revenue: 13200 },
    { month: 'Abr', revenue: 14500 },
    { month: 'Mai', revenue: 13800 },
    { month: 'Jun', revenue: 15200 }
  ];

  const barberPerformance = [
    { name: 'Carlos', appointments: 156, revenue: 4680 },
    { name: 'Marco', appointments: 89, revenue: 2670 },
    { name: 'João', appointments: 67, revenue: 2010 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Relatórios</h1>
          <p className="text-muted-foreground">Análise completa do desempenho da barbearia</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10">
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline" className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-barbershop-gold">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                  <SelectItem value="quarter">Último Trimestre</SelectItem>
                  <SelectItem value="year">Último Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Barbeiro</label>
              <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="carlos">Carlos</SelectItem>
                  <SelectItem value="marco">Marco</SelectItem>
                  <SelectItem value="joao">João</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10">
                Atualizar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">R$ 15.200</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atendimentos</CardTitle>
            <Scissors className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">312</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">R$ 48,72</div>
            <p className="text-xs text-muted-foreground">+3% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-barbershop-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-barbershop-gold">24</div>
            <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Evolução da Receita */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-barbershop-gold">Evolução da Receita Diária</CardTitle>
            <CardDescription>Receita e número de atendimentos por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid #D4AF37',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Serviços */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-barbershop-gold">Distribuição de Serviços</CardTitle>
            <CardDescription>Porcentagem de cada tipo de serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={servicesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}%`}
                >
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid #D4AF37',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Receita Mensal */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-barbershop-gold">Receita Mensal</CardTitle>
            <CardDescription>Comparativo dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid #D4AF37',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance dos Barbeiros */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-barbershop-gold">Performance dos Barbeiros</CardTitle>
            <CardDescription>Atendimentos e receita por barbeiro</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barberPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid #D4AF37',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="appointments" fill="#D4AF37" />
                <Bar dataKey="revenue" fill="#F4E4BC" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Detalhes */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-barbershop-gold">Detalhamento por Barbeiro</CardTitle>
          <CardDescription>Performance detalhada de cada profissional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4">Barbeiro</th>
                  <th className="text-left p-4">Atendimentos</th>
                  <th className="text-left p-4">Receita</th>
                  <th className="text-left p-4">Ticket Médio</th>
                  <th className="text-left p-4">Crescimento</th>
                </tr>
              </thead>
              <tbody>
                {barberPerformance.map((barber, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-background/50">
                    <td className="p-4 font-medium">{barber.name}</td>
                    <td className="p-4">{barber.appointments}</td>
                    <td className="p-4 text-barbershop-gold">R$ {barber.revenue.toLocaleString('pt-BR')}</td>
                    <td className="p-4">R$ {Math.round(barber.revenue / barber.appointments)}</td>
                    <td className="p-4 text-green-500">+{Math.floor(Math.random() * 20)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
