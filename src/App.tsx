
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { useEffect } from "react";
import { initializeDefaultData } from "@/lib/storage";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Inicializar dados padrão na primeira execução
    initializeDefaultData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <Layout>
                  <Dashboard />
                </Layout>
              } />
              <Route path="/appointments" element={
                <Layout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-barbershop-gold mb-4">Agendamentos</h1>
                    <p className="text-muted-foreground">Página em desenvolvimento...</p>
                  </div>
                </Layout>
              } />
              <Route path="/clients" element={
                <Layout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-barbershop-gold mb-4">Clientes</h1>
                    <p className="text-muted-foreground">Página em desenvolvimento...</p>
                  </div>
                </Layout>
              } />
              <Route path="/barbers" element={
                <Layout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-barbershop-gold mb-4">Barbeiros</h1>
                    <p className="text-muted-foreground">Página em desenvolvimento...</p>
                  </div>
                </Layout>
              } />
              <Route path="/reports" element={
                <Layout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-barbershop-gold mb-4">Relatórios</h1>
                    <p className="text-muted-foreground">Página em desenvolvimento...</p>
                  </div>
                </Layout>
              } />
              <Route path="/settings" element={
                <Layout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-barbershop-gold mb-4">Configurações</h1>
                    <p className="text-muted-foreground">Página em desenvolvimento...</p>
                  </div>
                </Layout>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
