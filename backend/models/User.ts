import { Pool } from 'pg';

// User interface
export interface User {
  id: number;
  username: string;
  password: string;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Create a new user
export const createUser = async (username: string, password: string): Promise<User> => {
  const result = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, password',
    [username, password]
  );
  return result.rows[0];
};

// Find a user by username
export const getUserByUsername = async (username: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0] || null;
};
