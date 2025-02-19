import React from "react";

const TaskCard = ({ task, onStatusChange, onDelete }) => {
  // Status colors
  const statusColors = {
    PENDING: "border-yellow-500 bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "border-blue-500 bg-blue-100 text-blue-700",
    COMPLETED: "border-green-500 bg-green-100 text-green-700",
  };

  return (
    <div className={`border-l-4 p-4 rounded-lg shadow-md ${statusColors[task.status]} flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <span className="text-sm text-gray-600">{new Date(task.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-gray-700 mb-2">{task.description}</p>
      <p className="text-sm text-gray-600 mb-2">Assigned to: <span className="font-semibold">{task.assignedTo}</span></p>
      
      {/* Status Dropdown */}
      <select
        className="w-full p-2 border rounded-md bg-white cursor-pointer"
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
      >
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(task.id)}
        className="w-full mt-2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
      >
        Delete Task
      </button>
    </div>
  );
};

export default TaskCard;
