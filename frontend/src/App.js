import { useEffect, useState } from "react";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import CollapsibleSection from "./components/CollapsibleSection";
import ErrorMessage from "./components/ErrorMessage";
import SortRadioGroup from "./components/SortRadioGroup";
import SearchBar from "./components/SearchBar";
import AddTaskButton from "./components/AddTaskButton";

function App() {
  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "PENDING",
    customField: ""
  });
  const [sortType, setSortType] = useState("status");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch tasks from the backend
  useEffect(() => {
    fetch("http://localhost:8080/tasks")
      .then(response => {
        if (!response.ok)
          throw new Error("Failed to fetch tasks. The server may be down.");
        return response.json();
      })
      .then(data => {
        console.log("Fetched tasks:", data);
        setTasks(data);
        setErrorMessage(null);
      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
        setErrorMessage("Unable to load tasks. Please check your connection.");
      });
  }, []);

  // Group tasks when tasks, sortType, or searchQuery changes
  useEffect(() => {
    // Filter tasks by search query
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    let groups = {};
    if (sortType === "status") {
      groups = {
        PENDING: filtered.filter(task => task.status === "PENDING"),
        IN_PROGRESS: filtered.filter(task => task.status === "IN_PROGRESS"),
        COMPLETED: filtered.filter(task => task.status === "COMPLETED")
      };
    } else if (sortType === "assignedTo") {
      groups = filtered.reduce((acc, task) => {
        const key = task.assignedTo;
        if (!acc[key]) acc[key] = [];
        acc[key].push(task);
        return acc;
      }, {});
    }
    setGroupedTasks(groups);
  }, [tasks, sortType, searchQuery]);

  // Create new task with error handling
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to create task.");
        return response.json();
      })
      .then(data => {
        setTasks([...tasks, data]);
        setIsModalOpen(false);
        setNewTask({
          title: "",
          description: "",
          assignedTo: "",
          status: "PENDING",
          customField: ""
        });
        setErrorMessage(null);
      })
      .catch(error => {
        console.error("Error adding task:", error);
        setErrorMessage("Could not create task. Please try again.");
        setIsModalOpen(false);
      });
  };

  // Update task status with error handling
  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTask = tasks.find(task => task.id === taskId);
    if (!updatedTask) return;
    fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updatedTask, status: newStatus })
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

  // Delete a task with error handling
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
      {/* Global Error Message */}
      <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />
      
      <h1 className="text-4xl font-bold text-center text-slate-100 mb-6">Task Manager</h1>
      
      {/* Top Bar: Sorting, Search, and Add Task Button */}
      <div className="flex flex-col md:flex-row justify-between max-w-4xl mx-auto mb-6 space-y-3 md:space-y-0">
        <SortRadioGroup sortType={sortType} setSortType={setSortType} />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <AddTaskButton onClick={() => setIsModalOpen(true)} />
      </div>
      
      {/* Task Modal */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit} 
        newTask={newTask} 
        setNewTask={setNewTask} 
      />
      
      {/* Render Grouped Tasks */}
      <div className="max-w-6xl mx-auto">
        {Object.entries(groupedTasks).map(([key, tasks]) => {
          console.log("Rendering group:", key, tasks);
          return (
            <CollapsibleSection 
              key={key} 
              title={sortType === "status" ? key.replace("_", " ") : `Assigned to ${key}`}
            >
              {Array.isArray(tasks) 
                ? tasks.map(task => (
                    <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} onDelete={handleDelete} />
                  ))
                : null}
            </CollapsibleSection>
          );
        })}
      </div>
    </div>
  );
}

export default App;
