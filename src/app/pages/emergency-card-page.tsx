import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AlertCircle, Edit2, Save, Download } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import type { EmergencyProfile } from '../lib/supabase';

export function EmergencyCardPage() {
  const { user } = useAuth();
  const [healthId, setHealthId] = useState<string>('');
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    blood_group: '',
    allergies: '',
    medical_conditions: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  useEffect(() => {
    if (user) {
      loadEmergencyProfile();
      loadHealthId();
    }
  }, [user]);

  const loadHealthId = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('users')
      .select('health_id')
      .eq('id', user.id)
      .single();

    if (data) {
      setHealthId(data.health_id);
    }
  };

  const loadEmergencyProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('emergency_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        blood_group: data.blood_group || '',
        allergies: data.allergies || '',
        medical_conditions: data.medical_conditions || '',
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_phone: data.emergency_contact_phone || '',
      });
    } else if (error) {
      // Create profile if it doesn't exist
      const { data: newProfile } = await supabase
        .from('emergency_profiles')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (newProfile) {
        setProfile(newProfile);
      }
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setLoading(true);

    const { error } = await supabase
      .from('emergency_profiles')
      .update(formData)
      .eq('id', profile.id);

    if (error) {
      toast.error('Failed to update emergency profile');
    } else {
      toast.success('Emergency profile updated');
      setEditing(false);
      loadEmergencyProfile();
    }

    setLoading(false);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('emergency-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `HealthVault-Emergency-${healthId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const emergencyUrl = `${window.location.origin}/emergency/${healthId}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <AlertCircle className="w-8 h-8 text-red-600" />
          Emergency Card
        </h1>
        <p className="text-gray-600 mt-1">
          Your emergency health information accessible via QR code
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Code Card */}
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-center">Emergency QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-6 rounded-lg flex justify-center">
              <QRCodeSVG
                id="emergency-qr-code"
                value={emergencyUrl}
                size={200}
                level="H"
                includeMargin
              />
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-700 font-medium">
                Health ID: {healthId}
              </p>
              <p className="text-xs text-gray-600">
                Anyone scanning this QR code can view your emergency information
              </p>
            </div>

            <Button
              onClick={handleDownloadQR}
              variant="outline"
              className="w-full gap-2"
            >
              <Download className="w-4 h-4" />
              Download QR Code
            </Button>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Tip:</strong> Print this QR code and keep it in your wallet, car, or
                emergency kit
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Emergency Information</CardTitle>
            {!editing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(true)}
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Input
                    id="blood_group"
                    placeholder="e.g., A+, B-, O+, AB+"
                    value={formData.blood_group}
                    onChange={(e) =>
                      setFormData({ ...formData, blood_group: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    placeholder="e.g., Penicillin, Peanuts, Latex"
                    value={formData.allergies}
                    onChange={(e) =>
                      setFormData({ ...formData, allergies: e.target.value })
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medical_conditions">Medical Conditions</Label>
                  <Textarea
                    id="medical_conditions"
                    placeholder="e.g., Diabetes, Hypertension, Asthma"
                    value={formData.medical_conditions}
                    onChange={(e) =>
                      setFormData({ ...formData, medical_conditions: e.target.value })
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    placeholder="Full name"
                    value={formData.emergency_contact_name}
                    onChange={(e) =>
                      setFormData({ ...formData, emergency_contact_name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.emergency_contact_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, emergency_contact_phone: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      if (profile) {
                        setFormData({
                          blood_group: profile.blood_group || '',
                          allergies: profile.allergies || '',
                          medical_conditions: profile.medical_conditions || '',
                          emergency_contact_name: profile.emergency_contact_name || '',
                          emergency_contact_phone: profile.emergency_contact_phone || '',
                        });
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {profile?.blood_group ? (
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="font-medium">{profile.blood_group}</p>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No blood group set</div>
                )}

                {profile?.allergies ? (
                  <div>
                    <p className="text-sm text-gray-600">Allergies</p>
                    <p className="font-medium">{profile.allergies}</p>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No allergies recorded</div>
                )}

                {profile?.medical_conditions ? (
                  <div>
                    <p className="text-sm text-gray-600">Medical Conditions</p>
                    <p className="font-medium">{profile.medical_conditions}</p>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No medical conditions recorded</div>
                )}

                {profile?.emergency_contact_name ? (
                  <div>
                    <p className="text-sm text-gray-600">Emergency Contact</p>
                    <p className="font-medium">{profile.emergency_contact_name}</p>
                    {profile.emergency_contact_phone && (
                      <p className="text-sm text-gray-600">{profile.emergency_contact_phone}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No emergency contact set</div>
                )}

                {!profile?.blood_group &&
                  !profile?.allergies &&
                  !profile?.medical_conditions &&
                  !profile?.emergency_contact_name && (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-3">No emergency information added yet</p>
                      <Button onClick={() => setEditing(true)}>Add Information</Button>
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How Emergency Access Works</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span>1.</span>
              <span>Download and print your QR code</span>
            </li>
            <li className="flex gap-2">
              <span>2.</span>
              <span>Keep it in your wallet, car dashboard, or emergency kit</span>
            </li>
            <li className="flex gap-2">
              <span>3.</span>
              <span>
                In emergencies, first responders can scan to access critical health information
              </span>
            </li>
            <li className="flex gap-2">
              <span>4.</span>
              <span>Your private medical records remain secure and are NOT accessible via QR</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
