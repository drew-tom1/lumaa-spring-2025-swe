CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_complete BOOLEAN DEFAULT false,
    user_id INTEGER REFERENCES users(id),
    created_at VARCHAR(255),
    updated_at VARCHAR(255)
);