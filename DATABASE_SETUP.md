# HealthVault - Supabase Database Setup Guide

## Overview

This guide will help you set up the Supabase database for the HealthVault application.

## Prerequisites

- A Supabase account and project
- Supabase project URL and anon key

## Environment Variables

Add these to your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

Run the following SQL in your Supabase SQL Editor to create all necessary tables:

### 1. Users Table

```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  health_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own data" ON users
  FOR DELETE USING (auth.uid() = id);
```

### 2. Emergency Profiles Table

```sql
-- Create emergency_profiles table
CREATE TABLE emergency_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  blood_group TEXT,
  allergies TEXT,
  medical_conditions TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE emergency_profiles ENABLE ROW LEVEL SECURITY;

-- Users can manage their own emergency profile
CREATE POLICY "Users can view own emergency profile" ON emergency_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency profile" ON emergency_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency profile" ON emergency_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own emergency profile" ON emergency_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Public can read emergency profiles (for QR code access)
CREATE POLICY "Public can read emergency profiles" ON emergency_profiles
  FOR SELECT USING (true);
```

### 3. Medical Records Table

```sql
-- Create medical_records table
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('prescription', 'lab_report', 'vaccination', 'scan', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_visible_in_emergency BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Users can manage their own medical records
CREATE POLICY "Users can view own records" ON medical_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records" ON medical_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records" ON medical_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records" ON medical_records
  FOR DELETE USING (auth.uid() = user_id);
```

### 4. Reminders Table

```sql
-- Create reminders table
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('medicine', 'appointment')),
  title TEXT NOT NULL,
  description TEXT,
  reminder_date DATE NOT NULL,
  reminder_time TIME NOT NULL,
  frequency TEXT CHECK (frequency IN ('once', 'daily', 'weekly', 'monthly')),
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Users can manage their own reminders
CREATE POLICY "Users can view own reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON reminders
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. Storage Bucket

Create a storage bucket for medical records:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `medical-records`
3. Set it to **Public** (files will be accessible via URLs)
4. Configure the following RLS policies:

```sql
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'medical-records' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to read their own files
CREATE POLICY "Users can read own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'medical-records' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'medical-records' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access (for emergency access)
CREATE POLICY "Public can read files" ON storage.objects
  FOR SELECT USING (bucket_id = 'medical-records');
```

## Function to Generate Health ID (Optional)

This function can be triggered when a new user signs up:

```sql
-- Create a function to auto-generate health ID
CREATE OR REPLACE FUNCTION generate_health_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'HV-' || upper(substr(md5(random()::text), 1, 8)) || '-' || upper(substr(md5(random()::text), 1, 6));
END;
$$ LANGUAGE plpgsql;
```

## Testing the Setup

After running all the SQL commands:

1. ✅ Check that all 4 tables are created
2. ✅ Verify RLS is enabled on all tables
3. ✅ Confirm storage bucket `medical-records` is created
4. ✅ Test user signup and login
5. ✅ Try uploading a medical record
6. ✅ Access emergency page via QR code

## Security Notes

⚠️ **Important**: This is a prototype setup. For production use with real medical data:

- Enable HIPAA compliance features in Supabase (Enterprise plan)
- Implement end-to-end encryption for sensitive data
- Add audit logging for all data access
- Set up proper backup and disaster recovery
- Implement session timeout and MFA
- Review and harden all RLS policies
- Use private storage buckets and signed URLs
- Add data retention and deletion policies

## Support

For issues with the database setup, check:

- Supabase documentation: https://supabase.com/docs
- Supabase Discord community
- Project logs in Supabase dashboard
