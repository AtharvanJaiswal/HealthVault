# HealthVault - Digital Health ID & Medical Record Management System

A secure, mobile-first healthcare application designed to help individuals safely store, organize, and access their medical data anytime, especially during emergencies.

![HealthVault](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop)

## 🎯 Core Objectives

- **Centralize Medical Records**: Store all your health documents in one secure place
- **Emergency Access**: Provide instant access to critical health information during emergencies via QR code
- **Privacy First**: User-controlled access to sensitive health data with encryption
- **Smart Organization**: Categorize and search medical records efficiently

## ✨ Key Features

### 1. User Authentication
- Secure login and signup with email/password
- Automatic generation of unique Health ID for every user
- Session management with Supabase Auth

### 2. Medical Record Management
- Upload and store:
  - 📋 Prescriptions
  - 🧪 Lab reports
  - 💉 Vaccination records
  - 🔬 Scan reports (X-ray, MRI, CT, etc.)
  - 📄 Other medical documents
- Categorized and searchable records
- View, download, and delete records
- Control which records are visible in emergency situations

### 3. Emergency Card (QR-Based Access)
- Generate a QR code linked to your emergency profile
- QR scan displays only critical information:
  - Blood group
  - Allergies
  - Existing medical conditions
  - Emergency contact details
- Read-only, privacy-restricted public access
- Downloadable QR code for printing

### 4. Reminders & Appointments
- Medicine reminders with:
  - Dose information
  - Time scheduling
  - Frequency (once, daily, weekly, monthly)
- Doctor appointment reminders
- Mark reminders as complete
- Overdue reminder alerts

### 5. Privacy & Security
- User controls what data is private vs emergency-visible
- Row Level Security (RLS) on all database tables
- Secure file storage with access controls
- No medical diagnosis or treatment suggestions

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **QR Codes**: qrcode.react
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- A Supabase account and project

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd healthvault
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database

Follow the instructions in [DATABASE_SETUP.md](./DATABASE_SETUP.md) to:
- Create all required tables
- Set up Row Level Security policies
- Configure storage buckets
- Enable necessary extensions

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 📱 Application Flow

```
1. Landing Page → Sign Up/Login
2. Sign Up → Health ID Generated
3. Dashboard → Overview of records and reminders
4. Medical Records → Upload and manage documents
5. Emergency Card → View/download QR code
6. Reminders → Schedule medicine/appointments
7. Settings → Manage profile and privacy
```

## 🔒 Security & Privacy Notice

⚠️ **IMPORTANT**: This is a **prototype application** for demonstration and educational purposes.

For production use with real medical data, you **MUST**:

- ✅ Enable HIPAA compliance features (Supabase Enterprise)
- ✅ Implement end-to-end encryption for PHI
- ✅ Add comprehensive audit logging
- ✅ Set up proper backup and disaster recovery
- ✅ Implement multi-factor authentication (MFA)
- ✅ Use signed URLs for sensitive file access
- ✅ Conduct security audits and penetration testing
- ✅ Ensure data residency compliance
- ✅ Add session timeout and activity monitoring
- ✅ Implement proper data retention policies

**Figma Make is not designed for collecting or storing sensitive PII or PHI.**

## 📊 Database Schema

### Tables

1. **users** - User profiles with Health ID
2. **emergency_profiles** - Emergency health information (publicly readable)
3. **medical_records** - Uploaded medical documents
4. **reminders** - Medicine and appointment reminders

### Storage

- **medical-records** bucket - Stores uploaded files (PDF, images)

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete schema.

## 🎨 Design Principles

- **Mobile-First**: Responsive design optimized for all devices
- **Accessibility**: WCAG compliant UI components
- **Clean UI**: Minimal, professional healthcare aesthetic
- **Fast Load**: Optimized bundle size and lazy loading
- **Intuitive Navigation**: Clear information hierarchy

## 🔮 Future Enhancements

- [ ] Biometric authentication
- [ ] OTP-based login
- [ ] Online pharmacy integration
- [ ] Hospital bed availability tracking
- [ ] Ambulance service integration
- [ ] Family health management
- [ ] AI-powered health insights
- [ ] Risk prediction analytics
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Push notifications

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📦 Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🤝 Contributing

This is a prototype project. For production use:

1. Review and enhance security measures
2. Add comprehensive error handling
3. Implement proper logging
4. Add unit and integration tests
5. Set up CI/CD pipeline
6. Configure monitoring and alerting

## 📄 License

This project is for educational and demonstration purposes.

## 🆘 Support

For database setup issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)

For React and UI issues:
- [React Documentation](https://react.dev)
- [Radix UI Documentation](https://www.radix-ui.com)

## ⚖️ Legal Disclaimer

This application is a prototype and should not be used for actual medical record storage without proper HIPAA compliance, security audits, and legal review. The creators assume no liability for any misuse or data breaches.

---

Built with ❤️ for better healthcare accessibility
