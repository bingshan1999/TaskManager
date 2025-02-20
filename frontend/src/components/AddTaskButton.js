// File: frontend/src/components/AddTaskButton.js
import React from 'react';

const AddTaskButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600">
      + Add Task
    </button>
  );
};

export default AddTaskButton;
