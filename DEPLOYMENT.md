# 🚀 Production Deployment Guide

## Overview
This guide covers deploying Nexum Chat to production while maintaining your local development environment.

---

## 📋 Pre-Deployment Checklist

### 1. **Create Production OAuth Apps**

#### **Google OAuth** (supports multiple callbacks)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or use existing OAuth app)
3. Navigate to: **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add authorized redirect URI:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```
6. Keep your existing `http://localhost:3000/api/auth/callback/google`
7. ✅ **No need for separate credentials - same Client ID/Secret works for both!**

#### **GitHub OAuth** (requires separate apps)
**Production App:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `Nexum Chat (Production)`
   - **Homepage URL**: `https://your-domain.vercel.app`
   - **Authorization callback URL**: `https://your-domain.vercel.app/api/auth/callback/github`
4. Click **"Register application"**
5. Generate a new client secret
6. ✅ **Save these credentials** (different from your dev app)

**Keep your existing Dev App:**
- Your current GitHub OAuth app with `http://localhost:3000/api/auth/callback/github`
- Don't delete or modify it!

---

## 🗄️ Understanding Separate Databases

### **IMPORTANT**: Dev and Production are COMPLETELY SEPARATE

| Aspect | Development | Production |
|--------|-------------|------------|
| **Database** | Dev Convex DB | New empty Prod DB |
| **Users** | Your dev users | None (fresh start) |
| **Posts** | Your dev posts | None |
| **Messages** | Your dev messages | None |
| **Admin Role** | You're admin in dev | No admin exists yet |

**⚠️ This means:**
- You'll need to sign up again in production
- You won't automatically be admin in production
- All production data starts fresh

---

## 🔧 Step-by-Step Deployment

### **Step 1: Generate a Secret Admin Key**

Generate a secure random string for your admin setup:

```bash
# Generate a secure random string (32 characters)
openssl rand -base64 32

# Or use this online generator: https://randomkeygen.com/
```

**Save this secret key** - you'll use it ONCE to make yourself admin in production.

---

### **Step 2: Deploy Convex to Production**

```bash
bunx convex deploy
```

**Output will show:**
```
Deployment URL: https://your-prod-123.convex.cloud
Site URL: https://your-prod-123.convex.site
Deployment name: prod:your-prod-123
```

**✅ Save these URLs** - you'll need them for Vercel.

---

### **Step 3: Configure Convex Production Environment**

1. Go to [Convex Dashboard](https://dashboard.convex.dev/)
2. Select your project
3. **Switch to Production environment** (dropdown at top)
4. Go to **Settings** → **Environment Variables**
5. Add these variables:

```bash
# Required for authentication
CONVEX_SITE_URL=https://your-prod-123.convex.site
SITE_URL=https://your-domain.vercel.app

# Production GitHub OAuth (NEW credentials)
GITHUB_CLIENT_ID=<your-production-github-client-id>
GITHUB_CLIENT_SECRET=<your-production-github-client-secret>

# Google OAuth (SAME as dev - works for both!)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Admin setup secret (use the random string from Step 1)
ADMIN_SETUP_SECRET=<your-generated-secret-key>
```

**💡 Important:** Keep your **Development** environment variables unchanged!

---

### **Step 4: Push to GitHub**

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

---

### **Step 5: Deploy to Vercel**

#### **Option A: Vercel Dashboard (Easier)**

1. Go to [Vercel](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `bun run build` (or leave default)

4. **Add Environment Variables**:
   ```bash
   CONVEX_DEPLOYMENT=prod:your-prod-123
   NEXT_PUBLIC_CONVEX_URL=https://your-prod-123.convex.cloud
   NEXT_PUBLIC_CONVEX_SITE_URL=https://your-prod-123.convex.site
   
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=devdlvrp9
   NEXT_PUBLIC_CLOUDINARY_API_KEY=296246968686968
   CLOUDINARY_API_SECRET=e5wcR9wN25oaowSF0N5KROsaltM
   ```

5. Click **Deploy**

#### **Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
# Add environment variables when prompted
```

---

### **Step 6: Update Production Site URL**

After Vercel deployment completes, you'll get your production URL (e.g., `https://nexum-chat.vercel.app`).

**Update Convex:**
1. Go back to [Convex Dashboard](https://dashboard.convex.dev/)
2. **Production environment** → **Settings** → **Environment Variables**
3. Update `SITE_URL` to your actual Vercel URL:
   ```bash
   SITE_URL=https://nexum-chat.vercel.app
   ```

---

### **Step 7: Make Yourself Admin in Production** ⭐

**⚠️ CRITICAL STEP - Don't skip this!**

1. **Visit your production site** (e.g., `https://nexum-chat.vercel.app`)

2. **Sign up/Sign in** with Google or GitHub
   - Use the account you want to be admin
   - Complete the username setup

3. **Navigate to admin setup page**:
   ```
   https://nexum-chat.vercel.app/admin-setup
   ```

4. **Enter your secret key** (the `ADMIN_SETUP_SECRET` from Step 3)

5. **Click "Initialize Admin"**

6. ✅ **You're now admin in production!**

7. **Test it**: Visit `https://nexum-chat.vercel.app/home/admin`
   - You should see the admin dashboard

8. **🔒 SECURITY**: After successful setup, delete the admin-setup page:
   ```bash
   rm src/app/admin-setup/page.tsx
   git add .
   git commit -m "Remove admin setup page"
   git push origin main
   ```

   Or restrict access by adding authentication check to the page.

---

## 🔄 Continuing Local Development After Deployment

### **Your local environment remains unchanged!**

```bash
# Terminal 1: Start Convex dev (uses DEV database)
bunx convex dev

# Terminal 2: Start Next.js dev server
bun dev

# Visit http://localhost:3000
# - Uses dev Convex database
# - Uses dev GitHub OAuth app
# - Uses same Google OAuth app (multiple callbacks)
# - You're still admin in dev
# - All your dev data is intact
```

### **Your environments:**

| Environment | URL | Database | OAuth Apps | Admin Account |
|-------------|-----|----------|------------|---------------|
| **Dev** | localhost:3000 | Dev DB (unchanged) | Dev GitHub + Google | Your dev admin ✅ |
| **Prod** | nexum-chat.vercel.app | Prod DB (new) | Prod GitHub + Google | Your new prod admin ✅ |

**They don't interfere with each other!**

---

## 🔄 Deployment Workflow Going Forward

### **When you make changes:**

```bash
# 1. Develop locally
bunx convex dev    # Terminal 1
bun dev           # Terminal 2

# 2. Test thoroughly in dev

# 3. Commit changes
git add .
git commit -m "Add new feature"
git push origin main

# 4. Deploy Convex backend changes (if schema/functions changed)
bunx convex deploy

# 5. Vercel auto-deploys from GitHub push
# (Or manually trigger in Vercel dashboard)
```

---

## 📊 Managing Two Accounts

### **Your Admin Accounts:**

**Development Account:**
- Email: (whatever you used in dev)
- Username: (your dev username)
- Role: Admin
- Access: localhost:3000

**Production Account:**
- Email: (can be same or different)
- Username: (can be same - separate databases!)
- Role: Admin (after setup)
- Access: nexum-chat.vercel.app

**💡 Tip**: You can use the same email/username for both since they're in separate databases!

---

## 🔒 Security Best Practices

### **After Initial Setup:**

1. **Remove or protect admin-setup page**:
   ```bash
   # Option 1: Delete it
   rm src/app/admin-setup/page.tsx
   
   # Option 2: Add authentication check
   # Only allow access if no admin exists
   ```

2. **Rotate admin secret** (optional):
   - Remove `ADMIN_SETUP_SECRET` from Convex production env
   - Or change it to prevent future use

3. **Use admin dashboard** to grant additional admin/moderator roles:
   - Don't use the setup page again
   - Use the `grantRole` mutation from admin dashboard

---

## 🐛 Troubleshooting

### **"Not authenticated" when signing in**
- Check OAuth callback URLs match your domain
- Verify Convex environment variables are correct
- Check `SITE_URL` matches your actual URL

### **"Invalid secret key" on admin setup**
- Verify `ADMIN_SETUP_SECRET` in Convex dashboard
- Make sure you're in Production environment
- Check for typos in the secret

### **Can't access admin dashboard in production**
- Complete admin setup first
- Check you're signed in with the account you made admin
- Visit `/admin-setup` to initialize

### **Changes not appearing in production**
- Did you run `bunx convex deploy`?
- Did Vercel redeploy?
- Check Vercel deployment logs
- Clear browser cache

---

## 📞 Quick Reference

### **Important URLs:**

```bash
# Convex Dashboard
https://dashboard.convex.dev/

# Your Dev Site
http://localhost:3000

# Your Production Site
https://your-domain.vercel.app

# Admin Setup (first-time only)
https://your-domain.vercel.app/admin-setup

# Admin Dashboard
https://your-domain.vercel.app/home/admin
```

### **Key Commands:**

```bash
# Local development
bunx convex dev
bun dev

# Deploy to production
bunx convex deploy
git push origin main  # Auto-deploys Vercel
```

---

## ✅ Post-Deployment Checklist

- [ ] Production Convex deployed
- [ ] Production OAuth apps created
- [ ] Convex production env variables set
- [ ] Vercel deployed successfully
- [ ] Signed up in production
- [ ] Admin role granted via admin-setup page
- [ ] Admin dashboard accessible
- [ ] Admin-setup page removed/secured
- [ ] Tested creating posts in production
- [ ] Tested messaging in production
- [ ] Local dev still working

---

**🎉 You're all set! Your production app is live and your dev environment is intact!**
