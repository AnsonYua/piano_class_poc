"use client";

import { ClockIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useState, useRef, useEffect, FC } from "react";
import { Popover, Transition } from "@headlessui/react";
import ClearDataButton from "../../(HeroSearchForm)/ClearDataButton";
import { usePopover } from "./PopoverContext";

export interface TimeInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
  availableTimeSlots?: string[];
  selectedStudent?: string | null;
  selectedType?: string | null;
  selectedDistrict?: string | null;
  selectedDate?: Date | null;
}

const TimeInput: FC<TimeInputProps> = ({
  autoFocus = false,
  placeHolder = "時間",
  desc = "上課時間",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 right-0.5",
  defaultValue = "",
  onChange,
  availableTimeSlots = [],
  selectedStudent = null,
  selectedType = null,
  selectedDistrict = null,
  selectedDate = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { activePopover, setActivePopover } = usePopover();
  const popoverId = "time-input";
  const [value, setValue] = useState(defaultValue);
  const [showRequiredFieldsPopup, setShowRequiredFieldsPopup] = useState(false);
  const showPopover = activePopover === popoverId;

  // Generate time slots from 9:30 AM to 10:00 PM
  const timeSlots = [
    "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00"
  ];

  useEffect(() => {
    setActivePopover(autoFocus ? popoverId : null);
  }, [autoFocus, setActivePopover, popoverId]);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (eventClickOutsideDiv) {
      document.removeEventListener("click", eventClickOutsideDiv);
    }
    (showPopover || showRequiredFieldsPopup) && document.addEventListener("click", eventClickOutsideDiv);
    return () => {
      document.removeEventListener("click", eventClickOutsideDiv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopover, showRequiredFieldsPopup]);

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);

  const eventClickOutsideDiv = (event: MouseEvent) => {
    if (!containerRef.current) return;
    // CLICK IN_SIDE
    if ((!showPopover && !showRequiredFieldsPopup) || containerRef.current.contains(event.target as Node)) {
      return;
    }
    // CLICK OUT_SIDE
    setActivePopover(null);
    setShowRequiredFieldsPopup(false);
  };

  const handleTimeSelect = (selectedTime: string) => {
    setValue(selectedTime);
    if (onChange) {
      onChange(selectedTime);
    }
    setActivePopover(null);
  };

  const handleClick = () => {
    // Check if all required fields are filled
    if (!selectedStudent || !selectedType || !selectedDistrict || !selectedDate) {
      setShowRequiredFieldsPopup(true);
      return;
    }
    setActivePopover(popoverId);
  };

  // Get missing required fields for the alert message
  const getMissingFields = () => {
    const missingFields = [];
    if (!selectedStudent) missingFields.push("上課學生");
    if (!selectedType) missingFields.push("課程類型");
    if (!selectedDistrict) missingFields.push("上課地區");
    if (!selectedDate) missingFields.push("上課日期");
    return missingFields;
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={handleClick}
        className={`flex z-10 flex-1 relative [ nc-hero-field-padding ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "nc-hero-field-focused rounded-none" : ""
        }`}
        style={showPopover ? { borderRadius: '0' } : undefined}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <ClockIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none xl:text-lg font-semibold placeholder-neutral-800 dark:placeholder-neutral-200 truncate`}
            placeholder={placeHolder}
            value={value}
            autoFocus={showPopover}
            readOnly
            ref={inputRef}
          />
          <span className="block mt-0.5 text-sm text-neutral-400 font-light">
            <span className="line-clamp-1">{desc}</span>
          </span>
          {value && showPopover && (
            <ClearDataButton
              onClick={() => {
                setValue("");
                if (onChange) {
                  onChange("");
                }
              }}
            />
          )}
        </div>
      </div>

      {showPopover && (
        <div
          className={`h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 bg-white dark:bg-neutral-800 ${divHideVerticalLineClass} rounded-none`}
        ></div>
      )}

      {showPopover && (
        <div className="absolute left-0 z-50 w-full min-w-[300px] sm:min-w-[500px] bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-6 rounded-none shadow-xl">
          <div className="p-4">
            <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4">
              選擇時間
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-[300px] overflow-y-auto">
              {timeSlots.map((slot) => {
                let isAvailable = false;
               
                if(!availableTimeSlots.includes(slot)) {
                  isAvailable = true;
                }
                if(availableTimeSlots.length === 0 ) {
                  isAvailable = false;
                } 
                
                return (
                  <button
                    key={slot}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      value === slot
                        ? "bg-primary-600 text-white"
                        : isAvailable
                          ? "bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                          : "bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (isAvailable) {
                        handleTimeSelect(slot);
                      }
                    }}
                    disabled={!isAvailable}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showRequiredFieldsPopup && (
        <div className="absolute left-0 z-50 w-full bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-6 rounded-none shadow-xl">
          <div className="p-4 text-center">
            <p className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
              請先完成必要欄位
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              您需要先選擇 {getMissingFields().join("、")} 才能選擇上課時間
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeInput; 