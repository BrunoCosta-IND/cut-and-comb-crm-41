
import { Calendar, Users, Scissors, BarChart3, Settings, Home, Bell } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ['admin', 'creator']
  },
  {
    title: "Agendamentos",
    url: "/appointments",
    icon: Calendar,
    roles: ['admin']
  },
  {
    title: "Clientes",
    url: "/clients",
    icon: Users,
    roles: ['admin']
  },
  {
    title: "Barbeiros",
    url: "/barbers",
    icon: Scissors,
    roles: ['admin']
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: BarChart3,
    roles: ['admin']
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
    roles: ['admin', 'creator']
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'admin')
  );

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-barbershop-gold to-barbershop-gold-light p-2 rounded-lg">
            <Scissors className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gradient">
              {user?.role === 'creator' ? 'Painel do Criador' : 'Barbearia Elegante'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.name}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="data-[active=true]:bg-barbershop-gold/10 data-[active=true]:text-barbershop-gold data-[active=true]:border-barbershop-gold/30"
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="flex items-center space-x-3 w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button 
          onClick={logout}
          variant="outline" 
          className="w-full border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
        >
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
