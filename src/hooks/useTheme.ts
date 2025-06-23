
import { useEffect } from 'react';
import { storage } from '@/lib/storage';

export const useTheme = () => {
  useEffect(() => {
    const applyStoredTheme = () => {
      // Tentar carregar tema do localStorage primeiro (mais rápido)
      const storedTheme = localStorage.getItem('barbershop-theme');
      
      if (storedTheme) {
        try {
          const theme = JSON.parse(storedTheme);
          applyTheme(theme);
          return;
        } catch (error) {
          console.warn('Erro ao carregar tema do localStorage:', error);
        }
      }
      
      // Fallback para storage da barbearia
      const barbershop = storage.getBarbershop('barbershop-1');
      if (barbershop?.theme) {
        applyTheme(barbershop.theme);
      }
    };

    const applyTheme = (theme: any) => {
      // Aplicar cores CSS
      if (theme.primaryColor) {
        document.documentElement.style.setProperty('--barbershop-gold', theme.primaryColor);
        document.documentElement.style.setProperty('--primary', hexToHsl(theme.primaryColor));
      }
      
      if (theme.secondaryColor) {
        document.documentElement.style.setProperty('--barbershop-gold-light', theme.secondaryColor);
      }
      
      // Aplicar favicon
      if (theme.favicon) {
        updateFavicon(theme.favicon);
      }
    };

    const updateFavicon = (faviconUrl: string) => {
      const existingFavicon = document.querySelector("link[rel*='icon']");
      if (existingFavicon) {
        existingFavicon.remove();
      }
      
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.type = 'image/png';
      newFavicon.href = faviconUrl;
      document.head.appendChild(newFavicon);
    };

    const hexToHsl = (hex: string): string => {
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

    // Aplicar tema quando o componente monta
    applyStoredTheme();
  }, []);
};
