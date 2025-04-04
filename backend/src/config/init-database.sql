-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR PRIMARY KEY,
  email VARCHAR NOT NULL,
  username VARCHAR,
  profile_picture VARCHAR,
  role VARCHAR(50)
);

-- Tabla de URLs
CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR,
  short_url VARCHAR NOT NULL UNIQUE,
  original_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Tabla de tags
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  user_id VARCHAR NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Tabla de quick_urls (URLs rápidas)
CREATE TABLE IF NOT EXISTS quick_urls (
  id SERIAL PRIMARY KEY,
  short_url VARCHAR NOT NULL UNIQUE,
  secret_key VARCHAR NOT NULL,
  FOREIGN KEY (short_url) REFERENCES urls(short_url)
);

-- Tabla de estadísticas de URL
CREATE TABLE IF NOT EXISTS url_stats (
  url_id INTEGER PRIMARY KEY,
  clicks INTEGER NOT NULL DEFAULT 0,
  access_date TIMESTAMP NOT NULL,
  FOREIGN KEY (url_id) REFERENCES urls(id)
);

-- Tabla de relación entre URLs y tags
CREATE TABLE IF NOT EXISTS url_tags (
  url_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (url_id, tag_id),
  FOREIGN KEY (url_id) REFERENCES urls(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_url_tags_url_id ON url_tags(url_id);
CREATE INDEX IF NOT EXISTS idx_url_tags_tag_id ON url_tags(tag_id);
