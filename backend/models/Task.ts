import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export interface Task {
    id: number;
    title: string;
    description?: string;
    isComplete: boolean;
    userId: number;
  }
  
  export const createTask = async (title: string, description: string | undefined, userId: number): Promise<Task> => {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, userId) VALUES ($1, $2, $3) RETURNING id, title, description, isComplete, userId',
      [title, description, userId]
    );
    return result.rows[0];
  };
  
  // Get tasks by user ID
  export const getTasksByUser = async (userId: number): Promise<Task[]> => {
    const result = await pool.query('SELECT * FROM tasks WHERE userId = $1', [userId]);
    return result.rows;
  };
  