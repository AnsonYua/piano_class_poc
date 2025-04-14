"use client";

import { TagIcon } from "@heroicons/react/24/outline";
import React, { useState, useRef, useEffect, FC } from "react";
import ClearDataButton from "../../(HeroSearchForm)/ClearDataButton";
import { usePopover } from "./PopoverContext";

export interface TypeInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
  selectedStudent?: string | null;
  studentGrade?: string | null;
}

const TypeInput: FC<TypeInputProps> = ({
  autoFocus = false,
  placeHolder = "類型",
  desc = "課程類型",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 right-0.5",
  defaultValue = "",
  onChange,
  selectedStudent = null,
  studentGrade = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { activePopover, setActivePopover } = usePopover();
  const popoverId = "type-input";

  const [value, setValue] = useState(defaultValue);
  const [showStudentRequiredPopup, setShowStudentRequiredPopup] = useState(false);
  const showPopover = activePopover === popoverId;

  // Update value when defaultValue changes (including when it's cleared)
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setActivePopover(autoFocus ? popoverId : null);
  }, [autoFocus, setActivePopover, popoverId]);

  useEffect(() => {
    if (eventClickOutsideDiv) {
      document.removeEventListener("click", eventClickOutsideDiv);
    }
    (showPopover || showStudentRequiredPopup) && document.addEventListener("click", eventClickOutsideDiv);
    return () => {
      document.removeEventListener("click", eventClickOutsideDiv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopover, showStudentRequiredPopup]);

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);

  const eventClickOutsideDiv = (event: MouseEvent) => {
    if (!containerRef.current) return;
    // CLICK IN_SIDE
    if ((!showPopover && !showStudentRequiredPopup) || containerRef.current.contains(event.target as Node)) {
      return;
    }
    // CLICK OUT_SIDE
    setActivePopover(null);
    setShowStudentRequiredPopup(false);
  };

  const handleTypeSelect = (selectedType: string) => {
    setValue(selectedType);
    if (onChange) {
      onChange(selectedType);
    }
    setActivePopover(null);
  };

  const handleClick = () => {
    if (!selectedStudent) {
      setShowStudentRequiredPopup(true);
      return;
    }
    setActivePopover(popoverId);
  };

  // Dynamic types based on student grade
  const getTypes = () => {
    if (!selectedStudent) {
      return [];
    }
    
    if (studentGrade) {
      return ["上課", "練琴"];
    } else {
      return ["評估"];
    }
  };

  const types = getTypes();

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
          <TagIcon className="w-5 h-5 lg:w-7 lg:h-7" />
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
        <div className="absolute left-0 z-50 w-full bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-6 rounded-none shadow-xl">
          <div className="p-4">
            <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4">
              選擇類型
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {types.map((type) => (
                <div
                  key={type}
                  className={`flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg cursor-pointer ${
                    value === type ? "bg-neutral-100 dark:bg-neutral-700" : ""
                  }`}
                  onClick={() => handleTypeSelect(type)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showStudentRequiredPopup && (
        <div className="absolute left-0 z-50 w-full bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-6 rounded-none shadow-xl">
          <div className="p-4 text-center">
            <p className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
              請先選擇學生
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              您需要先選擇一個學生才能選擇課程類型
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeInput; 