# HealthVault Deployment Guide

This guide covers deploying HealthVault to production environments.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment for React applications.

#### Steps:

1. **Prepare your project:**
   ```bash
   # Ensure all dependencies are installed
   npm install
   
   # Test the build locally
   npm run build
   ```

2. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/healthvault.git
   git push -u origin main
   ```

3. **Deploy on Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

4. **Configure custom domain (optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Netlify

Another excellent option for static sites.

#### Steps:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

3. **Or use Netlify UI:**
   - Visit [netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder
   - Or connect your GitHub repository

4. **Add environment variables:**
   - Go to Site settings → Environment variables
   - Add your Supabase credentials

### Option 3: AWS Amplify

For AWS users.

#### Steps:

1. **Install AWS Amplify CLI:**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize Amplify:**
   ```bash
   amplify init
   amplify add hosting
   amplify publish
   ```

3. **Configure environment variables** in the Amplify Console

### Option 4: Self-Hosted (Docker)

For complete control.

#### Create Dockerfile:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Create nginx.conf:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://your-project.supabase.co;
    }
}
```

#### Build and run:

```bash
docker build -t healthvault .
docker run -p 80:80 healthvault
```

## 🔧 Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console.errors in production code
- [ ] All features tested
- [ ] Mobile responsive design verified
- [ ] All forms validated properly
- [ ] Error boundaries implemented

### Security
- [ ] Environment variables properly configured
- [ ] No hardcoded secrets in code
- [ ] `.env` file added to `.gitignore`
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Rate limiting on APIs

### Performance
- [ ] Build size optimized
- [ ] Images compressed
- [ ] Lazy loading implemented
- [ ] Code splitting configured
- [ ] Lighthouse score > 90

### Supabase Configuration
- [ ] All database tables created
- [ ] RLS policies enabled and tested
- [ ] Storage buckets configured
- [ ] Storage policies set up
- [ ] Auth settings configured
- [ ] Email templates customized (optional)

### Monitoring & Analytics
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics setup (optional)
- [ ] Uptime monitoring configured
- [ ] Log aggregation setup

## 🌍 Environment Variables

### Production Environment

Create a `.env.production` file:

```env
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Environment Variable Security

✅ **DO:**
- Use environment-specific variables
- Rotate keys regularly
- Use Supabase's anon key (public)
- Never commit `.env` files

❌ **DON'T:**
- Use service role keys in frontend
- Commit secrets to git
- Share keys publicly
- Use same keys for dev and prod

## 📊 Post-Deployment

### 1. Verify Core Functionality

Test these critical paths:

```
✅ User signup works
✅ User login works
✅ Medical record upload works
✅ Files are accessible
✅ Emergency QR loads correctly
✅ Reminders can be created
✅ Settings can be updated
```

### 2. Test Emergency QR Access

1. Create a test account
2. Set up emergency profile
3. Download QR code
4. Scan QR code from different device
5. Verify information loads correctly

### 3. Performance Testing

```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

Target scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80

### 4. Security Headers

Verify these headers are set:

```
Content-Security-Policy
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy
```

### 5. SSL Certificate

Ensure HTTPS is enabled:
```bash
curl -I https://your-domain.com
```

Look for:
```
HTTP/2 200
strict-transport-security: max-age=63072000
```

## 🔍 Monitoring Setup

### Error Tracking with Sentry

1. **Install Sentry:**
   ```bash
   npm install @sentry/react
   ```

2. **Configure in App.tsx:**
   ```typescript
   import * as Sentry from "@sentry/react";

   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: "production",
   });
   ```

### Uptime Monitoring

Use services like:
- UptimeRobot (free tier available)
- Pingdom
- StatusCake

Check:
- Homepage loads
- API responds
- Database accessible

## 🚨 Incident Response

### If Site Goes Down:

1. **Check status page:**
   - Vercel/Netlify status
   - Supabase status

2. **Review logs:**
   - Check deployment logs
   - Check Supabase logs
   - Check error tracking

3. **Common issues:**
   - Environment variables not set
   - Database migrations failed
   - Storage bucket misconfigured
   - API rate limits exceeded

### Rollback Procedure:

**Vercel/Netlify:**
- Go to deployments
- Click "Promote to Production" on previous version

**Docker:**
```bash
docker pull healthvault:previous-tag
docker run -p 80:80 healthvault:previous-tag
```

## 📈 Scaling Considerations

### Database

As user base grows:
- Monitor query performance
- Add indexes for common queries
- Consider read replicas
- Implement database backups

### Storage

- Set up CDN for medical records
- Implement file compression
- Set retention policies
- Monitor storage costs

### Authentication

- Implement rate limiting
- Add CAPTCHA for signup
- Enable email verification
- Consider adding MFA

## 🔐 Production Security Hardening

### 1. Enable RLS Policies

Verify all tables have RLS enabled:

```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = false;
```

Should return no results.

### 2. Review Supabase Policies

```sql
SELECT * FROM pg_policies;
```

Ensure policies are restrictive and correct.

### 3. Configure CORS

In Supabase dashboard:
- Authentication → URL Configuration
- Add your production domain

### 4. Set Up Audit Logging

Enable audit logs in Supabase:
- Settings → Logs
- Enable database audit logs
- Set retention period

### 5. Regular Security Updates

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## 📱 PWA Configuration (Optional)

To make HealthVault work offline:

1. **Add service worker:**
   ```bash
   npm install vite-plugin-pwa
   ```

2. **Configure in vite.config.ts:**
   ```typescript
   import { VitePWA } from 'vite-plugin-pwa';

   export default {
     plugins: [
       VitePWA({
         registerType: 'autoUpdate',
         manifest: {
           name: 'HealthVault',
           short_name: 'HealthVault',
           description: 'Digital Health Record Management',
           theme_color: '#2563eb',
           icons: [
             {
               src: 'icon-192.png',
               sizes: '192x192',
               type: 'image/png'
             }
           ]
         }
       })
     ]
   };
   ```

## 🎯 Go-Live Checklist

Final checks before announcing launch:

- [ ] All features working in production
- [ ] Test accounts created and verified
- [ ] Error tracking configured
- [ ] Monitoring alerts set up
- [ ] Backup strategy implemented
- [ ] Security headers verified
- [ ] Performance benchmarks met
- [ ] Mobile testing completed
- [ ] Browser compatibility checked
- [ ] Documentation updated
- [ ] Support email/system ready
- [ ] Privacy policy displayed
- [ ] Terms of service displayed
- [ ] GDPR compliance (if EU users)
- [ ] HIPAA compliance (if US healthcare)

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Daily:**
- Monitor error logs
- Check uptime status
- Review user signup rate

**Weekly:**
- Review security alerts
- Check storage usage
- Analyze performance metrics

**Monthly:**
- Update dependencies
- Review and optimize database
- Analyze user feedback
- Plan new features

### Contact Points

For deployment issues:
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **Community**: Discord/GitHub Discussions

---

## 🎉 Congratulations!

Your HealthVault application is now deployed and ready to help users manage their health records securely.

**Next Steps:**
1. Monitor the application closely for the first week
2. Gather user feedback
3. Plan iterative improvements
4. Keep security updated
5. Scale as needed

Good luck! 🚀
