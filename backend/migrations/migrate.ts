import { MigrationBuilder } from 'node-pg-migrate';
import { Client } from 'pg';

export const up = (pgm: MigrationBuilder) => {
  pgm.sql(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_complete BOOLEAN DEFAULT false,
        user_id INTEGER REFERENCES users(id)
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        updated_at TIMESTAMP
    );
  `);
};

export const down = (pgm: MigrationBuilder) => {
  pgm.sql(`
    DROP TABLE tasks;
    DROP TABLE users;
  `);
};