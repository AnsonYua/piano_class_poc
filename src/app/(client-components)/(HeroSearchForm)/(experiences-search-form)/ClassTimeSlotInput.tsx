"use client";

import React, { Fragment, useState, FC } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ClockIcon } from "@heroicons/react/24/outline";
import ClearDataButton from "../ClearDataButton";

export interface ClassTimeSlotInputProps {
  className?: string;
  fieldClassName?: string;
  selectedTime?: string | null;
  onTimeSelect?: (time: string) => void;
}

const ClassTimeSlotInput: FC<ClassTimeSlotInputProps> = ({
  className = "",
  fieldClassName = "[ nc-hero-field-padding ]",
  selectedTime = null,
  onTimeSelect,
}) => {
  const [time, setTime] = useState<string | null>(selectedTime);

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime);
    if (onTimeSelect) {
      onTimeSelect(selectedTime);
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
            {time || "時間"}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {time ? "上課時間" : `上課時間`}
          </span>
        </div>
      </>
    );
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00", "22:30"
  ];

  return (
    <>
      <Popover
        className={`ClassTimeSlotInput relative flex ${className}`}
      >
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex-1 z-10 flex relative ${fieldClassName} items-center space-x-3 focus:outline-none ${
                open ? "nc-hero-field-focused" : ""
              }`}
            >
              {renderInput()}
              {time && open && (
                <ClearDataButton onClick={() => handleTimeSelect("")} />
              )}
            </Popover.Button>
           
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
              <Popover.Panel className="absolute left-1/2 z-50 mt-3 top-full -translate-x-1/2 w-[90vw] sm:w-[500px] md:w-[600px]">
                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-4">
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-[300px] overflow-y-auto">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        className={`px-3 py-2 text-sm rounded-lg ${
                          time === slot
                            ? "bg-primary-600 text-white"
                            : "bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                        }`}
                        onClick={() => {
                          handleTimeSelect(slot);
                          close();
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

export default ClassTimeSlotInput; 