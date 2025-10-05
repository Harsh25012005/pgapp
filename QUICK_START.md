# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

Or run the batch file:
```bash
install-dependencies.bat
```

### Step 2: Start the App
```bash
npm start
```

### Step 3: Test Authentication

#### Test as Normal User
1. On splash screen, tap **"Looking for PG"**
2. Tap **"Sign Up"**
3. Fill in:
   - Name: Test User
   - Email: user@test.com
   - Password: password123
   - Confirm Password: password123
4. Check email for verification link
5. Click verification link
6. Go back and **Sign In** with same credentials

#### Test as PG Owner
1. On splash screen, tap **"PG Owner"**
2. Tap **"Sign Up"**
3. **Step 1** - Fill in:
   - Name: Test Owner
   - Email: owner@test.com
   - Password: password123
   - Confirm Password: password123
4. Tap **"Next"**
5. **Step 2** - Fill in:
   - Contact Number: 9876543210
   - PG Name: Sunshine PG
   - PG Location: Mumbai, Maharashtra
6. Tap **"Sign Up"**
7. Check email for verification link
8. Click verification link
9. Go back and **Sign In** with same credentials

## 📱 App Flow

```
Splash Screen (User Type Selection)
    ├── Normal User Path
    │   ├── Sign Up → Email Verification → Sign In → User Dashboard
    │   └── Sign In → User Dashboard
    │
    └── PG Owner Path
        ├── Multi-Step Sign Up → Email Verification → Sign In → Owner Dashboard
        └── Sign In → Owner Dashboard
```

## ✅ What's Already Configured

- ✅ Supabase client with anon key
- ✅ Database tables created
- ✅ Triggers installed
- ✅ RLS policies enabled
- ✅ Session persistence enabled
- ✅ Email authentication enabled

## 🔍 Verify Database Setup

Check Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/aaisjnexkvvukzqncrto
2. Navigate to **Table Editor**
3. Verify tables exist:
   - ✅ user_profiles
   - ✅ owner_profiles
   - ✅ pgs
   - ✅ user_metadata

## 🎨 UI Design

The app follows a **clean, minimal design**:
- White backgrounds
- Gray color palette
- Underlined inputs
- Simple rectangular buttons
- Light font weights
- Generous spacing

## 🔐 Authentication Features

- Email/password authentication
- Email verification required
- Automatic profile creation via triggers
- Persistent sessions (stays logged in)
- Secure with RLS policies
- Real-time form validation

## 📊 Database Triggers

When a user signs up:
1. Entry created in `auth.users` (Supabase)
2. Trigger `on_auth_user_created` fires
3. Based on `user_type` in metadata:
   - **User**: Creates entry in `user_profiles` + `user_metadata`
   - **Owner**: Creates entry in `owner_profiles` + `user_metadata` + `pgs`

## 🛠️ Troubleshooting

### Dependencies not installing?
```bash
npm cache clean --force
npm install
```

### App not starting?
```bash
npx expo start --clear
```

### Database issues?
Check Supabase logs:
1. Go to Supabase Dashboard
2. Navigate to **Logs** → **Postgres Logs**
3. Look for errors

### Session not persisting?
- Ensure AsyncStorage is installed
- Check `src/config/supabase.ts` has `persistSession: true`

## 📝 Next Development Tasks

1. **User Features**:
   - Browse PG listings
   - Search and filter
   - Favorite PGs
   - Book PG
   - View booking history

2. **Owner Features**:
   - Add/edit/delete PG properties
   - Upload PG images
   - Manage bookings
   - View analytics
   - Chat with users

3. **Shared Features**:
   - Profile editing
   - Settings
   - Notifications
   - Reviews and ratings

## 🎯 Current Status

**✅ READY FOR DEVELOPMENT**

All authentication infrastructure is complete:
- Database schema ✅
- Triggers and RLS ✅
- Auth context ✅
- UI screens ✅
- Session management ✅

You can now focus on building the core PG management features!

## 📞 Support

If you encounter issues:
1. Check `SETUP.md` for detailed instructions
2. Review `db.sql` for database schema
3. Check Supabase dashboard logs
4. Verify all dependencies are installed

---

**Happy Coding! 🎉**
