-- Recipe Stats System - Database Schema
-- Run this with: npx wrangler d1 execute recipe-stats --remote --file=./schema.sql

-- Business Tables
CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    ip TEXT,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_pv_site ON page_views(site_id);

CREATE TABLE IF NOT EXISTS recipe_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id TEXT NOT NULL,
    site_id TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rv_recipe ON recipe_views(recipe_id);

CREATE TABLE IF NOT EXISTS recipe_stats (
    recipe_id TEXT PRIMARY KEY,
    views INTEGER DEFAULT 0,
    favorites INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS meal_generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    dish_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mg_site ON meal_generations(site_id);

CREATE TABLE IF NOT EXISTS meal_plans (
    meal_id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    dish_ids TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mp_date ON meal_plans(created_at);

CREATE TABLE IF NOT EXISTS site_daily_stats (
    site_id TEXT NOT NULL,
    date TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    meals INTEGER DEFAULT 0,
    PRIMARY KEY (site_id, date)
);

-- User Tables
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    nickname TEXT,
    avatar TEXT DEFAULT '👨‍🍳',
    favorites TEXT DEFAULT '[]',
    history TEXT DEFAULT '[]',
    preferences TEXT DEFAULT '{}',
    created_at TEXT NOT NULL,
    last_login TEXT
);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    ip TEXT,
    user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
