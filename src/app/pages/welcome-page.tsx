import { Link } from 'react-router';
import { Heart, Shield, Clock, QrCode } from 'lucide-react';
import { Button } from '../components/ui/button';

export function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">HealthVault</span>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="ghost">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Digital Health ID & Medical Records, Always With You
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Store, organize, and access your medical data securely. Be prepared for emergencies with instant health information access.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/signup">Create Your Health ID</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Storage</h3>
            <p className="text-gray-600 text-sm">
              Your medical records are encrypted and stored securely with privacy controls you manage.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Emergency Access</h3>
            <p className="text-gray-600 text-sm">
              QR code provides instant access to critical health info during emergencies.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Medical Records</h3>
            <p className="text-gray-600 text-sm">
              Upload and organize prescriptions, lab reports, vaccinations, and scan reports.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Reminders</h3>
            <p className="text-gray-600 text-sm">
              Never miss a medicine dose or doctor appointment with timely reminders.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© 2026 HealthVault. A secure digital health management system.</p>
            <p className="mt-2 text-xs">
              Note: This is a prototype application. For production use, ensure HIPAA compliance and proper security audits.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
