import React, { FC, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import ClearDataButton from "../ClearDataButton";

interface ClassTimeSlotInputProps {
  className?: string;
  fieldClassName?: string;
  onTimeSelect?: (time: string) => void;
  selectedTime?: string | null;
}

const ClassTimeSlotInput: FC<ClassTimeSlotInputProps> = ({
  className = "",
  fieldClassName = "[ nc-hero-field-padding ]",
  onTimeSelect,
  selectedTime: propSelectedTime,
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(propSelectedTime || null);
  const [isOpen, setIsOpen] = useState(false);

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
      
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const columns = 4;
  const rows = Math.ceil(timeSlots.length / columns);
  const timeSlotGrid = Array.from({ length: rows }, (_, rowIndex) =>
    timeSlots.slice(rowIndex * columns, (rowIndex + 1) * columns)
  );

  const handleTimeSelect = (time: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTime(time);
    if (onTimeSelect) {
      onTimeSelect(time);
    }
    // Close the popover after selection
    setIsOpen(false);
  };

  const handleClearTime = () => {
    setSelectedTime(null);
    if (onTimeSelect) {
      onTimeSelect("");
    }
  };

  const renderInput = () => {
    return (
      <>
        <div className="text-neutral-300 dark:text-neutral-400">
          <ClockIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow text-left">
          <span className="block xl:text-lg font-semibold">
            {selectedTime || "時間"}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            上課時間
          </span>
        </div>
      </>
    );
  };

  return (
    <Popover className={`ClassTimeSlotInput relative flex ${className}`}>
      {({ open, close }) => {
        // Update our internal state when the popover opens/closes
        if (open !== isOpen) {
          setIsOpen(open);
        }
        
        return (
          <>
            <div
              className={`flex-1 z-10 flex items-center focus:outline-none ${
                open ? "nc-hero-field-focused" : ""
              }`}
            >
              <Popover.Button
                className={`flex-1 z-10 flex relative ${fieldClassName} items-center space-x-3 focus:outline-none`}
              >
                {renderInput()}
                {selectedTime && open && (
                  <ClearDataButton onClick={handleClearTime} />
                )}
              </Popover.Button>
            </div>

            {open && (
              <div className="h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -inset-x-0.5 bg-white dark:bg-neutral-800"></div>
            )}

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-0 z-10 w-screen max-w-sm px-4 mt-3 top-full sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div className="p-5">
                    <span className="block font-semibold text-xl sm:text-2xl">
                      選擇上課時間
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlotGrid.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                          {row.map((time) => (
                            <button
                              key={time}
                              type="button"
                              className={`p-2 text-sm rounded-lg transition-colors ${
                                selectedTime === time
                                  ? "bg-primary-500 text-white"
                                  : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                              }`}
                              onClick={(e) => {
                                handleTimeSelect(time, e);
                                close(); // Close the popover after selection
                              }}
                            >
                              {time}
                            </button>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        );
      }}
    </Popover>
  );
};

export default ClassTimeSlotInput; 