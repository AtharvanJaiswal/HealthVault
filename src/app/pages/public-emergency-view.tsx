import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Heart, AlertCircle, Phone, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import type { EmergencyProfile } from '../lib/supabase';

export function PublicEmergencyView() {
  const { healthId } = useParams<{ healthId: string }>();
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (healthId) {
      loadEmergencyData();
    }
  }, [healthId]);

  const loadEmergencyData = async () => {
    if (!healthId) return;

    try {
      // Get user by health_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, full_name')
        .eq('health_id', healthId)
        .single();

      if (userError || !userData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setUserName(userData.full_name);

      // Get emergency profile
      const { data: profileData, error: profileError } = await supabase
        .from('emergency_profiles')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading emergency data:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="w-12 h-12 text-red-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading emergency information...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Health ID Not Found</h2>
            <p className="text-gray-600 mb-6">
              The emergency health profile for ID <span className="font-mono">{healthId}</span> could
              not be found.
            </p>
            <Button asChild>
              <Link to="/">Go to HealthVault</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-600" />
              <span className="text-xl font-bold text-gray-900">HealthVault</span>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <span className="font-semibold">EMERGENCY ACCESS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Emergency Information */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Alert Banner */}
          <Card className="bg-red-100 border-red-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Emergency Health Information</h3>
                  <p className="text-sm text-red-800">
                    This is a read-only view of critical health information. For medical emergencies,
                    call emergency services immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{userName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Health ID</p>
                  <p className="text-lg font-mono font-semibold text-blue-600">{healthId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Health Information */}
          <Card>
            <CardHeader>
              <CardTitle>Critical Health Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile?.blood_group ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-gray-700 mb-1">Blood Group</p>
                  <p className="text-3xl font-bold text-red-700">{profile.blood_group}</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border rounded-lg">
                  <p className="text-gray-500">Blood group not provided</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Allergies</h3>
                {profile?.allergies ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{profile.allergies}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 p-4 bg-gray-50 border rounded-lg">
                    No allergies recorded
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Medical Conditions</h3>
                {profile?.medical_conditions ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{profile.medical_conditions}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 p-4 bg-gray-50 border rounded-lg">
                    No medical conditions recorded
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {(profile?.emergency_contact_name || profile?.emergency_contact_phone) && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Phone className="w-5 h-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.emergency_contact_name && (
                  <div>
                    <p className="text-sm text-gray-700">Name</p>
                    <p className="font-semibold text-gray-900">{profile.emergency_contact_name}</p>
                  </div>
                )}
                {profile?.emergency_contact_phone && (
                  <div>
                    <p className="text-sm text-gray-700">Phone Number</p>
                    <a
                      href={`tel:${profile.emergency_contact_phone}`}
                      className="text-lg font-semibold text-blue-600 hover:underline"
                    >
                      {profile.emergency_contact_phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Notice</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• This page only displays emergency health information</li>
                <li>• Full medical records are NOT accessible via this link</li>
                <li>• This information is intended for emergency responders only</li>
                <li>• Unauthorized access or misuse is prohibited</li>
              </ul>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-6">
            <Button asChild variant="outline">
              <Link to="/">Learn More About HealthVault</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
