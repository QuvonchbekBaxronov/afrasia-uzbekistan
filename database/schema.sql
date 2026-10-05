-- =========================================================================
-- AFRASIA UZBEKISTAN PLATFORM: POSTGRESQL PRODUCTION DDL SCHEMA
-- Modules: Google OAuth, User Profile, Favorites, Tour Bookings, EdTech
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    google_id VARCHAR(255) UNIQUE,
    role VARCHAR(50) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'GUIDE')),
    locale VARCHAR(10) DEFAULT 'it',
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 1,
    hearts INTEGER DEFAULT 5,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- 2. Saved Places & Tours (Favorites / Bookmarks)
CREATE TABLE IF NOT EXISTS saved_places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    place_id VARCHAR(255) NOT NULL,
    place_type VARCHAR(50) DEFAULT 'place' CHECK (place_type IN ('place', 'tour', 'cuisine')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_saved_place UNIQUE (user_id, place_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_places_user_id ON saved_places(user_id);

-- 3. Tour Bookings
CREATE TABLE IF NOT EXISTS tour_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tour_id VARCHAR(255) NOT NULL,
    tour_title VARCHAR(255) NOT NULL,
    booking_date DATE NOT NULL,
    adults_count INTEGER DEFAULT 1,
    children_count INTEGER DEFAULT 0,
    total_price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'EUR',
    status VARCHAR(50) DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
    customer_phone VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tour_bookings_user ON tour_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_reference ON tour_bookings(booking_reference);

-- 4. Duolingo Courses, Units, Lessons & Exercises
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'it-uz'
    title VARCHAR(255) NOT NULL,
    source_lang VARCHAR(10) NOT NULL, -- 'it'
    target_lang VARCHAR(10) NOT NULL, -- 'uz'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    unit_number INTEGER NOT NULL,
    title_it VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_uz VARCHAR(255) NOT NULL,
    icon VARCHAR(50) DEFAULT '⭐',
    color_theme VARCHAR(50) DEFAULT 'emerald',
    grammar_rule TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_course_unit UNIQUE (course_id, unit_number)
);

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    order_number INTEGER NOT NULL,
    title_it VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_uz VARCHAR(255) NOT NULL,
    xp_reward INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_unit_lesson UNIQUE (unit_id, order_number)
);

CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    order_number INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('READING', 'WRITING', 'LISTENING', 'SPEAKING', 'MATCHING')),
    prompt_it TEXT NOT NULL,
    prompt_uz TEXT,
    audio_url TEXT,
    phonetic VARCHAR(255),
    expected_answer TEXT NOT NULL,
    options_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT TRUE,
    score INTEGER DEFAULT 100,
    stars_earned INTEGER DEFAULT 3,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
