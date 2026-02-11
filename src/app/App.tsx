import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/auth-context';
import { Toaster } from './components/ui/sonner';
import { SupabaseSetupNotice } from './components/supabase-setup-notice';

export default function App() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Show setup notice if Supabase is not configured
  if (!supabaseUrl || !supabaseKey) {
    return <SupabaseSetupNotice />;
  }

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}