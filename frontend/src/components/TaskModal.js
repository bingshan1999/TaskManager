import React from "react";

const TaskModal = ({ isOpen, onClose, onSubmit, newTask, setNewTask }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-slate-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Create New Task</h2>
        
        {/* Task Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="text" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full p-2 border rounded-md bg-slate-700 text-white focus:ring focus:ring-blue-400" required />
          <input type="text" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="w-full p-2 border rounded-md bg-slate-700 text-white focus:ring focus:ring-blue-400" />
          <input type="text" placeholder="Assigned To" value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} className="w-full p-2 border rounded-md bg-slate-700 text-white focus:ring focus:ring-blue-400" required />
          
          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
