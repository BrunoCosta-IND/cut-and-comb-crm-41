
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scissors, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  Users,
  Award,
  Calendar,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { storage } from '@/lib/storage';

const Index = () => {
  const navigate = useNavigate();
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    // Carregar logo personalizado
    const barbershop = storage.getBarbershop('barbershop-1');
    if (barbershop?.theme?.logo) {
      setLogo(barbershop.theme.logo);
    }
  }, []);

  const services = [
    {
      name: "Corte Clássico",
      price: "R$ 35",
      duration: "30min",
      description: "Corte tradicional com acabamento impecável"
    },
    {
      name: "Barba Completa",
      price: "R$ 25",
      duration: "20min", 
      description: "Aparar, modelar e finalizar com produtos premium"
    },
    {
      name: "Corte + Barba",
      price: "R$ 55",
      duration: "45min",
      description: "Combo completo para o visual perfeito"
    },
    {
      name: "Corte Premium",
      price: "R$ 50",
      duration: "40min",
      description: "Corte moderno com styling e produtos exclusivos"
    }
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Clientes Atendidos" },
    { icon: Award, value: "5", label: "Anos de Experiência" },
    { icon: Star, value: "4.9", label: "Avaliação Média" },
    { icon: Scissors, value: "1000+", label: "Cortes Realizados" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {logo ? (
              <img 
                src={logo} 
                alt="Logo" 
                className="h-8 w-8 object-contain"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-barbershop-gold to-barbershop-gold-light rounded-lg flex items-center justify-center">
                <Scissors className="h-4 w-4 text-black" />
              </div>
            )}
            <h1 className="text-xl font-bold text-barbershop-gold">Barbearia Elegante</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#services" className="text-muted-foreground hover:text-barbershop-gold transition-colors">Serviços</a>
            <a href="#about" className="text-muted-foreground hover:text-barbershop-gold transition-colors">Sobre</a>
            <a href="#contact" className="text-muted-foreground hover:text-barbershop-gold transition-colors">Contato</a>
            <Button 
              onClick={() => navigate('/login')}
              className="gradient-gold text-black font-semibold hover:opacity-90"
            >
              Área Admin
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-background via-gray-900/50 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6 animate-fade-in">
            <Badge className="bg-barbershop-gold/20 text-barbershop-gold border-barbershop-gold/30">
              ✂️ Tradição em Cortes Masculinos
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="text-gradient">Estilo & Elegância</span>
              <br />
              <span className="text-foreground">para o Homem Moderno</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experimente o melhor em cortes masculinos e cuidados com a barba. 
              Tradição, qualidade e atendimento personalizado em cada serviço.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="gradient-gold text-black font-semibold hover:opacity-90 w-full sm:w-auto"
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Horário
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10 w-full sm:w-auto"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Serviços
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-barbershop-gold/20 rounded-full flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-barbershop-gold" />
                </div>
                <div className="text-2xl font-bold text-barbershop-gold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Nossos <span className="text-gradient">Serviços</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Oferecemos uma gama completa de serviços para cuidar do seu visual com a qualidade que você merece.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="glass-card hover:border-barbershop-gold/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <Badge variant="outline" className="text-barbershop-gold border-barbershop-gold/30">
                      {service.price}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {service.duration}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
                    onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                  >
                    Agendar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Sobre a <span className="text-gradient">Barbearia Elegante</span>
              </h2>
              
              <p className="text-muted-foreground leading-relaxed">
                Com mais de 5 anos de experiência, a Barbearia Elegante se consolidou como referência 
                em cortes masculinos na região. Nossa missão é proporcionar não apenas um corte de cabelo, 
                mas uma experiência completa de cuidado pessoal.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos apenas produtos premium e técnicas modernas, sempre mantendo o toque tradicional 
                que faz da barbearia um ambiente acolhedor e profissional.
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-5 w-5 text-barbershop-gold fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5 - Baseado em 200+ avaliações</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-barbershop-gold/20 to-transparent rounded-2xl flex items-center justify-center">
                <Scissors className="h-24 w-24 text-barbershop-gold" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-barbershop-gold text-black p-4 rounded-xl font-bold">
                Desde 2019
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Entre em <span className="text-gradient">Contato</span></h2>
            <p className="text-muted-foreground">
              Estamos prontos para atendê-lo. Agende seu horário ou tire suas dúvidas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-barbershop-gold/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-barbershop-gold" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Localização</h3>
                  <p className="text-muted-foreground text-sm">
                    Rua da Elegância, 123<br />
                    Centro - São Paulo/SP
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-barbershop-gold/20 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-barbershop-gold" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Telefone</h3>
                  <p className="text-muted-foreground text-sm">
                    (11) 99999-9999<br />
                    WhatsApp disponível
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-barbershop-gold/20 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-barbershop-gold" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Horário</h3>
                  <p className="text-muted-foreground text-sm">
                    Seg à Sex: 8h às 19h<br />
                    Sáb: 8h às 17h
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="gradient-gold text-black font-semibold hover:opacity-90"
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
            >
              <Phone className="mr-2 h-5 w-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {logo ? (
                  <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-barbershop-gold to-barbershop-gold-light rounded-lg flex items-center justify-center">
                    <Scissors className="h-4 w-4 text-black" />
                  </div>
                )}
                <span className="font-bold text-barbershop-gold">Barbearia Elegante</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Tradição e qualidade em cada corte. Cuidando do seu estilo desde 2019.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Contato</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>contato@barbeariaelegante.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Rua da Elegância, 123 - Centro/SP</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Redes Sociais</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-barbershop-gold">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-barbershop-gold">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-barbershop-gold">
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Barbearia Elegante. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
