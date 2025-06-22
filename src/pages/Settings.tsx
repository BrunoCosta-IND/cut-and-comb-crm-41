
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Clock, Phone, Mail, Webhook, Bell } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Settings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Estados para configurações da barbearia
  const [barbershopSettings, setBarbershopSettings] = useState({
    name: 'Barbearia Elegante',
    phone: '(11) 99999-9999',
    email: 'contato@barbeariaelegante.com',
    workingHours: {
      monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
      sunday: { isOpen: false, openTime: '', closeTime: '' }
    }
  });

  // Estados para webhooks
  const [webhooks, setWebhooks] = useState({
    appointmentConfirmed: {
      url: 'https://n8n.exemplo.com/webhook/confirmacao',
      enabled: true
    },
    appointmentReminder: {
      url: 'https://n8n.exemplo.com/webhook/lembrete',
      enabled: true
    },
    inactiveClient: {
      url: 'https://n8n.exemplo.com/webhook/cliente-inativo',
      enabled: false
    }
  });

  const dayNames = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log('Configurações salvas:', { barbershopSettings, webhooks });
  };

  const updateWorkingHours = (day: string, field: string, value: string | boolean) => {
    setBarbershopSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value
        }
      }
    }));
  };

  const updateWebhook = (webhook: string, field: string, value: string | boolean) => {
    setWebhooks(prev => ({
      ...prev,
      [webhook]: {
        ...prev[webhook as keyof typeof prev],
        [field]: value
      }
    }));
  };

  if (user?.role === 'creator') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Configurações do Criador</h1>
          <p className="text-muted-foreground">Gerencie configurações globais do sistema</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-barbershop-gold">Webhooks Globais</CardTitle>
            <CardDescription>Configure os webhooks que serão usados por todas as barbearias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Webhook de Confirmação */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Agendamento Confirmado</h4>
                  <p className="text-sm text-muted-foreground">Disparado quando um agendamento é confirmado</p>
                </div>
                <Switch
                  checked={webhooks.appointmentConfirmed.enabled}
                  onCheckedChange={(checked) => updateWebhook('appointmentConfirmed', 'enabled', checked)}
                />
              </div>
              <div>
                <Label htmlFor="webhook-confirmed">URL do Webhook</Label>
                <Input
                  id="webhook-confirmed"
                  value={webhooks.appointmentConfirmed.url}
                  onChange={(e) => updateWebhook('appointmentConfirmed', 'url', e.target.value)}
                  placeholder="https://n8n.exemplo.com/webhook/confirmacao"
                  className="bg-background/50"
                />
              </div>
            </div>

            <Separator />

            {/* Webhook de Lembrete */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Lembrete de Agendamento</h4>
                  <p className="text-sm text-muted-foreground">Disparado antes do horário do agendamento</p>
                </div>
                <Switch
                  checked={webhooks.appointmentReminder.enabled}
                  onCheckedChange={(checked) => updateWebhook('appointmentReminder', 'enabled', checked)}
                />
              </div>
              <div>
                <Label htmlFor="webhook-reminder">URL do Webhook</Label>
                <Input
                  id="webhook-reminder"
                  value={webhooks.appointmentReminder.url}
                  onChange={(e) => updateWebhook('appointmentReminder', 'url', e.target.value)}
                  placeholder="https://n8n.exemplo.com/webhook/lembrete"
                  className="bg-background/50"
                />
              </div>
            </div>

            <Separator />

            {/* Webhook de Cliente Inativo */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Cliente Inativo</h4>
                  <p className="text-sm text-muted-foreground">Disparado quando cliente fica inativo por 15 dias</p>
                </div>
                <Switch
                  checked={webhooks.inactiveClient.enabled}
                  onCheckedChange={(checked) => updateWebhook('inactiveClient', 'enabled', checked)}
                />
              </div>
              <div>
                <Label htmlFor="webhook-inactive">URL do Webhook</Label>
                <Input
                  id="webhook-inactive"
                  value={webhooks.inactiveClient.url}
                  onChange={(e) => updateWebhook('inactiveClient', 'url', e.target.value)}
                  placeholder="https://n8n.exemplo.com/webhook/cliente-inativo"
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="gradient-gold text-black font-medium hover:opacity-90"
              >
                {isLoading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-barbershop-gold">Configurações de Tema</CardTitle>
            <CardDescription>Personalize a aparência do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Editor de Tema</h3>
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
              <p className="text-sm text-muted-foreground mt-2">
                Em breve você poderá personalizar cores, logo e favicon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da sua barbearia</p>
      </div>

      {/* Informações da Barbearia */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-barbershop-gold">Informações da Barbearia</CardTitle>
          <CardDescription>Dados básicos do estabelecimento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Nome da Barbearia</Label>
              <Input
                id="name"
                value={barbershopSettings.name}
                onChange={(e) => setBarbershopSettings(prev => ({ ...prev, name: e.target.value }))}
                className="bg-background/50"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={barbershopSettings.phone}
                  onChange={(e) => setBarbershopSettings(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={barbershopSettings.email}
                onChange={(e) => setBarbershopSettings(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10 bg-background/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horário de Funcionamento */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-barbershop-gold">Horário de Funcionamento</CardTitle>
          <CardDescription>Configure os dias e horários de atendimento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(barbershopSettings.workingHours).map(([day, schedule]) => (
            <div key={day} className="flex items-center space-x-4 p-4 rounded-lg bg-background/50">
              <div className="w-32">
                <span className="font-medium">{dayNames[day as keyof typeof dayNames]}</span>
              </div>
              <Switch
                checked={schedule.isOpen}
                onCheckedChange={(checked) => updateWorkingHours(day, 'isOpen', checked)}
              />
              {schedule.isOpen && (
                <>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={schedule.openTime}
                      onChange={(e) => updateWorkingHours(day, 'openTime', e.target.value)}
                      className="w-32 bg-background/50"
                    />
                    <span className="text-muted-foreground">às</span>
                    <Input
                      type="time"
                      value={schedule.closeTime}
                      onChange={(e) => updateWorkingHours(day, 'closeTime', e.target.value)}
                      className="w-32 bg-background/50"
                    />
                  </div>
                </>
              )}
              {!schedule.isOpen && (
                <span className="text-muted-foreground">Fechado</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-barbershop-gold">Notificações</CardTitle>
          <CardDescription>Configure as notificações automáticas (gerenciadas pelo criador)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-barbershop-gold" />
              <div>
                <h4 className="font-medium">Confirmação de Agendamento</h4>
                <p className="text-sm text-muted-foreground">Notifica quando agendamento é confirmado</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-500">Ativo</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-barbershop-gold" />
              <div>
                <h4 className="font-medium">Lembrete de Agendamento</h4>
                <p className="text-sm text-muted-foreground">Lembra cliente antes do atendimento</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-500">Ativo</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-barbershop-gold" />
              <div>
                <h4 className="font-medium">Cliente Inativo</h4>
                <p className="text-sm text-muted-foreground">Alerta para clientes inativos</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Inativo</span>
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-400">
              <Webhook className="h-4 w-4 inline mr-2" />
              As configurações de webhooks são gerenciadas pelo criador do sistema.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="gradient-gold text-black font-medium hover:opacity-90"
        >
          {isLoading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
}
