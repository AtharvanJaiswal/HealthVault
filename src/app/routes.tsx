import { createBrowserRouter } from 'react-router';
import { WelcomePage } from './pages/welcome-page';
import { LoginPage } from './pages/login-page';
import { SignupPage } from './pages/signup-page';
import { DashboardPage } from './pages/dashboard-page';
import { MedicalRecordsPage } from './pages/medical-records-page';
import { EmergencyCardPage } from './pages/emergency-card-page';
import { RemindersPage } from './pages/reminders-page';
import { SettingsPage } from './pages/settings-page';
import { PublicEmergencyView } from './pages/public-emergency-view';
import { Layout } from './components/layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/emergency/:healthId',
    element: <PublicEmergencyView />,
  },
  {
    path: '/app',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'records',
        element: <MedicalRecordsPage />,
      },
      {
        path: 'emergency',
        element: <EmergencyCardPage />,
      },
      {
        path: 'reminders',
        element: <RemindersPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);
