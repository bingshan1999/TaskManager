import { useEffect, useState } from "react";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import CollapsibleSection from "./components/CollapsibleSection";
import ErrorMessage from "./components/ErrorMessage"; //  Import error component

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedTo: "", status: "PENDING" });
  const [sortType, setSortType] = useState("status");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  //  Fetch tasks with error handling
  useEffect(() => {
    fetch("http://localhost:8080/tasks")
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch tasks. The server may be down.");
        return response.json();
      })
      .then(data => {
        console.log(data);
        setTasks(data);
        setFilteredTasks(data);
        setErrorMessage(null);
      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
        setErrorMessage("Unable to load tasks. Please check your connection.");
      });
  }, []);

  // ✅ Handle new task creation with error handling
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to create task.");
        return response.json();
      })
      .then(data => {
        setTasks([...tasks, data]);
        setIsModalOpen(false); // ✅ Close modal on success
        setNewTask({ title: "", description: "", assignedTo: "", status: "PENDING" });
        setErrorMessage(null);
      })
      .catch(error => {
        console.error("Error adding task:", error);
        setErrorMessage("Could not create task. Please try again.");
        setIsModalOpen(false); // ✅ Close modal on failure so user sees the error
      });
  };

  // ✅ Update task status with error handling
  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTask = tasks.find(task => task.id === taskId);
    if (!updatedTask) return;

    fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updatedTask, status: newStatus }),
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to update task.");
        return response.json();
      })
      .then(updatedTask => {
        setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));
        setErrorMessage(null);
      })
      .catch(error => {
        console.error("Error updating task:", error);
        setErrorMessage("Could not update task. Please try again.");
      });
  };

  // ✅ Delete a task with error handling
  const handleDelete = (taskId) => {
    fetch(`http://localhost:8080/tasks/${taskId}`, { method: "DELETE" })
      .then(response => {
        if (!response.ok) throw new Error("Failed to delete task.");
        setTasks(tasks.filter(task => task.id !== taskId));
        setErrorMessage(null);
      })
      .catch(error => {
        console.error("Error deleting task:", error);
        setErrorMessage("Could not delete task. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
      {/* ✅ Global Error Message (Now bottom-right and visible even with modal open) */}
      <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />

      <h1 className="text-4xl font-bold text-center text-slate-100 mb-6">Task Manager</h1>

      {/* Filter, Search & Add Task */}
      <div className="flex flex-col md:flex-row justify-between max-w-4xl mx-auto mb-6 space-y-3 md:space-y-0">
        <div className="flex space-x-3">
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
          placeholder="Search by Title"
          className="p-2 rounded-md bg-slate-700 text-white w-full md:w-72"
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
