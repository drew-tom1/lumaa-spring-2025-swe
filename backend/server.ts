import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import taskRouter from "./routes/taskRoutes";
import authRouter from "./routes/authRoutes";

const app = express();

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/tasks", taskRouter);
app.use("/auth", authRouter);

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Task Manager API is running 🚀");
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});