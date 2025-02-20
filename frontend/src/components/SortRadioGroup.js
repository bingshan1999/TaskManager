// File: frontend/src/components/SortRadioGroup.js
import React from 'react';

const SortRadioGroup = ({ sortType, setSortType }) => {
  return (
    <div className="flex space-x-3">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          value="status"
          checked={sortType === "status"}
          onChange={() => setSortType("status")}
          className="accent-blue-500"
        />
        <span>Sort by Status</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          value="assignedTo"
          checked={sortType === "assignedTo"}
          onChange={() => setSortType("assignedTo")}
          className="accent-blue-500"
        />
        <span>Sort by Assigned To</span>
      </label>
    </div>
  );
};

export default SortRadioGroup;
