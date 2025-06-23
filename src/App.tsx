
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';

// Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Appointments from '@/pages/Appointments';
import NewAppointment from '@/pages/NewAppointment';
import Clients from '@/pages/Clients';
import Barbers from '@/pages/Barbers';
import Settings from '@/pages/Settings';
import Reports from '@/pages/Reports';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function AppContent() {
  const { user, isLoading } = useAuth();
  
  // Aplicar tema automaticamente
  useTheme();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-barbershop-gold"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/appointments/new" element={<NewAppointment />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/barbers" element={<Barbers />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
