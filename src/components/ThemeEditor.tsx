import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Palette, Upload, Eye, Save } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export function ThemeEditor() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const [themeData, setThemeData] = useState({
    primaryColor: '#D4AF37',
    secondaryColor: '#F4E4BC',
    logo: '',
    favicon: ''
  });

  useEffect(() => {
    // Carregar configurações atuais
    const barbershop = storage.getBarbershop('barbershop-1');
    if (barbershop?.theme) {
      setThemeData({
        primaryColor: barbershop.theme.primaryColor,
        secondaryColor: barbershop.theme.secondaryColor,
        logo: barbershop.theme.logo || '',
        favicon: barbershop.theme.favicon || ''
      });
    }
  }, []);

  const applyThemeToDocument = (primaryColor: string, secondaryColor: string, logo?: string, favicon?: string) => {
    // Aplicar cores CSS customizadas
    document.documentElement.style.setProperty('--barbershop-gold', primaryColor);
    document.documentElement.style.setProperty('--barbershop-gold-light', secondaryColor);
    
    // Atualizar variáveis CSS do Tailwind
    document.documentElement.style.setProperty('--primary', `${hexToHsl(primaryColor)}`);
    
    // Aplicar logo se fornecido
    if (logo) {
      // Atualizar todas as instâncias de logo no sistema
      const logoElements = document.querySelectorAll('[data-logo]');
      logoElements.forEach(element => {
        if (element instanceof HTMLImageElement) {
          element.src = logo;
        }
      });
    }
    
    // Aplicar favicon se fornecido
    if (favicon) {
      updateFavicon(favicon);
    }
  };

  const updateFavicon = (faviconUrl: string) => {
    // Remove favicon existente
    const existingFavicon = document.querySelector("link[rel*='icon']");
    if (existingFavicon) {
      existingFavicon.remove();
    }
    
    // Adiciona novo favicon
    const newFavicon = document.createElement('link');
    newFavicon.rel = 'icon';
    newFavicon.type = 'image/png';
    newFavicon.href = faviconUrl;
    document.head.appendChild(newFavicon);
  };

  const hexToHsl = (hex: string): string => {
    // Converter hex para HSL para compatibilidade com CSS variables
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const handleColorChange = (field: string, value: string) => {
    setThemeData(prev => ({ ...prev, [field]: value }));
    
    if (previewMode) {
      // Aplicar cores em tempo real no modo preview
      document.documentElement.style.setProperty(
        field === 'primaryColor' ? '--barbershop-gold' : '--barbershop-gold-light',
        value
      );
    }
  };

  const handleFileUpload = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setThemeData(prev => ({ ...prev, [field]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreview = () => {
    if (previewMode) {
      // Restaurar tema original
      const originalBarbershop = storage.getBarbershop('barbershop-1');
      if (originalBarbershop?.theme) {
        applyThemeToDocument(
          originalBarbershop.theme.primaryColor,
          originalBarbershop.theme.secondaryColor,
          originalBarbershop.theme.logo,
          originalBarbershop.theme.favicon
        );
      } else {
        // Restaurar cores padrão
        applyThemeToDocument('#D4AF37', '#F4E4BC');
      }
    } else {
      // Aplicar cores de preview
      applyThemeToDocument(themeData.primaryColor, themeData.secondaryColor, themeData.logo, themeData.favicon);
    }
    setPreviewMode(!previewMode);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const barbershop = storage.getBarbershop('barbershop-1');
      if (barbershop) {
        const updatedBarbershop = {
          ...barbershop,
          theme: {
            primaryColor: themeData.primaryColor,
            secondaryColor: themeData.secondaryColor,
            logo: themeData.logo || undefined,
            favicon: themeData.favicon || undefined
          },
          updatedAt: new Date()
        };
        
        storage.saveBarbershop(updatedBarbershop);
        
        // Aplicar o tema definitivamente
        applyThemeToDocument(
          themeData.primaryColor, 
          themeData.secondaryColor, 
          themeData.logo, 
          themeData.favicon
        );
        
        // Salvar no localStorage para persistir entre sessões
        localStorage.setItem('barbershop-theme', JSON.stringify({
          primaryColor: themeData.primaryColor,
          secondaryColor: themeData.secondaryColor,
          logo: themeData.logo,
          favicon: themeData.favicon
        }));
        
        toast({
          title: "Tema salvo",
          description: "As configurações de tema foram aplicadas com sucesso!",
        });
        
        setPreviewMode(false);
        
        // Forçar atualização da página após 1 segundo para garantir que todas as mudanças sejam aplicadas
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar tema. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedColors = [
    { name: 'Dourado Clássico', primary: '#D4AF37', secondary: '#F4E4BC' },
    { name: 'Azul Elegante', primary: '#1E40AF', secondary: '#DBEAFE' },
    { name: 'Verde Sofisticado', primary: '#059669', secondary: '#D1FAE5' },
    { name: 'Roxo Moderno', primary: '#7C3AED', secondary: '#EDE9FE' },
    { name: 'Vermelho Clássico', primary: '#DC2626', secondary: '#FEE2E2' },
    { name: 'Laranja Vibrante', primary: '#EA580C', secondary: '#FED7AA' }
  ];

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-barbershop-gold">Editor de Tema</CardTitle>
              <CardDescription>Personalize a aparência do sistema</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={togglePreview}
                className="border-barbershop-gold/30 text-barbershop-gold hover:bg-barbershop-gold/10"
              >
                <Eye className="mr-2 h-4 w-4" />
                {previewMode ? 'Sair do Preview' : 'Preview'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="gradient-gold text-black font-medium hover:opacity-90"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Salvando...' : 'Salvar Tema'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cores Predefinidas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Temas Predefinidos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {predefinedColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setThemeData(prev => ({
                      ...prev,
                      primaryColor: color.primary,
                      secondaryColor: color.secondary
                    }));
                    if (previewMode) {
                      document.documentElement.style.setProperty('--barbershop-gold', color.primary);
                      document.documentElement.style.setProperty('--barbershop-gold-light', color.secondary);
                    }
                  }}
                  className="p-3 rounded-lg border border-border/50 hover:border-barbershop-gold/50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: color.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: color.secondary }}
                      />
                    </div>
                    <span className="text-sm font-medium">{color.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Cores Personalizadas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cores Personalizadas</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="primaryColor">Cor Primária</Label>
                <div className="flex space-x-2 items-center">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={themeData.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-16 h-10 p-1 bg-background/50"
                  />
                  <Input
                    value={themeData.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 bg-background/50"
                    placeholder="#D4AF37"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Cor Secundária</Label>
                <div className="flex space-x-2 items-center">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={themeData.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="w-16 h-10 p-1 bg-background/50"
                  />
                  <Input
                    value={themeData.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 bg-background/50"
                    placeholder="#F4E4BC"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Logo e Favicon */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Identidade Visual</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="logo">Logo da Barbearia</Label>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('logo', e)}
                      className="bg-background/50"
                    />
                    <Upload className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                  {themeData.logo && (
                    <div className="p-4 bg-background/30 rounded-lg">
                      <img 
                        src={themeData.logo} 
                        alt="Logo Preview" 
                        className="h-16 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="favicon">Favicon</Label>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      id="favicon"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('favicon', e)}
                      className="bg-background/50"
                    />
                    <Upload className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                  {themeData.favicon && (
                    <div className="p-4 bg-background/30 rounded-lg">
                      <img 
                        src={themeData.favicon} 
                        alt="Favicon Preview" 
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Visual */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Preview do Tema</h3>
            <div className="p-6 bg-background/30 rounded-lg border border-border/50">
              <div className="space-y-4">
                <div 
                  className="px-4 py-2 rounded-lg text-black font-medium"
                  style={{ background: `linear-gradient(135deg, ${themeData.primaryColor} 0%, ${themeData.secondaryColor} 100%)` }}
                >
                  Botão Principal
                </div>
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5" style={{ color: themeData.primaryColor }} />
                  <span style={{ color: themeData.primaryColor }}>Texto com cor primária</span>
                </div>
                <div 
                  className="p-3 rounded-lg border"
                  style={{ borderColor: themeData.primaryColor + '30', backgroundColor: themeData.primaryColor + '10' }}
                >
                  Card com tema personalizado
                </div>
              </div>
            </div>
          </div>

          {previewMode && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-400">
                <Eye className="h-4 w-4 inline mr-2" />
                Modo Preview ativo. As cores estão sendo aplicadas temporariamente. Clique em "Salvar Tema" para aplicar definitivamente.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
