import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface ClearDataButtonProps {
  onClick?: () => void;
}

const ClearDataButton: React.FC<ClearDataButtonProps> = ({ onClick }) => {
  return (
    <button
      className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
      onClick={onClick}
    >
      <XMarkIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
    </button>
  );
};

export default ClearDataButton; 