import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/auth-context';
import { Toaster } from './components/ui/sonner';
import { SupabaseSetupNotice } from './components/supabase-setup-notice';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  // Show setup notice if Supabase is not configured
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice />;
  }

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}
