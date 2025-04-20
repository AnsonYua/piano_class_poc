import React, { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/outline";

export interface StudentDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  students?: Array<{ id: string; name: string }>;
}

const StudentDropdown: React.FC<StudentDropdownProps> = ({ value, onChange, className, students = [] }) => {
  const [isActive, setIsActive] = useState(false);

  // Defensive: ensure students is always an array
  const safeStudents = Array.isArray(students) ? students : [];

  // Debug: log students array and isActive state
  useEffect(() => {
    console.log('StudentDropdown: isActive', isActive, 'safeStudents', safeStudents);
  }, [isActive, safeStudents]);

  return (
    <div className={`flex flex-col relative p-5 ${className || ''}`}>
      <span className="mb-5 block font-semibold text-xl sm:text-2xl">選擇學生</span>
      {/* Show error if no students */}
      {safeStudents.length === 0 && (
        <div className="text-red-500 text-sm mb-3">沒有學生資料，請聯絡管理員</div>
      )}
      <div className="space-y-4">
        {safeStudents.map((student) => (
          <button
            key={student.id}
            className={`w-full p-4 text-left rounded-lg border ${
              value === student.id
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => {
              onChange(student.id);
              setIsActive(false);
            }}
          >
            <div className="font-medium">{student.name}</div>
            {/* You can add more student info here if available */}
          </button>
        ))}
      </div>
      {/* Add a close button for mobile UX */}
    </div>
  );
};

export default StudentDropdown;
