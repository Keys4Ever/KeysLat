-- Tabla de usuarios
CREATE TABLE if NOT EXISTS users (
    user_id VARCHAR PRIMARY KEY,
    email VARCHAR NOT NULL,
    username VARCHAR,
    profile_picture VARCHAR,
    role VARCHAR(50),
    auth_provider VARCHAR NOT NULL,
    password VARCHAR
);

-- Tabla de URLs
CREATE TABLE if NOT EXISTS urls (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR,
    short_url VARCHAR NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabla de tags
CREATE TABLE if NOT EXISTS tags (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    user_id VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabla de quick_urls (URLs rápidas)
CREATE TABLE if NOT EXISTS quick_urls (
    id VARCHAR PRIMARY KEY,
    short_url VARCHAR NOT NULL UNIQUE,
    secret_key VARCHAR NOT NULL,
    FOREIGN KEY (short_url) REFERENCES urls(short_url) ON DELETE CASCADE
);

-- Tabla de estadísticas de URL
CREATE TABLE if NOT EXISTS url_stats (
    url_id VARCHAR PRIMARY KEY,
    clicks INTEGER NOT NULL DEFAULT 0,
    access_date TIMESTAMP NOT NULL,
    FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE
);

-- Tabla de relación entre URLs y tags
CREATE TABLE if NOT EXISTS url_tags (
    url_id VARCHAR NOT NULL,
    tag_id VARCHAR NOT NULL,
    PRIMARY KEY (url_id, tag_id),
    FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
-- Índices para mejorar el rendimiento
CREATE INDEX if NOT EXISTS  idx_urls_user_id ON urls(user_id);
CREATE INDEX if NOT EXISTS  idx_tags_user_id ON tags(user_id);
CREATE INDEX if NOT EXISTS  idx_url_tags_url_id ON url_tags(url_id);
CREATE INDEX if NOT EXISTS  idx_url_tags_tag_id ON url_tags(tag_id);
