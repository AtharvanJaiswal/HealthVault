# HealthVault — Digital Health ID & Medical Record Management System

HealthVault is a secure digital health management system for storing medical records, generating emergency-access QR codes, and managing health reminders.

Built with:

- React + TypeScript + Vite
- Supabase Auth
- PostgreSQL
- Supabase Storage
- Row Level Security (RLS)

---

# Features

## User Authentication
- Email/password login
- Supabase authentication
- Persistent sessions
- Automatic Health ID generation

---

## Medical Records
Upload and manage:

- Prescriptions
- Lab Reports
- Vaccination Records
- Scan Reports
- Other Medical Documents

Capabilities:

- File upload
- View records
- Download records
- Delete records
- Emergency visibility toggle

Files are stored in:

```text
medical-records
```

Supabase Storage bucket.

---

## Emergency QR Card
Generate a QR code that exposes only emergency-safe data:

- Blood Group
- Allergies
- Medical Conditions
- Emergency Contact

Powered by secure RPC:

```sql
get_public_emergency_profile()
```

Route:

```text
/emergency/:healthId
```

---

## Reminders
Supports:

- Medicine reminders
- Appointment reminders
- Scheduling
- Frequency rules
- Completion tracking

---

# Tech Stack

## Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- shadcn/ui

## Backend
- Supabase Auth
- PostgreSQL
- Supabase Storage
- Row Level Security

---

# Project Structure

```text
src/
 ├── app/
 ├── styles/
 ├── main.tsx

DATABASE_SETUP.md
README.md
```

---

# Setup

## Install

```bash
npm install
```

---

## Configure Environment

Create:

```text
.env
```

Add:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_sb_publishable_key
```

---

## Configure Database

Follow:

```text
DATABASE_SETUP.md
```

Includes:

- Tables
- Storage bucket
- RLS policies
- Emergency RPC
- Verification queries

---

## Run App

```bash
npm run dev
```

---

# Verified Working

Successfully tested:

## Authentication
✅ User signup  
✅ User login  
✅ Session persistence

---

## Database
✅ users table working  
✅ emergency_profiles working  
✅ medical_records working  
✅ reminders schema created

---

## Storage
✅ medical-records bucket created  
✅ Storage upload working  
✅ Storage policies working

---

## Upload Flow
Verified full flow:

```text
Upload file
→ Save file in Storage
→ Insert metadata in medical_records
→ Render uploaded record in UI
```

Working.

---

## Emergency Access
Verified:

```text
QR lookup RPC works
```

via:

```sql
get_public_emergency_profile()
```

---

# Database Schema

Tables:

```text
users
emergency_profiles
medical_records
reminders
```

Storage:

```text
medical-records
```

---

# Verification Queries

```sql
SELECT * FROM users;

SELECT * FROM emergency_profiles;

SELECT * FROM medical_records;
```

Test emergency lookup:

```sql
SELECT *
FROM get_public_emergency_profile('HV-XXXXX');
```

---

# Common Errors

## Bucket not found

Cause:

Storage bucket missing.

Fix:

Create:

```text
medical-records
```

---

## New row violates row-level security policy

Cause:

Storage policies missing.

Fix:

Run storage policies in DATABASE_SETUP.md

---

## Could not find public.medical_records

Cause:

Table not created.

Fix:

Run medical_records schema SQL.

---

## npm not recognized

Cause:

Node.js missing.

Fix:

Install Node.js LTS.

---

# Security

Implemented:

- Row Level Security
- Storage access policies
- Security-definer RPC
- Restricted emergency data exposure

Recommended next improvements:

- auth.users trigger → auto-create users row
- Signed URLs for private files
- MFA
- Audit logging
- PHI encryption
- HIPAA hardening

---

# Build

```bash
npm run build
```

---

# Current Status

```text
Frontend Connected        YES
Supabase Auth Working     YES
Database Working          YES
Storage Working           YES
Medical Upload Working    YES
Emergency QR Working      YES
```

---

# License

Educational / prototype use.

Do not use with real PHI in production without compliance review.