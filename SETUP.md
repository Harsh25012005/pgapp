# PG Management App - Setup Guide

## Prerequisites
- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)
- Supabase account with project ID: `aaisjnexkvvukzqncrto`

## Installation Steps

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

### 2. Get Supabase Anon Key
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the `anon` public key
4. Update `src/config/supabase.ts` with your anon key:
   ```typescript
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

### 3. Set Up Database Schema

#### Option A: Using Supabase MCP (Recommended)
Use the Supabase MCP server to apply the migration:
```
The db.sql file contains all necessary tables, triggers, and RLS policies.
Apply it using the Supabase MCP apply_migration tool.
```

#### Option B: Manual Setup
1. Go to your Supabase SQL Editor
2. Copy the contents of `db.sql`
3. Execute the SQL commands

### 4. Verify Database Setup
After running the migration, verify:
- ✅ Tables created: `user_profiles`, `owner_profiles`, `pgs`, `user_metadata`
- ✅ Triggers created: `on_auth_user_created` and update triggers
- ✅ RLS policies enabled on all tables
- ✅ Indexes created for performance

### 5. Configure Authentication
1. In Supabase Dashboard, go to Authentication > Providers
2. Ensure Email provider is enabled
3. Configure email templates if needed
4. Set up email confirmation (optional but recommended)

## Project Structure

```
app/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase client configuration
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication context & hooks
│   ├── screens/
│   │   ├── SplashScreen.tsx     # User type selection screen
│   │   ├── user/
│   │   │   ├── UserSignUp.tsx   # Normal user registration
│   │   │   ├── UserSignIn.tsx   # Normal user login
│   │   │   └── UserDashboard.tsx # User dashboard
│   │   └── owner/
│   │       ├── OwnerSignUp.tsx  # Owner multi-step registration
│   │       ├── OwnerSignIn.tsx  # Owner login
│   │       └── OwnerDashboard.tsx # Owner dashboard
├── db.sql                        # Database schema & migrations
├── App.tsx                       # Main app entry point
└── package.json
```

## Features

### Authentication Flow
1. **Splash Screen**: User selects account type (User or Owner)
2. **User Flow**:
   - Simple sign up with name, email, password
   - Email verification required
   - Auto-creates entry in `user_profiles` table via trigger
3. **Owner Flow**:
   - Multi-step registration:
     - Step 1: Personal info (name, email, password)
     - Step 2: PG details (contact, PG name, location)
   - Email verification required
   - Auto-creates entries in `owner_profiles` and `pgs` tables via trigger

### Security Features
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Owners can only manage their own properties
- Session persistence with AsyncStorage
- Automatic session refresh

### Database Triggers
- `handle_new_user()`: Automatically creates profile based on user type
- `handle_updated_at()`: Updates timestamp on record changes
- Automatic PG creation for owners during signup

## Running the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Testing

### Test User Account
1. Sign up as a normal user
2. Check email for verification link
3. Click verification link
4. Sign in with credentials

### Test Owner Account
1. Sign up as an owner
2. Complete both steps of registration
3. Check email for verification link
4. Click verification link
5. Sign in with credentials
6. Verify PG was created in dashboard

## Database Schema Overview

### Tables
- **user_profiles**: Normal user data
- **owner_profiles**: PG owner data with contact info
- **pgs**: PG property listings
- **user_metadata**: User type tracking

### Relationships
- `user_profiles.id` → `auth.users.id`
- `owner_profiles.id` → `auth.users.id`
- `owner_profiles.pg_ids[]` → `pgs.id[]`

## Troubleshooting

### Issue: "Invalid API Key"
- Ensure you've updated the anon key in `src/config/supabase.ts`

### Issue: "Email not confirmed"
- Check spam folder for verification email
- Resend verification email from Supabase dashboard

### Issue: "Profile not created"
- Verify triggers are installed correctly
- Check Supabase logs for errors
- Ensure RLS policies allow inserts

### Issue: "Session not persisting"
- Verify AsyncStorage is installed correctly
- Check that `persistSession: true` in Supabase config

## Next Steps

1. Implement PG browsing for users
2. Add PG management features for owners
3. Implement booking system
4. Add image upload for PG listings
5. Implement search and filters
6. Add messaging between users and owners

## Support

For issues or questions:
1. Check Supabase logs in dashboard
2. Review RLS policies
3. Verify trigger execution
4. Check network requests in dev tools
