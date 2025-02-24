import { useState, useEffect } from "react";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks from API
  useEffect(() => {
    axios.get("http://localhost:3000/tasks") // Adjust API URL
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add a new task
  const handleAddTask = () => {
    if (!newTask.trim()) return;

    axios.post("http://localhost:5000/tasks", { title: newTask, isComplete: false })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Mark task as complete
  const handleCompleteTask = (id) => {
    axios.patch(`http://localhost:5000/tasks/${id}`, { isComplete: true })
      .then(() => {
        setTasks(tasks.map(task => 
          task.id === id ? { ...task, isComplete: true } : task
        ));
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Tasks</h2>

        {/* Add Task Input */}
        <div className="flex mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded-l-lg"
            placeholder="New Task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
            onClick={handleAddTask}
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center p-2 border rounded-lg">
              <span className={task.isComplete ? "line-through text-gray-500" : ""}>
                {task.title}
              </span>
              <div>
                {!task.isComplete && (
                  <button 
                    className="text-green-500 mr-2" 
                    onClick={() => handleCompleteTask(task.id)}
                  >
                    ✅
                  </button>
                )}
                <button 
                  className="text-red-500" 
                  onClick={() => handleDeleteTask(task.id)}
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
