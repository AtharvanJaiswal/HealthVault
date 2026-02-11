import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FileText, AlertCircle, Bell, Plus, Activity } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { format } from 'date-fns';
import type { MedicalRecord, Reminder } from '../lib/supabase';

export function DashboardPage() {
  const { user } = useAuth();
  const [healthId, setHealthId] = useState<string>('');
  const [recentRecords, setRecentRecords] = useState<MedicalRecord[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    activeReminders: 0,
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    // Get user profile with health ID
    const { data: userData } = await supabase
      .from('users')
      .select('health_id')
      .eq('id', user.id)
      .single();

    if (userData) {
      setHealthId(userData.health_id);
    }

    // Get recent medical records
    const { data: records } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false })
      .limit(5);

    if (records) {
      setRecentRecords(records);
    }

    // Get upcoming reminders
    const { data: reminders } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_completed', false)
      .order('reminder_date', { ascending: true })
      .limit(5);

    if (reminders) {
      setUpcomingReminders(reminders);
    }

    // Get stats
    const { count: recordCount } = await supabase
      .from('medical_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const { count: reminderCount } = await supabase
      .from('reminders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_completed', false);

    setStats({
      totalRecords: recordCount || 0,
      activeReminders: reminderCount || 0,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      prescription: 'bg-blue-100 text-blue-700',
      lab_report: 'bg-green-100 text-green-700',
      vaccination: 'bg-purple-100 text-purple-700',
      scan: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">
          Your Health ID: <span className="font-mono font-semibold text-blue-600">{healthId}</span>
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medical Records</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Reminders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeReminders}</p>
              </div>
              <Bell className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emergency Ready</p>
                <p className="text-2xl font-bold text-green-600">✓</p>
              </div>
              <AlertCircle className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Health Score</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
              <Activity className="w-10 h-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button asChild className="h-auto py-6" variant="outline">
          <Link to="/app/records" className="flex items-center gap-3">
            <Plus className="w-5 h-5" />
            <span>Upload Medical Record</span>
          </Link>
        </Button>

        <Button asChild className="h-auto py-6" variant="outline">
          <Link to="/app/emergency" className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span>View Emergency Card</span>
          </Link>
        </Button>

        <Button asChild className="h-auto py-6" variant="outline">
          <Link to="/app/reminders" className="flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <span>Add Reminder</span>
          </Link>
        </Button>
      </div>

      {/* Recent Records */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Medical Records</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/records">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No medical records yet</p>
              <Button asChild variant="link" className="mt-2">
                <Link to="/app/records">Upload your first record</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{record.title}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(record.uploaded_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${getCategoryColor(record.category)}`}>
                    {record.category.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Reminders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Reminders</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/reminders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingReminders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No upcoming reminders</p>
              <Button asChild variant="link" className="mt-2">
                <Link to="/app/reminders">Add a reminder</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">{reminder.title}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(reminder.reminder_date), 'MMM dd, yyyy')} at {reminder.reminder_time}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                    {reminder.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
