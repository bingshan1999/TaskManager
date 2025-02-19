import React, { useState } from "react";

const TaskModal = ({ isOpen, onClose, onSubmit, newTask, setNewTask }) => {
  const [errors, setErrors] = useState({});
  const titleLimit = 50; // Character limit for title
  const descriptionLimit = 200; // Character limit for description

  if (!isOpen) return null;

  // Validate Input Before Submitting
  const validateForm = () => {
    let newErrors = {};
    
    // Title Validation
    if (!newTask.title.trim()) {
      newErrors.title = "Title is required";
    } else if (newTask.title.length > titleLimit) {
      newErrors.title = `Title must be ${titleLimit} characters or less`;
    }

    // AssignedTo Validation
    if (!newTask.assignedTo.trim()) {
      newErrors.assignedTo = "Assigned to is required";
    }

    // Description Character Limit Check
    if (newTask.description.length > descriptionLimit) {
      newErrors.description = `Description must be ${descriptionLimit} characters or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // Handle Submit with Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  // Reset Errors When User Types
  const handleInputChange = (field, value) => {
    setNewTask({ ...newTask, [field]: value });

    // Remove error message when the input becomes valid
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (field === "title" && value.trim() && value.length <= titleLimit) {
        delete newErrors.title;
      }
      if (field === "assignedTo" && value.trim()) {
        delete newErrors.assignedTo;
      }
      if (field === "description" && value.length <= descriptionLimit) {
        delete newErrors.description;
      }
      return newErrors;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-slate-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Create New Task</h2>

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input with Character Limit */}
          <div>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full p-2 border rounded-md bg-slate-700 text-white focus:ring focus:ring-blue-400"
            />
            <p className="text-sm text-gray-400">
              {newTask.title.length} / {titleLimit} characters
            </p>
            {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
          </div>

          {/* Description Input with Character Limit */}
          <div>
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full p-2 border rounded-md bg-slate-700 text-white focus:ring focus:ring-blue-400"
            />
            <p className="text-sm text-gray-400">
              {newTask.description.length} / {descriptionLimit} characters
            </p>
            {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
          </div>

          {/* Assigned To Input */}
          <div>
            <input
              type="text"
              placeholder="Assigned To"
              value={newTask.assignedTo}
              onChange={(e) => handleInputChange("assignedTo", e.target.value)}
              className="w-full p-2 border rounded-md bg-slate-700 text-white focus:ring focus:ring-blue-400"
            />
            {errors.assignedTo && <p className="text-red-400 text-sm">{errors.assignedTo}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md">
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${
                Object.keys(errors).length === 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 cursor-not-allowed"
              }`}
              disabled={Object.keys(errors).length > 0}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
