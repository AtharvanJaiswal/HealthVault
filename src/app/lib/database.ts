import type { User as SupabaseUser } from '@supabase/supabase-js';
import { generateHealthID, supabase } from './supabase';
import type { EmergencyProfile } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  health_id: string;
  full_name: string;
  phone?: string | null;
}

export interface PublicEmergencyData {
  user_id: string;
  full_name: string;
  health_id: string;
  profile_id: string | null;
  blood_group: string | null;
  allergies: string | null;
  medical_conditions: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  updated_at: string | null;
}

const getProfileValues = (user: SupabaseUser) => {
  const metadata = user.user_metadata ?? {};

  return {
    email: user.email ?? '',
    full_name: typeof metadata.full_name === 'string' ? metadata.full_name : '',
    phone: typeof metadata.phone === 'string' ? metadata.phone : '',
  };
};

export const ensureUserProfile = async (user: SupabaseUser): Promise<UserProfile> => {
  const existingProfile = await getUserProfile(user.id);

  if (existingProfile) {
    await ensureEmergencyProfile(user.id);
    return existingProfile;
  }

  const profileValues = getProfileValues(user);
  const healthId = generateHealthID();

  const { data: createdProfile, error: insertError } = await supabase
    .from('users')
    .insert({
      id: user.id,
      email: profileValues.email,
      full_name: profileValues.full_name || profileValues.email,
      phone: profileValues.phone || null,
      health_id: healthId,
    })
    .select('id, email, health_id, full_name, phone')
    .single();

  if (insertError) {
    const profile = await getUserProfile(user.id);

    if (profile) {
      await ensureEmergencyProfile(user.id);
      return profile;
    }

    throw insertError;
  }

  await ensureEmergencyProfile(user.id);
  return createdProfile;
};

const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, health_id, full_name, phone')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const ensureEmergencyProfile = async (userId: string): Promise<EmergencyProfile | null> => {
  const { data: existingProfile, error: lookupError } = await supabase
    .from('emergency_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (existingProfile) {
    return existingProfile;
  }

  const { data: createdProfile, error: insertError } = await supabase
    .from('emergency_profiles')
    .insert({ user_id: userId })
    .select()
    .single();

  if (insertError) {
    const { data: profile } = await supabase
      .from('emergency_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (profile) {
      return profile;
    }

    throw insertError;
  }

  return createdProfile;
};

export const getPublicEmergencyData = async (
  healthId: string
): Promise<PublicEmergencyData | null> => {
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_public_emergency_profile', {
    health_id_input: healthId,
  });

  if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
    return rpcData[0] as PublicEmergencyData;
  }

  // Fallback keeps older local databases usable until the setup SQL is rerun.
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, full_name, health_id')
    .eq('health_id', healthId)
    .maybeSingle();

  if (userError || !userData) {
    return null;
  }

  const { data: profileData } = await supabase
    .from('emergency_profiles')
    .select('*')
    .eq('user_id', userData.id)
    .maybeSingle();

  return {
    user_id: userData.id,
    full_name: userData.full_name,
    health_id: userData.health_id,
    profile_id: profileData?.id ?? null,
    blood_group: profileData?.blood_group ?? null,
    allergies: profileData?.allergies ?? null,
    medical_conditions: profileData?.medical_conditions ?? null,
    emergency_contact_name: profileData?.emergency_contact_name ?? null,
    emergency_contact_phone: profileData?.emergency_contact_phone ?? null,
    updated_at: profileData?.updated_at ?? null,
  };
};
