import { useEffect, useState } from "react";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import CollapsibleSection from "./components/CollapsibleSection";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedTo: "", status: "PENDING" });
  const [sortType, setSortType] = useState("status"); // Default sorting by status
  const [searchQuery, setSearchQuery] = useState(""); // Search input for filtering by title

  // Fetch tasks from the backend
  useEffect(() => {
    fetch("http://localhost:8080/tasks")
      .then(response => response.json())
      .then(data => {
        setTasks(data);
      })
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  // Update filtered tasks when sorting/filtering/search changes
  useEffect(() => {
    let groupedTasks = {};

    // **Apply Search Filter (Title Contains Search Query)**
    const filteredBySearch = tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortType === "status") {
      groupedTasks = {
        PENDING: filteredBySearch.filter(task => task.status === "PENDING"),
        IN_PROGRESS: filteredBySearch.filter(task => task.status === "IN_PROGRESS"),
        COMPLETED: filteredBySearch.filter(task => task.status === "COMPLETED"),
      };
    } else if (sortType === "assignedTo") {
      groupedTasks = filteredBySearch.reduce((acc, task) => {
        if (!acc[task.assignedTo]) acc[task.assignedTo] = [];
        acc[task.assignedTo].push(task);
        return acc;
      }, {});
    }

    setFilteredTasks(groupedTasks);
  }, [sortType, tasks, searchQuery]);

  // Handle new task creation
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then(response => response.json())
      .then(data => {
        setTasks([...tasks, data]);
        setIsModalOpen(false);
        setNewTask({ title: "", description: "", assignedTo: "", status: "PENDING" });
      })
      .catch(error => console.error("Error adding task:", error));
  };

  // Update task status
  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTask = tasks.find(task => task.id === taskId);
    if (!updatedTask) return;

    fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updatedTask, status: newStatus }),
    })
      .then(response => response.json())
      .then(updatedTask => {
        setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));
      })
      .catch(error => console.error("Error updating task:", error));
  };

  //  Delete a task
  const handleDelete = (taskId) => {
    fetch(`http://localhost:8080/tasks/${taskId}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter(task => task.id !== taskId)))
      .catch(error => console.error("Error deleting task:", error));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
      <h1 className="text-4xl font-bold text-center text-slate-100 mb-6">Task Manager</h1>

      {/* Filter, Search & Add Task */}
      <div className="flex flex-col md:flex-row justify-between max-w-4xl mx-auto mb-6 gap-4">
        <div className="flex space-x-3">
          {/* Sorting Selection */}
          <label className="flex items-center space-x-2">
            <input type="radio" value="status" checked={sortType === "status"} onChange={() => setSortType("status")} className="accent-blue-500" />
            <span>Sort by Status</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" value="assignedTo" checked={sortType === "assignedTo"} onChange={() => setSortType("assignedTo")} className="accent-blue-500" />
            <span>Sort by Assigned To</span>
          </label>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Title..."
          className="p-2 rounded-md bg-slate-700 text-white w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Add Task Button */}
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600">
          + Add Task
        </button>
      </div>

      {/* Task Modal */}
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} newTask={newTask} setNewTask={setNewTask} />

      {/* Render tasks based on sorting method */}
      <div className="max-w-6xl mx-auto">
        {Object.entries(filteredTasks).map(([key, tasks]) => (
          <CollapsibleSection key={key} title={sortType === "status" ? key.replace("_", " ") : `Assigned to ${key}`}>
            {Array.isArray(tasks) ? tasks.map(task => (
              <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} onDelete={handleDelete} />
            )) : null}
          </CollapsibleSection>
        ))}
      </div>
    </div>
  );
}

export default App;
