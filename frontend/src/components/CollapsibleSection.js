import React, { useState } from "react";

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4">
      {/* Collapsible Header */}
      <button
        className="w-full text-left p-3 bg-gray-300 text-gray-900 rounded-md flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold">{title}</span>
        <span>{isOpen ? "▼" : "▶"}</span>
      </button>

      {/* Collapsible Content */}
      {isOpen && <div className="flex flex-wrap gap-4 p-3">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
