-- ============================================
-- PG MANAGEMENT APP - DATABASE SCHEMA
-- ============================================
-- This file contains all database tables, triggers, and RLS policies
-- Project ID: aaisjnexkvvukzqncrto
-- ============================================

-- ============================================
-- TABLES
-- ============================================

-- User Profiles Table (for normal users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PG (Paying Guest) Properties Table

-- Owner Profiles Table (for PG owners)
CREATE TABLE IF NOT EXISTS public.owner_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    contact_no TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pgs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    address TEXT,
    description TEXT,
    amenities TEXT[],
    images TEXT[],
    owner_id UUID REFERENCES public.owner_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- User Type Metadata Table (to distinguish between user types)
CREATE TABLE IF NOT EXISTS public.user_metadata (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_type TEXT NOT NULL CHECK (user_type IN ('user', 'owner')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PG Metadata Table (for flexible property attributes)
CREATE TABLE IF NOT EXISTS public.pgs_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pg_id UUID REFERENCES public.pgs(id) ON DELETE CASCADE,
    amenities TEXT[],
    boys_only BOOLEAN DEFAULT FALSE,
    girls_only BOOLEAN DEFAULT FALSE,
    property_type TEXT, -- e.g., 'apartment', 'villa', 'hostel'
    furnishing_status TEXT, -- e.g., 'fully_furnished', 'semi_furnished', 'unfurnished'
    parking_available BOOLEAN DEFAULT FALSE,
    wifi_available BOOLEAN DEFAULT FALSE,
    ac_available BOOLEAN DEFAULT FALSE,
    laundry_available BOOLEAN DEFAULT FALSE,
    security_deposit DECIMAL(10,2),
    monthly_rent DECIMAL(10,2),
    electricity_charges TEXT, -- e.g., 'included', 'separate', 'per_unit'
    water_charges TEXT, -- e.g., 'included', 'separate'
    food_provided BOOLEAN DEFAULT FALSE,
    guest_allowed BOOLEAN DEFAULT FALSE,
    smoking_allowed BOOLEAN DEFAULT FALSE,
    pets_allowed BOOLEAN DEFAULT FALSE,
    curfew_time TIME,
    notice_period_days INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE MUTATIONS (For Existing Tables)
-- ============================================

-- Run these commands if you already have existing tables in your Supabase database
-- These ALTER TABLE commands will add new columns to existing tables safely

-- Create pgs_metadata table for existing databases
CREATE TABLE IF NOT EXISTS public.pgs_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pg_id UUID REFERENCES public.pgs(id) ON DELETE CASCADE,
    amenities TEXT[],
    boys_only BOOLEAN DEFAULT FALSE,
    girls_only BOOLEAN DEFAULT FALSE,
    property_type TEXT,
    furnishing_status TEXT,
    parking_available BOOLEAN DEFAULT FALSE,
    wifi_available BOOLEAN DEFAULT FALSE,
    ac_available BOOLEAN DEFAULT FALSE,
    laundry_available BOOLEAN DEFAULT FALSE,
    security_deposit DECIMAL(10,2),
    monthly_rent DECIMAL(10,2),
    electricity_charges TEXT,
    water_charges TEXT,
    food_provided BOOLEAN DEFAULT FALSE,
    guest_allowed BOOLEAN DEFAULT FALSE,
    smoking_allowed BOOLEAN DEFAULT FALSE,
    pets_allowed BOOLEAN DEFAULT FALSE,
    curfew_time TIME,
    notice_period_days INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add amenities field as TEXT instead of TEXT[] if needed
-- ALTER TABLE public.pgs ALTER COLUMN amenities TYPE TEXT;

-- Add address field if missing
-- ALTER TABLE public.pgs ADD COLUMN IF NOT EXISTS address TEXT;

-- Add description field if missing  
-- ALTER TABLE public.pgs ADD COLUMN IF NOT EXISTS description TEXT;

-- Add images field if missing
-- ALTER TABLE public.pgs ADD COLUMN IF NOT EXISTS images TEXT[];

-- Update existing records to set default values (optional)
-- UPDATE public.pgs SET boys_only = FALSE WHERE boys_only IS NULL;
-- UPDATE public.pgs SET girls_only = FALSE WHERE girls_only IS NULL;

-- ============================================
-- REMOVE COLUMNS (Drop Commands)
-- ============================================

-- Remove gender restriction fields from pgs table
ALTER TABLE public.pgs DROP COLUMN IF EXISTS boys_only;
ALTER TABLE public.pgs DROP COLUMN IF EXISTS girls_only;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check user type from raw_user_meta_data
    IF NEW.raw_user_meta_data->>'user_type' = 'user' THEN
        -- Insert into user_profiles
        INSERT INTO public.user_profiles (id, name, email)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'name', ''),
            NEW.email
        );
        
        -- Insert into user_metadata
        INSERT INTO public.user_metadata (user_id, user_type)
        VALUES (NEW.id, 'user');
        
    ELSIF NEW.raw_user_meta_data->>'user_type' = 'owner' THEN
        -- Insert into owner_profiles
        INSERT INTO public.owner_profiles (id, name, email, contact_no)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'name', ''),
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'contact_no', '')
        );
        
        -- Insert into user_metadata
        INSERT INTO public.user_metadata (user_id, user_type)
        VALUES (NEW.id, 'owner');
        
        -- If PG data is provided, create PG entry
        IF NEW.raw_user_meta_data->>'pg_name' IS NOT NULL THEN
            INSERT INTO public.pgs (name, location, owner_id)
            VALUES (
                NEW.raw_user_meta_data->>'pg_name',
                COALESCE(NEW.raw_user_meta_data->>'pg_location', ''),
                NEW.id
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Triggers to update updated_at timestamp
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_owner_profiles_updated_at ON public.owner_profiles;
CREATE TRIGGER update_owner_profiles_updated_at
    BEFORE UPDATE ON public.owner_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_pgs_updated_at ON public.pgs;
CREATE TRIGGER update_pgs_updated_at
    BEFORE UPDATE ON public.pgs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pgs_metadata ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but needed for manual inserts)
CREATE POLICY "Users can insert own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Owner Profiles Policies
-- Owners can view their own profile
CREATE POLICY "Owners can view own profile"
    ON public.owner_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Owners can update their own profile
CREATE POLICY "Owners can update own profile"
    ON public.owner_profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Owners can insert their own profile
CREATE POLICY "Owners can insert own profile"
    ON public.owner_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- PG Policies
-- Anyone can view PGs (for browsing)
CREATE POLICY "Anyone can view PGs"
    ON public.pgs
    FOR SELECT
    TO authenticated
    USING (true);

-- Only owners can insert PGs
CREATE POLICY "Owners can insert PGs"
    ON public.pgs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.owner_profiles
            WHERE id = auth.uid()
        )
    );

-- Owners can update their own PGs
CREATE POLICY "Owners can update own PGs"
    ON public.pgs
    FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid());

-- Owners can delete their own PGs
CREATE POLICY "Owners can delete own PGs"
    ON public.pgs
    FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());

-- User Metadata Policies
-- Users can view their own metadata
CREATE POLICY "Users can view own metadata"
    ON public.user_metadata
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own metadata
CREATE POLICY "Users can insert own metadata"
    ON public.user_metadata
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- PG Metadata Policies
-- Anyone can view PG metadata (for browsing properties)
CREATE POLICY "Anyone can view PG metadata"
    ON public.pgs_metadata
    FOR SELECT
    TO authenticated
    USING (true);

-- Only owners can insert PG metadata for their own properties
CREATE POLICY "Owners can insert PG metadata"
    ON public.pgs_metadata
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pgs
            WHERE id = pg_id AND owner_id = auth.uid()
        )
    );

-- Owners can update metadata for their own PGs
CREATE POLICY "Owners can update own PG metadata"
    ON public.pgs_metadata
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.pgs
            WHERE id = pg_id AND owner_id = auth.uid()
        )
    );

-- Owners can delete metadata for their own PGs
CREATE POLICY "Owners can delete own PG metadata"
    ON public.pgs_metadata
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.pgs
            WHERE id = pg_id AND owner_id = auth.uid()
        )
    );

-- ============================================
-- INDEXES (for performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_owner_profiles_email ON public.owner_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_metadata_user_id ON public.user_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_user_metadata_user_type ON public.user_metadata(user_type);
CREATE INDEX IF NOT EXISTS idx_pgs_location ON public.pgs(location);
CREATE INDEX IF NOT EXISTS idx_pgs_owner_id ON public.pgs(owner_id);
CREATE INDEX IF NOT EXISTS idx_pgs_metadata_pg_id ON public.pgs_metadata(pg_id);

-- ============================================
-- NOTES
-- ============================================
-- 1. All timestamps are in UTC
-- 2. RLS policies ensure data security
-- 3. Triggers automatically create profiles on user signup
-- 4. User type is determined by raw_user_meta_data during signup
-- 5. PG owners can manage multiple PG properties
-- ============================================
