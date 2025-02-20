import React, { useEffect, useState } from "react";

const ErrorMessage = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose(); // Clear error after timeout
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message || !visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg w-80 flex justify-between items-center">
      <span>{message}</span>
      <button onClick={() => { setVisible(false); onClose(); }} className="ml-4 text-white font-bold">
        ✖
      </button>
    </div>
  );
};

export default ErrorMessage;
