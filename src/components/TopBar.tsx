
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { storage } from '@/lib/storage';
import { useEffect, useState } from 'react';

export default function TopBar() {
  const { user, logout } = useAuth();
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    // Carregar logo personalizado
    const barbershop = storage.getBarbershop('barbershop-1');
    if (barbershop?.theme?.logo) {
      setLogo(barbershop.theme.logo);
    }
  }, []);

  return (
    <div className="h-14 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
      {/* Logo e nome */}
      <div className="flex items-center space-x-3">
        {logo ? (
          <img 
            src={logo} 
            alt="Logo" 
            data-logo
            className="h-8 w-8 object-contain"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-barbershop-gold to-barbershop-gold-light rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">B</span>
          </div>
        )}
        <h1 className="text-lg font-semibold text-barbershop-gold">Barbearia Elegante</h1>
      </div>

      {/* Barra de pesquisa */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar clientes, agendamentos..."
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Notificações */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-barbershop-gold text-black">
            3
          </Badge>
        </Button>

        {/* User menu */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-barbershop-gold/20 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-barbershop-gold" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
