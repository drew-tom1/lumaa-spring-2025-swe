import { Request, Response, Router } from "express";
import { Pool } from "pg";
import authenticate from "../middleware/auth";

// Interface definitions
interface User {
  id: number;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  is_complete: boolean;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

const taskRouter = Router();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Get all tasks for authenticated user
taskRouter.get("/", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const { rows } = await pool.query<Task>(
      `SELECT * FROM tasks WHERE user_id = ${req.user?.id}`
    );

    // Convert to camelCase for response
    const tasks = rows.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      isComplete: task.is_complete,
      userId: task.user_id,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    }));
    
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new task
taskRouter.post("/", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const { title, description }: { title: string; description?: string } = req.body;

    const query = `INSERT INTO tasks (title, description, is_complete, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [title, description, false, req.user?.id, Date.now(), Date.now()];

    const { rows } = await pool.query<Task>(query, values);

    const createdTimestamp = rows[0].created_at;
    const updatedTimestamp = rows[0].updated_at;

    const createdDate = new Date(createdTimestamp).toLocaleString().split(",").join("");
    const updatedDate = new Date(updatedTimestamp).toLocaleString().split(",").join("");

    res.status(201).json({
      id: rows[0].id,
      title: rows[0].title,
      description: rows[0].description,
      isComplete: rows[0].is_complete,
      createdAt: createdDate,
      updatedAt: updatedDate
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// Update task
taskRouter.put("/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const taskId = parseInt(req.params.id);
    const { title, description, isComplete }: 
      { title?: string; description?: string; isComplete?: boolean } = req.body;

    const updates = [];
    const values: (string | boolean | number)[] = [];
    let paramCount = 1;

    if (title) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (isComplete !== undefined) {
      updates.push(`is_complete = $${paramCount++}`);
      values.push(isComplete);
    }

    if (updates.length === 0) {
      res.status(400).json({ message: "No fields to update" });
      return;
    }

    updates.push(`updated_at = $${paramCount++}`);
    values.push(Date.now());

    values.push(taskId, req.user!.id);


    const { rowCount } = await pool.query(
      `UPDATE tasks 
       SET ${updates.join(", ")} 
       WHERE id = $${paramCount} AND user_id = $${paramCount + 1}`,
      values
    );

    if (rowCount === 0) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
});

// Delete task
taskRouter.delete("/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const taskId = parseInt(req.params.id);
    const query = `DELETE FROM tasks WHERE id = $1 AND user_id = $2`;
    const values = [taskId, req.user?.id];

    const { rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default taskRouter;