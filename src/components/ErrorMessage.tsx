import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
      {message}
    </div>
  );
};

export default ErrorMessage;