import React, { FC, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface TimeSlotInputProps {
  className?: string;
  onTimeSelect?: (time: string) => void;
  onClose?: () => void;
  selectedTime?: string | null;
}

const TimeSlotInput: FC<TimeSlotInputProps> = ({
  className = "",
  onTimeSelect,
  onClose,
  selectedTime: propSelectedTime,
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(propSelectedTime || null);

  // Update internal state when prop changes
  useEffect(() => {
    setSelectedTime(propSelectedTime || null);
  }, [propSelectedTime]);

  // Generate time slots from 9:30 AM to 10:00 PM in 45-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = new Date();
    currentTime.setHours(9, 30, 0); // Start at 9:30 AM

    while (currentTime.getHours() < 22 || (currentTime.getHours() === 22 && currentTime.getMinutes() === 0)) {
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      
      slots.push(
        `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
      );
      
      currentTime.setMinutes(currentTime.getMinutes() + 45);
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (onTimeSelect) {
      onTimeSelect(time);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`TimeSlotInput ${className}`}>
      <div className="p-5">
        <span className="block font-semibold text-xl sm:text-2xl">
          選擇上課時間
        </span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              className={`p-2 text-sm rounded-lg transition-colors ${
                selectedTime === time
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotInput; 