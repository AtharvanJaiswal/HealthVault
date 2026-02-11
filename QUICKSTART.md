# HealthVault Quick Start Guide

Get HealthVault up and running in 5 minutes!

## Step 1: Supabase Setup (3 minutes)

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: HealthVault
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait 2-3 minutes

### Get Your API Keys

1. In your project dashboard, click "Settings" (gear icon)
2. Click "API" in the left sidebar
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Set Up Environment Variables

Create a file named `.env` in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 2: Database Setup (2 minutes)

### Run SQL Schema

1. In Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy and paste this SQL code:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  health_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete own data" ON users FOR DELETE USING (auth.uid() = id);

-- 2. Emergency Profiles Table
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

ALTER TABLE emergency_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emergency profile" ON emergency_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own emergency profile" ON emergency_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emergency profile" ON emergency_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read emergency profiles" ON emergency_profiles FOR SELECT USING (true);

-- 3. Medical Records Table
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

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own records" ON medical_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON medical_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records" ON medical_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON medical_records FOR DELETE USING (auth.uid() = user_id);

-- 4. Reminders Table
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

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminders" ON reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reminders" ON reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders" ON reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders" ON reminders FOR DELETE USING (auth.uid() = user_id);
```

4. Click "Run" button (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned" message

### Create Storage Bucket

1. Click "Storage" in the left sidebar
2. Click "Create a new bucket"
3. Fill in:
   - **Name**: `medical-records`
   - **Public bucket**: Toggle ON (files will be accessible via URLs)
4. Click "Create bucket"

### Set Storage Policies

1. Click on the `medical-records` bucket
2. Click "Policies" tab
3. Click "New Policy"
4. Copy and paste:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'medical-records' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to read own files
CREATE POLICY "Users can read own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'medical-records' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'medical-records' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read
CREATE POLICY "Public can read files" ON storage.objects
  FOR SELECT USING (bucket_id = 'medical-records');
```

5. Save the policies

## Step 3: Run the App

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Step 4: Test the App

### Create an Account

1. Click "Get Started" or "Sign Up"
2. Fill in your details:
   - Full name
   - Email address
   - Phone (optional)
   - Password (min 6 characters)
3. Click "Create Health ID"
4. You'll be logged in automatically and see your unique Health ID!

### Upload a Medical Record

1. Go to "Medical Records" from the sidebar
2. Click "Upload Record"
3. Fill in:
   - Category (e.g., Lab Report)
   - Title (e.g., "Blood Test Results")
   - Description (optional)
   - Upload a file (PDF or image)
4. Click "Upload"

### Set Up Emergency Card

1. Go to "Emergency Card" from the sidebar
2. Click "Edit"
3. Fill in:
   - Blood group (e.g., A+)
   - Allergies (e.g., "Penicillin")
   - Medical conditions (e.g., "Diabetes Type 2")
   - Emergency contact name and phone
4. Click "Save Changes"
5. Download the QR code by clicking "Download QR Code"

### Create a Reminder

1. Go to "Reminders" from the sidebar
2. Click "Add Reminder"
3. Fill in:
   - Type: Medicine or Appointment
   - Title (e.g., "Take Blood Pressure Medication")
   - Date and time
   - Frequency (once, daily, weekly, monthly)
4. Click "Create Reminder"

### Test Emergency QR Access

1. Open the downloaded QR code image
2. Scan it with your phone's camera (or use a QR code scanner app)
3. It will open a public URL showing your emergency information
4. Anyone can access this without login!

## ✅ You're All Set!

Your HealthVault is now fully functional! Here's what you can do:

- ✅ Upload and organize medical records
- ✅ Generate emergency QR codes
- ✅ Set medicine and appointment reminders
- ✅ Manage your health profile
- ✅ Access everything from any device

## 🆘 Troubleshooting

### "Invalid API Key" Error

- Double-check your `.env` file has the correct URL and key
- Make sure there are no extra spaces
- Restart the dev server after changing `.env`

### Database Connection Failed

- Verify your Supabase project is active
- Check that all SQL queries ran successfully
- Look for errors in the SQL Editor

### File Upload Fails

- Ensure the `medical-records` bucket exists
- Verify storage policies are set correctly
- Check file size is under 10MB

### Can't Login After Signup

- Check Supabase Auth settings: Settings → Authentication → Email Auth (should be enabled)
- Verify users table was created successfully
- Check browser console for error messages

## 📚 Next Steps

- Read the full [README.md](./README.md) for more details
- Check [DATABASE_SETUP.md](./DATABASE_SETUP.md) for advanced configuration
- Customize the theme in `/src/styles/theme.css`
- Add your logo to the welcome page

## 🔒 Security Reminder

This is a **prototype**. For production with real medical data:
- Enable HIPAA compliance in Supabase
- Implement end-to-end encryption
- Add audit logging
- Set up proper backups
- Conduct security audits

---

Need help? Check the [Supabase Documentation](https://supabase.com/docs) or the project README!
