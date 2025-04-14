"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import React, { useState, useRef, useEffect, FC } from "react";
import ClearDataButton from "../../(HeroSearchForm)/ClearDataButton";
import { usePopover } from "./PopoverContext";

export interface StudentInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const StudentInput: FC<StudentInputProps> = ({
  autoFocus = false,
  placeHolder = "學生",
  desc = "學生人數",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
  defaultValue = "",
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { activePopover, setActivePopover } = usePopover();
  const popoverId = "student-input";

  const [value, setValue] = useState(defaultValue);
  const showPopover = activePopover === popoverId;

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
    showPopover && document.addEventListener("click", eventClickOutsideDiv);
    return () => {
      document.removeEventListener("click", eventClickOutsideDiv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopover]);

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);

  const eventClickOutsideDiv = (event: MouseEvent) => {
    if (!containerRef.current) return;
    // CLICK IN_SIDE
    if (!showPopover || containerRef.current.contains(event.target as Node)) {
      return;
    }
    // CLICK OUT_SIDE
    setActivePopover(null);
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    setActivePopover(null);
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setActivePopover(popoverId)}
        className={`flex z-10 flex-1 relative [ nc-hero-field-padding ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "nc-hero-field-focused rounded-none" : ""
        }`}
        style={showPopover ? { borderRadius: '0' } : undefined}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <UserIcon className="w-5 h-5 lg:w-7 lg:h-7" />
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
            <input
              type="number"
              min="1"
              max="10"
              className="w-full p-2 border rounded-md"
              value={value}
              onChange={handleStudentChange}
              placeholder="請輸入學生人數 (1-10)"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInput; 