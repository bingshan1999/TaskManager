import { useEffect, useState } from "react";
import TaskCard from "./components/TaskCard";
import CollapsibleSection from "./components/CollapsibleSection";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedTo: "", status: "PENDING" });

  // Fetch tasks
  useEffect(() => {
    fetch("http://localhost:8080/tasks")
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  // Create new task
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
        setNewTask({ title: "", description: "", assignedTo: "", status: "PENDING" });
      })
      .catch(error => console.error("Error adding task:", error));
  };

  // Update task status
  const handleStatusChange = (taskId, newStatus) => {
    fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...tasks.find(t => t.id === taskId), status: newStatus }),
    })
      .then(response => response.json())
      .then(updatedTask => {
        setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));
      })
      .catch(error => console.error("Error updating task:", error));
  };

  // Delete task
  const handleDelete = (taskId) => {
    fetch(`http://localhost:8080/tasks/${taskId}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter(task => task.id !== taskId)))
      .catch(error => console.error("Error deleting task:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-500 mb-6">Task Manager</h1>
      {/* Create Task Form */}
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200" required />
          <input type="text" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200" />
          <input type="text" placeholder="Assigned To" value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200" required />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Add Task</button>
        </form>
      </div>
      {/* Collapsible Sections for Task Groups */}
      <CollapsibleSection title="Pending Tasks">
        {tasks.filter(task => task.status === "PENDING").map(task => (
          <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
        ))}
      </CollapsibleSection>

      <CollapsibleSection title="In Progress Tasks">
        {tasks.filter(task => task.status === "IN_PROGRESS").map(task => (
          <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
        ))}
      </CollapsibleSection>

      <CollapsibleSection title="Completed Tasks">
        {tasks.filter(task => task.status === "COMPLETED").map(task => (
          <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
        ))}
      </CollapsibleSection>


    </div>
  );
}

export default App;
