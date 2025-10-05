# Testing Guide - PG Management App

## 🧪 Complete Testing Checklist

### Pre-Testing Setup
- [ ] Dependencies installed
- [ ] App starts without errors
- [ ] Supabase connection working

---

## 1️⃣ Normal User Flow Testing

### Test Case 1.1: User Sign Up
**Steps:**
1. Launch app
2. On splash screen, tap **"Looking for PG"** (🏠)
3. Tap **"Sign Up"** link at bottom
4. Fill in form:
   - Name: `John Doe`
   - Email: `john.doe@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
5. Tap **"Sign Up"** button

**Expected Results:**
- ✅ Alert shows "Verification Email Sent"
- ✅ Email received with verification link
- ✅ Redirected to Sign In screen

**Database Verification:**
```sql
-- Check user was created
SELECT * FROM auth.users WHERE email = 'john.doe@test.com';

-- Check user_profiles entry (after email verification)
SELECT * FROM user_profiles WHERE email = 'john.doe@test.com';

-- Check user_metadata
SELECT * FROM user_metadata WHERE user_type = 'user';
```

### Test Case 1.2: Email Verification
**Steps:**
1. Open email inbox
2. Find verification email from Supabase
3. Click verification link

**Expected Results:**
- ✅ Browser opens with success message
- ✅ Email confirmed in Supabase

### Test Case 1.3: User Sign In
**Steps:**
1. Return to app
2. On Sign In screen, enter:
   - Email: `john.doe@test.com`
   - Password: `password123`
3. Tap **"Sign In"** button

**Expected Results:**
- ✅ Successfully signed in
- ✅ Redirected to User Dashboard
- ✅ Dashboard shows user name and email

### Test Case 1.4: User Dashboard
**Expected Elements:**
- ✅ Header with "Welcome, John Doe"
- ✅ Email displayed
- ✅ Browse PGs button
- ✅ Favorites button
- ✅ My Bookings button
- ✅ Edit Profile option
- ✅ Settings option
- ✅ Sign Out option

### Test Case 1.5: Session Persistence
**Steps:**
1. Close app completely
2. Reopen app

**Expected Results:**
- ✅ User still logged in
- ✅ Dashboard displayed immediately
- ✅ No need to sign in again

### Test Case 1.6: Sign Out
**Steps:**
1. On dashboard, tap **"Sign Out"**

**Expected Results:**
- ✅ Signed out successfully
- ✅ Redirected to splash screen
- ✅ Session cleared

---

## 2️⃣ PG Owner Flow Testing

### Test Case 2.1: Owner Sign Up - Step 1
**Steps:**
1. Launch app (or navigate back to splash)
2. On splash screen, tap **"PG Owner"** (🏢)
3. Tap **"Sign Up"** link at bottom
4. Fill in Step 1 form:
   - Name: `Jane Smith`
   - Email: `jane.smith@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
5. Tap **"Next"** button

**Expected Results:**
- ✅ Progress bar shows step 2 active
- ✅ Step 2 form displayed
- ✅ Back button available

### Test Case 2.2: Owner Sign Up - Step 2
**Steps:**
1. Fill in Step 2 form:
   - Contact Number: `9876543210`
   - PG Name: `Sunshine PG`
   - PG Location: `Mumbai, Maharashtra`
2. Tap **"Sign Up"** button

**Expected Results:**
- ✅ Alert shows "Verification Email Sent"
- ✅ Email received with verification link
- ✅ Redirected to Sign In screen

**Database Verification:**
```sql
-- Check user was created
SELECT * FROM auth.users WHERE email = 'jane.smith@test.com';

-- Check owner_profiles entry (after email verification)
SELECT * FROM owner_profiles WHERE email = 'jane.smith@test.com';

-- Check PG was created
SELECT * FROM pgs WHERE name = 'Sunshine PG';

-- Check PG ID is in owner's pg_ids array
SELECT op.name, op.pg_ids, p.name as pg_name
FROM owner_profiles op
LEFT JOIN pgs p ON p.id = ANY(op.pg_ids)
WHERE op.email = 'jane.smith@test.com';

-- Check user_metadata
SELECT * FROM user_metadata WHERE user_type = 'owner';
```

### Test Case 2.3: Owner Email Verification
**Steps:**
1. Open email inbox
2. Find verification email from Supabase
3. Click verification link

**Expected Results:**
- ✅ Browser opens with success message
- ✅ Email confirmed in Supabase

### Test Case 2.4: Owner Sign In
**Steps:**
1. Return to app
2. On Sign In screen, enter:
   - Email: `jane.smith@test.com`
   - Password: `password123`
3. Tap **"Sign In"** button

**Expected Results:**
- ✅ Successfully signed in
- ✅ Redirected to Owner Dashboard
- ✅ Dashboard shows owner name, email, and contact

### Test Case 2.5: Owner Dashboard
**Expected Elements:**
- ✅ Header with "Welcome, Jane Smith"
- ✅ Email displayed
- ✅ Contact number displayed
- ✅ Stats showing "1 Properties"
- ✅ Add New PG button
- ✅ My Properties button
- ✅ Analytics button
- ✅ Messages button
- ✅ Edit Profile option
- ✅ Settings option
- ✅ Sign Out option

### Test Case 2.6: Owner Session Persistence
**Steps:**
1. Close app completely
2. Reopen app

**Expected Results:**
- ✅ Owner still logged in
- ✅ Owner Dashboard displayed immediately
- ✅ No need to sign in again

### Test Case 2.7: Owner Sign Out
**Steps:**
1. On dashboard, tap **"Sign Out"**

**Expected Results:**
- ✅ Signed out successfully
- ✅ Redirected to splash screen
- ✅ Session cleared

---

## 3️⃣ Form Validation Testing

### Test Case 3.1: Empty Fields
**Steps:**
1. Try to submit forms with empty fields

**Expected Results:**
- ✅ Error messages displayed
- ✅ Form not submitted
- ✅ Specific field errors shown

### Test Case 3.2: Invalid Email
**Steps:**
1. Enter invalid email: `notanemail`
2. Try to submit

**Expected Results:**
- ✅ "Email is invalid" error shown
- ✅ Form not submitted

### Test Case 3.3: Short Password
**Steps:**
1. Enter password: `12345` (less than 6 chars)
2. Try to submit

**Expected Results:**
- ✅ "Password must be at least 6 characters" error shown
- ✅ Form not submitted

### Test Case 3.4: Password Mismatch
**Steps:**
1. Password: `password123`
2. Confirm Password: `password456`
3. Try to submit

**Expected Results:**
- ✅ "Passwords do not match" error shown
- ✅ Form not submitted

### Test Case 3.5: Invalid Phone Number
**Steps:**
1. Enter contact number: `12345` (less than 10 digits)
2. Try to submit

**Expected Results:**
- ✅ "Contact number must be 10 digits" error shown
- ✅ Form not submitted

---

## 4️⃣ Security Testing

### Test Case 4.1: RLS - User Profile Access
**Steps:**
1. Sign in as User 1
2. Try to access User 2's profile via direct query

**Expected Results:**
- ✅ Cannot access other user's data
- ✅ Only own profile visible

**SQL Test:**
```sql
-- As User 1, try to see all profiles (should only see own)
SELECT * FROM user_profiles;
```

### Test Case 4.2: RLS - Owner Profile Access
**Steps:**
1. Sign in as Owner 1
2. Try to access Owner 2's profile via direct query

**Expected Results:**
- ✅ Cannot access other owner's data
- ✅ Only own profile visible

### Test Case 4.3: RLS - PG Access
**Steps:**
1. Sign in as any authenticated user
2. Query PGs table

**Expected Results:**
- ✅ Can view all PGs (for browsing)
- ✅ Cannot modify PGs owned by others

### Test Case 4.4: Trigger Execution
**Steps:**
1. Sign up new user
2. Check database

**Expected Results:**
- ✅ Entry in auth.users
- ✅ Entry in user_profiles (auto-created)
- ✅ Entry in user_metadata (auto-created)

---

## 5️⃣ Error Handling Testing

### Test Case 5.1: Duplicate Email
**Steps:**
1. Try to sign up with existing email

**Expected Results:**
- ✅ Error alert displayed
- ✅ Clear error message
- ✅ User can retry

### Test Case 5.2: Wrong Password
**Steps:**
1. Try to sign in with wrong password

**Expected Results:**
- ✅ Error alert displayed
- ✅ "Invalid login credentials" message
- ✅ User can retry

### Test Case 5.3: Unverified Email
**Steps:**
1. Sign up but don't verify email
2. Try to sign in

**Expected Results:**
- ✅ Error about email not confirmed
- ✅ User can resend verification

### Test Case 5.4: Network Error
**Steps:**
1. Turn off internet
2. Try to sign in

**Expected Results:**
- ✅ Network error displayed
- ✅ App doesn't crash
- ✅ User can retry when online

---

## 6️⃣ UI/UX Testing

### Test Case 6.1: Loading States
**Expected:**
- ✅ Loading spinner shown during API calls
- ✅ Buttons disabled while loading
- ✅ No double submissions

### Test Case 6.2: Keyboard Handling
**Expected:**
- ✅ Keyboard doesn't cover inputs
- ✅ KeyboardAvoidingView works
- ✅ Can dismiss keyboard by tapping outside

### Test Case 6.3: Navigation
**Expected:**
- ✅ Back buttons work correctly
- ✅ Can navigate between Sign In/Sign Up
- ✅ Proper screen transitions

### Test Case 6.4: Design Consistency
**Expected:**
- ✅ Clean white backgrounds
- ✅ Consistent gray color palette
- ✅ Underlined inputs throughout
- ✅ Proper spacing and typography

---

## 🔍 Database Verification Queries

### Check All Users
```sql
SELECT 
    u.email,
    u.email_confirmed_at,
    u.raw_user_meta_data->>'user_type' as user_type,
    u.created_at
FROM auth.users u
ORDER BY u.created_at DESC;
```

### Check User Profiles
```sql
SELECT * FROM user_profiles ORDER BY created_at DESC;
```

### Check Owner Profiles with PGs
```sql
SELECT 
    op.name as owner_name,
    op.email,
    op.contact_no,
    op.pg_ids,
    p.name as pg_name,
    p.location
FROM owner_profiles op
LEFT JOIN pgs p ON p.id = ANY(op.pg_ids)
ORDER BY op.created_at DESC;
```

### Check User Metadata
```sql
SELECT 
    um.user_type,
    u.email,
    um.created_at
FROM user_metadata um
JOIN auth.users u ON u.id = um.user_id
ORDER BY um.created_at DESC;
```

### Check Triggers
```sql
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

### Check RLS Policies
```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 📊 Test Results Template

| Test Case | Status | Notes |
|-----------|--------|-------|
| User Sign Up | ⬜ | |
| User Email Verification | ⬜ | |
| User Sign In | ⬜ | |
| User Dashboard | ⬜ | |
| User Session Persistence | ⬜ | |
| Owner Sign Up Step 1 | ⬜ | |
| Owner Sign Up Step 2 | ⬜ | |
| Owner Email Verification | ⬜ | |
| Owner Sign In | ⬜ | |
| Owner Dashboard | ⬜ | |
| Owner Session Persistence | ⬜ | |
| Form Validation | ⬜ | |
| RLS Security | ⬜ | |
| Error Handling | ⬜ | |
| UI/UX | ⬜ | |

Legend: ✅ Pass | ❌ Fail | ⬜ Not Tested

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid API Key"
**Solution:** Check `src/config/supabase.ts` has correct anon key

### Issue: "Email not confirmed"
**Solution:** Click verification link in email

### Issue: Profile not created
**Solution:** Check triggers are installed correctly

### Issue: Session not persisting
**Solution:** Verify AsyncStorage is installed

### Issue: RLS blocking queries
**Solution:** Check user is authenticated and policies are correct

---

**Testing Status:** Ready for comprehensive testing ✅
