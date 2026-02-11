import { useEffect, useState } from 'react';
import { Bell, Plus, Check, Trash2, Clock } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { format, isPast, parseISO } from 'date-fns';
import type { Reminder } from '../lib/supabase';

export function RemindersPage() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'medicine' as Reminder['type'],
    title: '',
    description: '',
    reminder_date: '',
    reminder_time: '',
    frequency: 'once' as Reminder['frequency'],
  });

  useEffect(() => {
    if (user) {
      loadReminders();
    }
  }, [user]);

  const loadReminders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('reminder_date', { ascending: true })
      .order('reminder_time', { ascending: true });

    if (error) {
      toast.error('Failed to load reminders');
    } else {
      setReminders(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);

    const { error } = await supabase.from('reminders').insert({
      user_id: user.id,
      ...formData,
      is_completed: false,
    });

    if (error) {
      toast.error('Failed to create reminder');
    } else {
      toast.success('Reminder created');
      setDialogOpen(false);
      resetForm();
      loadReminders();
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      type: 'medicine',
      title: '',
      description: '',
      reminder_date: '',
      reminder_time: '',
      frequency: 'once',
    });
  };

  const handleToggleComplete = async (reminder: Reminder) => {
    const { error } = await supabase
      .from('reminders')
      .update({ is_completed: !reminder.is_completed })
      .eq('id', reminder.id);

    if (error) {
      toast.error('Failed to update reminder');
    } else {
      toast.success(reminder.is_completed ? 'Reminder marked as incomplete' : 'Reminder completed!');
      loadReminders();
    }
  };

  const handleDelete = async (reminderId: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    const { error } = await supabase.from('reminders').delete().eq('id', reminderId);

    if (error) {
      toast.error('Failed to delete reminder');
    } else {
      toast.success('Reminder deleted');
      loadReminders();
    }
  };

  const isReminderOverdue = (reminder: Reminder) => {
    if (reminder.is_completed) return false;
    const reminderDateTime = parseISO(`${reminder.reminder_date}T${reminder.reminder_time}`);
    return isPast(reminderDateTime);
  };

  const activeReminders = reminders.filter((r) => !r.is_completed);
  const completedReminders = reminders.filter((r) => r.is_completed);
  const overdueReminders = activeReminders.filter((r) => isReminderOverdue(r));

  const ReminderCard = ({ reminder }: { reminder: Reminder }) => {
    const isOverdue = isReminderOverdue(reminder);

    return (
      <Card
        className={`${
          reminder.is_completed
            ? 'bg-gray-50 border-gray-200'
            : isOverdue
            ? 'bg-red-50 border-red-200'
            : 'bg-white'
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Button
              variant="outline"
              size="icon"
              className={`shrink-0 ${
                reminder.is_completed ? 'bg-green-100 border-green-300' : ''
              }`}
              onClick={() => handleToggleComplete(reminder)}
            >
              {reminder.is_completed ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      reminder.is_completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}
                  >
                    {reminder.title}
                  </h3>
                  {reminder.description && (
                    <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full shrink-0 ${
                    reminder.type === 'medicine'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {reminder.type}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {format(new Date(reminder.reminder_date), 'MMM dd, yyyy')} at{' '}
                    {reminder.reminder_time}
                  </span>
                </div>
                {reminder.frequency && reminder.frequency !== 'once' && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                    {reminder.frequency}
                  </span>
                )}
              </div>

              {isOverdue && !reminder.is_completed && (
                <p className="text-sm text-red-600 font-medium mt-2">Overdue</p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => handleDelete(reminder.id)}
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-1">Manage your medicine and appointment reminders</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Reminder</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as Reminder['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Take Blood Pressure Medication"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add dosage, doctor's name, or other details"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.reminder_date}
                    onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.reminder_time}
                    onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, frequency: value as Reminder['frequency'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Create Reminder'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      {overdueReminders.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <p className="text-red-800 font-medium">
              You have {overdueReminders.length} overdue reminder{overdueReminders.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reminders List */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeReminders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedReminders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3">
          {activeReminders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active reminders</h3>
                <p className="text-gray-500 mb-4">Create your first reminder to get started</p>
                <Button onClick={() => setDialogOpen(true)}>Add Reminder</Button>
              </CardContent>
            </Card>
          ) : (
            activeReminders.map((reminder) => <ReminderCard key={reminder.id} reminder={reminder} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completedReminders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Check className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed reminders</h3>
                <p className="text-gray-500">Completed reminders will appear here</p>
              </CardContent>
            </Card>
          ) : (
            completedReminders.map((reminder) => <ReminderCard key={reminder.id} reminder={reminder} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
