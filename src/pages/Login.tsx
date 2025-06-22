
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scissors, Settings, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCreatorLogin, setShowCreatorLogin] = useState(false);
  const { login, isLoading, error, user } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando...",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Erro no login",
        description: error || "Email ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  const toggleCreatorLogin = () => {
    setShowCreatorLogin(!showCreatorLogin);
    setEmail(showCreatorLogin ? 'admin@barbeariaelegante.com' : 'creator@barbershop.com');
    setPassword(showCreatorLogin ? 'admin123' : 'creator123');
  };

  const fillDemoCredentials = (type: 'admin' | 'creator') => {
    if (type === 'admin') {
      setEmail('admin@barbeariaelegante.com');
      setPassword('admin123');
      setShowCreatorLogin(false);
    } else {
      setEmail('creator@barbershop.com');
      setPassword('creator123');
      setShowCreatorLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-barbershop-dark-bg via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e título */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-barbershop-gold to-barbershop-gold-light p-4 rounded-full">
              <Scissors className="h-12 w-12 text-black" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient">
              Barbearia Elegante
            </h1>
            <p className="text-muted-foreground text-lg">
              Sistema de Gestão
            </p>
          </div>
        </div>

        {/* Card de Login */}
        <Card className="glass-card border-barbershop-gold/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {showCreatorLogin ? 'Acesso do Criador' : 'Acesso Administrativo'}
            </CardTitle>
            <CardDescription className="text-center">
              {showCreatorLogin 
                ? 'Login para configurações avançadas do sistema'
                : 'Entre com suas credenciais para acessar o sistema'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={showCreatorLogin ? "creator@barbershop.com" : "admin@barbeariaelegante.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-barbershop-gold/30 focus:border-barbershop-gold"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={showCreatorLogin ? "creator123" : "admin123"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-barbershop-gold/30 focus:border-barbershop-gold"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full gradient-gold text-black font-semibold hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Botões de acesso rápido para demo */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials('admin')}
                className="text-xs border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
                disabled={isLoading}
              >
                Login Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials('creator')}
                className="text-xs border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
                disabled={isLoading}
              >
                Login Criador
              </Button>
            </div>

            {/* Dica de credenciais para demonstração */}
            <div className="text-xs text-muted-foreground text-center p-3 bg-muted/20 rounded-lg">
              <p className="font-medium mb-1">Demo - Credenciais de Teste:</p>
              <p>Admin: admin@barbeariaelegante.com / admin123</p>
              <p>Criador: creator@barbershop.com / creator123</p>
            </div>
          </CardContent>
        </Card>

        {/* Botão flutuante para acesso do criador */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={toggleCreatorLogin}
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 glass-card border-barbershop-gold/30 hover:border-barbershop-gold hover:bg-barbershop-gold/10"
            title={showCreatorLogin ? "Voltar ao login admin" : "Acesso do criador"}
            disabled={isLoading}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
