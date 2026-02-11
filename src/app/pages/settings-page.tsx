import { useEffect, useState } from 'react';
import { User, Shield, Bell, Trash2 } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    full_name: '',
    phone: '',
    health_id: '',
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setUserData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        health_id: data.health_id || '',
      });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);

    const { error } = await supabase
      .from('users')
      .update({
        full_name: userData.full_name,
        phone: userData.phone,
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
    }

    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (
      !confirm(
        'This will permanently delete all your medical records, reminders, and emergency information. Continue?'
      )
    ) {
      return;
    }

    setLoading(true);

    // Delete user data (cascading deletes should handle related data)
    const { error } = await supabase.from('users').delete().eq('id', user?.id);

    if (error) {
      toast.error('Failed to delete account');
      setLoading(false);
    } else {
      toast.success('Account deleted');
      await signOut();
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and privacy preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="health_id">Health ID (Cannot be changed)</Label>
              <Input
                id="health_id"
                value={userData.health_id}
                disabled
                className="bg-gray-50 font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Cannot be changed)</Label>
              <Input id="email" value={user?.email || ''} disabled className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={userData.full_name}
                onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Control who can access your health information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Emergency QR Access</p>
              <p className="text-sm text-gray-600">
                Allow emergency information to be viewed via QR code
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch disabled />
          </div>

          <p className="text-sm text-gray-500">
            Additional security features coming soon
          </p>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Reminder Notifications</p>
              <p className="text-sm text-gray-600">
                Get notified about upcoming medicine and appointments
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <Switch disabled />
          </div>

          <p className="text-sm text-gray-500">
            Notification preferences coming soon
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Deleting your account will permanently remove all your data including:
            </p>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              <li>Medical records and uploaded files</li>
              <li>Emergency profile information</li>
              <li>Reminders and appointments</li>
              <li>All account settings</li>
            </ul>
          </div>

          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={loading}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">About Data Privacy</h3>
          <p className="text-sm text-blue-800">
            HealthVault is a prototype application. For production use with real medical data,
            ensure compliance with healthcare regulations like HIPAA and implement proper security
            measures including encryption, audit logs, and access controls.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
