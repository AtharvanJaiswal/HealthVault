# HealthVault — Database Setup (Updated)

This guide sets up the complete Supabase backend for HealthVault.

Includes:

- Auth-linked users table
- Emergency profiles
- Medical records
- Reminders
- Storage bucket
- Storage RLS policies
- Public emergency lookup RPC

---

# 1. Environment Variables

Create `.env`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_sb_publishable_key
```

---

# 2. Required Extension

Run in SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

# 3. Users Table

```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  health_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
ON users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON users
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
ON users
FOR INSERT
WITH CHECK (auth.uid() = id);
```

---

# 4. Emergency Profiles Table

```sql
CREATE TABLE emergency_profiles (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

 user_id UUID REFERENCES users(id)
 ON DELETE CASCADE NOT NULL,

 blood_group TEXT,
 allergies TEXT,
 medical_conditions TEXT,

 emergency_contact_name TEXT,
 emergency_contact_phone TEXT,

 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

 UNIQUE(user_id)
);

ALTER TABLE emergency_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emergency profile"
ON emergency_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency profile"
ON emergency_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency profile"
ON emergency_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

# 5. Medical Records Table

```sql
CREATE TABLE medical_records (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

 user_id UUID REFERENCES users(id)
 ON DELETE CASCADE NOT NULL,

 category TEXT NOT NULL CHECK (
  category IN (
   'prescription',
   'lab_report',
   'vaccination',
   'scan',
   'other'
  )
 ),

 title TEXT NOT NULL,
 description TEXT,

 file_url TEXT NOT NULL,
 file_name TEXT NOT NULL,
 file_type TEXT NOT NULL,

 uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

 is_visible_in_emergency BOOLEAN DEFAULT FALSE
);

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own records"
ON medical_records
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records"
ON medical_records
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records"
ON medical_records
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records"
ON medical_records
FOR DELETE
USING (auth.uid() = user_id);
```

---

# 6. Reminders Table

```sql
CREATE TABLE reminders (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

 user_id UUID REFERENCES users(id)
 ON DELETE CASCADE NOT NULL,

 type TEXT NOT NULL CHECK (
  type IN ('medicine','appointment')
 ),

 title TEXT NOT NULL,
 description TEXT,

 reminder_date DATE NOT NULL,
 reminder_time TIME NOT NULL,

 frequency TEXT CHECK (
  frequency IN (
   'once',
   'daily',
   'weekly',
   'monthly'
  )
 ),

 is_completed BOOLEAN DEFAULT FALSE,

 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

# 7. Create Storage Bucket

Go to:

Storage → New Bucket

Create:

```text
medical-records
```

Settings:

```text
Public Bucket = ON
```

---

# 8. Storage Policies

Run in SQL Editor:

```sql
CREATE POLICY "Users can upload own files"
ON storage.objects
FOR INSERT
WITH CHECK (
 bucket_id='medical-records'
 AND auth.uid()::text=(storage.foldername(name))[1]
);

CREATE POLICY "Users can read own files"
ON storage.objects
FOR SELECT
USING (
 bucket_id='medical-records'
 AND auth.uid()::text=(storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
USING (
 bucket_id='medical-records'
 AND auth.uid()::text=(storage.foldername(name))[1]
);

CREATE POLICY "Public can read files"
ON storage.objects
FOR SELECT
USING (
 bucket_id='medical-records'
);
```

---

# 9. Public Emergency Lookup RPC

Required for:

```text
/emergency/:healthId
```

Run:

```sql
CREATE OR REPLACE FUNCTION get_public_emergency_profile(
 health_id_input TEXT
)

RETURNS TABLE (
 user_id UUID,
 full_name TEXT,
 health_id TEXT,

 profile_id UUID,

 blood_group TEXT,
 allergies TEXT,
 medical_conditions TEXT,

 emergency_contact_name TEXT,
 emergency_contact_phone TEXT,

 updated_at TIMESTAMPTZ
)

LANGUAGE sql
SECURITY DEFINER
SET search_path=public

AS $$

SELECT
 u.id,
 u.full_name,
 u.health_id,

 ep.id,

 ep.blood_group,
 ep.allergies,
 ep.medical_conditions,

 ep.emergency_contact_name,
 ep.emergency_contact_phone,

 ep.updated_at

FROM users u

LEFT JOIN emergency_profiles ep
ON ep.user_id=u.id

WHERE u.health_id=health_id_input

LIMIT 1;

$$;

REVOKE ALL
ON FUNCTION get_public_emergency_profile(TEXT)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION get_public_emergency_profile(TEXT)
TO anon, authenticated;
```

---

# 10. Verification Queries

```sql
SELECT * FROM users;

SELECT * FROM emergency_profiles;

SELECT * FROM medical_records;

SELECT *
FROM get_public_emergency_profile('HV-XXXXX');
```

---

# 11. Verified Working

Successfully tested:

✅ Signup  
✅ RLS  
✅ File upload  
✅ Storage bucket  
✅ medical_records insert  
✅ Emergency lookup RPC

---

# 12. Recommended Improvement

Add server-side trigger:

auth.users
→ auto-create users row

This avoids relying only on frontend signup logic.