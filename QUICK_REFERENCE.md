# HealthVault - Quick Reference

## 🚀 Getting Started in 3 Steps

### 1. Supabase Setup (2 min)
```bash
# Create project at supabase.com
# Copy URL and anon key
# Create .env file:
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### 2. Database Setup (2 min)
```bash
# Run SQL from DATABASE_SETUP.md in Supabase SQL Editor
# Create 4 tables: users, emergency_profiles, medical_records, reminders
# Create storage bucket: medical-records
```

### 3. Run App (1 min)
```bash
npm install
npm run dev
# Open http://localhost:5173
```

---

## 📂 File Structure Quick Reference

```
src/app/
├── pages/              # 9 pages
│   ├── welcome-page.tsx
│   ├── login-page.tsx
│   ├── signup-page.tsx
│   ├── dashboard-page.tsx
│   ├── medical-records-page.tsx
│   ├── emergency-card-page.tsx
│   ├── reminders-page.tsx
│   ├── settings-page.tsx
│   └── public-emergency-view.tsx
├── components/
│   ├── layout.tsx      # App shell with nav
│   └── ui/             # 40+ Radix UI components
├── context/
│   └── auth-context.tsx
├── lib/
│   └── supabase.ts
├── routes.tsx
└── App.tsx
```

---

## 🎯 Key Features Implemented

✅ User signup/login with unique Health ID  
✅ Medical record upload (PDF/images)  
✅ QR code emergency access  
✅ Medicine & appointment reminders  
✅ Privacy controls  
✅ Mobile responsive  
✅ Secure with RLS  

---

## 🗄️ Database Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| users | User profiles with Health ID | ✅ Private |
| emergency_profiles | QR-accessible emergency info | ✅ Public read |
| medical_records | Uploaded documents | ✅ Private |
| reminders | Medicine/appointments | ✅ Private |

---

## 🔑 Key Environment Variables

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

---

## 🛣️ Routes

| Path | Component | Auth Required |
|------|-----------|---------------|
| / | Welcome Page | No |
| /login | Login | No |
| /signup | Signup | No |
| /emergency/:healthId | Public Emergency | No |
| /app | Dashboard | Yes |
| /app/records | Medical Records | Yes |
| /app/emergency | Emergency Card | Yes |
| /app/reminders | Reminders | Yes |
| /app/settings | Settings | Yes |

---

## 🎨 UI Components Used

**Forms**: Input, Textarea, Label, Select, Switch, Checkbox  
**Layout**: Card, Tabs, Dialog, Sheet  
**Feedback**: Toast (Sonner), Alert  
**Navigation**: Button, Link  
**Special**: QRCodeSVG  

---

## 📱 Mobile Navigation

- Desktop: Sidebar navigation
- Mobile: Hamburger menu (Sheet component)
- Responsive breakpoints: sm(640px), md(768px), lg(1024px)

---

## 🔒 Security Features

✅ Row Level Security on all tables  
✅ User data isolation  
✅ Secure file uploads  
✅ Environment variables for secrets  
✅ HTTPS required in production  
✅ Public emergency data only  

---

## 🚨 Emergency QR Flow

1. User fills emergency profile
2. QR code generated with URL: `/emergency/{healthId}`
3. User downloads & prints QR
4. Anyone scans → sees emergency info only
5. No login required for emergency access

---

## 💊 Reminder Types

**Medicine**:
- Title: "Take Blood Pressure Med"
- Time: 8:00 AM
- Frequency: Daily

**Appointment**:
- Title: "Dr. Smith Checkup"
- Date: Feb 15, 2026
- Time: 10:30 AM

---

## 📋 Medical Record Categories

1. **Prescription** - Medicine prescriptions
2. **Lab Report** - Blood tests, urine tests, etc.
3. **Vaccination** - Immunization records
4. **Scan** - X-ray, MRI, CT, ultrasound
5. **Other** - Any other medical document

---

## 🧪 Testing Checklist

After deployment, test:

- [ ] Sign up creates account
- [ ] Login works
- [ ] Upload medical record
- [ ] View uploaded file
- [ ] Generate QR code
- [ ] Scan QR code (different device)
- [ ] Create reminder
- [ ] Update profile
- [ ] Delete account

---

## 🆘 Common Issues & Fixes

### "Invalid API Key"
→ Check `.env` file, restart dev server

### Can't Upload File
→ Check storage bucket exists, verify policies

### QR Code Not Working
→ Ensure emergency profile filled, regenerate QR

### Database Error
→ Verify all tables created, check RLS policies

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main documentation |
| QUICKSTART.md | 5-minute setup guide |
| DATABASE_SETUP.md | Complete SQL schema |
| USER_GUIDE.md | End-user instructions |
| FEATURES.md | Feature checklist |
| DEPLOYMENT.md | Production deployment |
| PROJECT_OVERVIEW.md | Technical overview |
| THIS FILE | Quick reference |

---

## 🔗 Important URLs

**Development**: http://localhost:5173  
**Supabase Dashboard**: https://app.supabase.com  
**Vercel Deployment**: https://vercel.com/new  

---

## 📦 Key Dependencies

```json
{
  "react": "18.3.1",
  "react-router": "7.x",
  "@supabase/supabase-js": "latest",
  "qrcode.react": "latest",
  "lucide-react": "latest",
  "tailwindcss": "4.x"
}
```

---

## 🎯 Quick Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install

# Update dependencies
npm update

# Check for security issues
npm audit
```

---

## ⚡ Quick Tips

1. **Health ID**: Generated automatically, format: `HV-XXXXXX-XXXX`
2. **File Size Limit**: 10MB for medical records
3. **Supported Formats**: PDF, JPG, PNG
4. **QR Code**: Download as PNG, print for wallet
5. **Emergency Access**: No login required for QR scan
6. **Privacy**: Control what's visible in emergencies
7. **Reminders**: Set frequency for recurring events
8. **Mobile**: Fully responsive, works on all devices

---

## 🎨 Color Codes

```
Primary Blue: #2563eb
Success Green: #10b981
Warning Yellow: #f59e0b
Error Red: #ef4444
Gray: #64748b
Light BG: #f8fafc
```

---

## 📱 Screen Sizes

| Size | Breakpoint | Layout |
|------|------------|--------|
| Mobile | < 640px | Stack, hamburger menu |
| Tablet | 640-1024px | 2 columns, hamburger menu |
| Desktop | > 1024px | Sidebar, 3-4 columns |

---

## 🔐 RLS Policy Pattern

All tables follow this pattern:

```sql
-- Users can only see their own data
CREATE POLICY "policy_name" ON table_name
  FOR SELECT 
  USING (auth.uid() = user_id);
```

Exception: `emergency_profiles` allows public SELECT

---

## 🌟 Feature Status

| Feature | Status |
|---------|--------|
| Authentication | ✅ Done |
| Medical Records | ✅ Done |
| Emergency QR | ✅ Done |
| Reminders | ✅ Done |
| Settings | ✅ Done |
| Push Notifications | ⏳ Future |
| Dark Mode | ⏳ Future |
| PWA | ⏳ Future |
| AI Insights | ⏳ Future |

---

## 📞 Need More Info?

- Detailed setup: `QUICKSTART.md`
- Database schema: `DATABASE_SETUP.md`
- User instructions: `USER_GUIDE.md`
- All features: `FEATURES.md`
- Technical details: `PROJECT_OVERVIEW.md`
- Deployment: `DEPLOYMENT.md`

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: ✅ Production Ready (Prototype)

---

🏥 Built for better healthcare accessibility
