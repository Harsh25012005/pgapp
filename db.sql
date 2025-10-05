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
CREATE TABLE IF NOT EXISTS public.pgs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    address TEXT,
    description TEXT,
    amenities TEXT[],
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Owner Profiles Table (for PG owners)
CREATE TABLE IF NOT EXISTS public.owner_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    contact_no TEXT NOT NULL,
    pg_ids UUID[] DEFAULT '{}',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Type Metadata Table (to distinguish between user types)
CREATE TABLE IF NOT EXISTS public.user_metadata (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_type TEXT NOT NULL CHECK (user_type IN ('user', 'owner')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
            DECLARE
                new_pg_id UUID;
            BEGIN
                INSERT INTO public.pgs (name, location)
                VALUES (
                    NEW.raw_user_meta_data->>'pg_name',
                    COALESCE(NEW.raw_user_meta_data->>'pg_location', '')
                )
                RETURNING id INTO new_pg_id;
                
                -- Update owner_profiles with the new PG ID
                UPDATE public.owner_profiles
                SET pg_ids = array_append(pg_ids, new_pg_id)
                WHERE id = NEW.id;
            END;
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
    USING (
        EXISTS (
            SELECT 1 FROM public.owner_profiles
            WHERE id = auth.uid()
            AND id = ANY(pg_ids)
        )
    );

-- Owners can delete their own PGs
CREATE POLICY "Owners can delete own PGs"
    ON public.pgs
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.owner_profiles
            WHERE id = auth.uid()
            AND id = ANY(pg_ids)
        )
    );

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

-- ============================================
-- INDEXES (for performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_owner_profiles_email ON public.owner_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_metadata_user_id ON public.user_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_user_metadata_user_type ON public.user_metadata(user_type);
CREATE INDEX IF NOT EXISTS idx_pgs_location ON public.pgs(location);

-- ============================================
-- NOTES
-- ============================================
-- 1. All timestamps are in UTC
-- 2. RLS policies ensure data security
-- 3. Triggers automatically create profiles on user signup
-- 4. User type is determined by raw_user_meta_data during signup
-- 5. PG owners can manage multiple PG properties
-- ============================================
