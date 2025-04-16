"use client";

import React, { Fragment, useState, FC, useEffect, useRef } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import zhTW from "date-fns/locale/zh-TW";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import ClearDataButton from "../../(HeroSearchForm)/ClearDataButton";
import { usePopover } from "./PopoverContext";

// Register Traditional Chinese locale
registerLocale("zh-TW", zhTW);

// Custom CSS for DatePicker to match ExperiencesDateSingleInput
const customDatePickerStyles = `
  .react-datepicker {
    font-family: inherit;
    border: none;
    background-color: transparent;
  }
  .react-datepicker__month-container {
    width: 100%;
  }
  .react-datepicker__header {
    background-color: transparent;
    border-bottom: none;
    padding-top: 0;
  }
  .react-datepicker__day-names {
    display: flex;
    justify-content: space-around;
    margin-top: 0.25rem;
  }
  .react-datepicker__day-name {
    color: #6b7280;
    font-weight: 500;
    width: 2rem;
    margin: 0.1rem;
  }
  .react-datepicker__month {
    margin: 0.2rem;
  }
  .react-datepicker__week {
    display: flex;
    justify-content: space-around;
  }
  .react-datepicker__day {
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    margin: 0.1rem;
    border-radius: 0.375rem;
    color: #374151;
  }
  .react-datepicker__day:hover {
    background-color: #f3f4f6;
  }
  .react-datepicker__day--selected {
    background-color: #3b82f6;
    color: white;
    font-weight: 600;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #3b82f6;
    color: white;
  }
  .react-datepicker__day--disabled {
    color: #d1d5db;
  }
  .react-datepicker__navigation {
    top: 0.25rem;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #6b7280;
  }
  .react-datepicker__current-month {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }
  .dark .react-datepicker {
    background-color: transparent;
  }
  .dark .react-datepicker__day {
    color: #e5e7eb;
  }
  .dark .react-datepicker__day:hover {
    background-color: #4b5563;
  }
  .dark .react-datepicker__day--selected {
    background-color: #3b82f6;
  }
  .dark .react-datepicker__day--disabled {
    color: #4b5563;
  }
  .dark .react-datepicker__current-month {
    color: #f3f4f6;
  }
  .dark .react-datepicker__day-name {
    color: #9ca3af;
  }
  /* Fix for two months side by side */
  .react-datepicker__month-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .react-datepicker__month {
    flex: 1;
    margin: 0 0.25rem;
  }
`;

export interface DateInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  onDateChange?: (date: Date | null) => void;
}

const DateInput: FC<DateInputProps> = ({
  autoFocus = false,
  placeHolder = "日期",
  desc = "上課日期",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 right-0.5",
  defaultValue = null,
  onChange,
  onDateChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activePopover, setActivePopover } = usePopover();
  const popoverId = "date-input";

  const [date, setDate] = useState<Date | null>(() => {
    // Try to get date from localStorage first
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      const parsedDate = new Date(savedDate);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    // If no valid date in localStorage, use defaultValue
    return defaultValue;
  });
  
  const showPopover = activePopover === popoverId;

  useEffect(() => {
    setActivePopover(autoFocus ? popoverId : null);
  }, [autoFocus, setActivePopover, popoverId]);

  useEffect(() => {
    if (onChange) {
     // onChange(date);
    }
  }, [date]);

  const formatDateToUTC8 = (date: Date) => {
    // Clone the date to avoid mutating the original
    const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    // Get the date in ISO format, but only the date part
    return utc8Date.toISOString().split("T")[0];
  };
  
  useEffect(() => {
    if (defaultValue) {
      setDate(defaultValue);
      localStorage.setItem('selectedDate', defaultValue.toISOString());
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

  const eventClickOutsideDiv = (event: MouseEvent) => {
    if (!containerRef.current) return;
    // CLICK IN_SIDE
    if (!showPopover || containerRef.current.contains(event.target as Node)) {
      return;
    }
    // CLICK OUT_SIDE
    setActivePopover(null);
  };

  const handleDateChange = (selectedDate: Date | null) => {
    const hkDate = selectedDate ? toHKTime(selectedDate) : null;
    setDate(hkDate);
    if (hkDate) {
      localStorage.setItem('selectedDate', hkDate.toISOString());
    } else {
      localStorage.removeItem('selectedDate');
    }
    if (onChange) {
      onChange(hkDate);
    }
    // Call the onDateChange callback to reset other form fields
    if (onDateChange) {
      onDateChange(hkDate);
    }
    setActivePopover(null);
  };

  // Set default date to tomorrow when calendar is shown
  const getDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  // Calculate the minimum date (current date + 2 days)
  const getMinDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 2);
    return minDate;
  };

  // Get next month date
  const getNextMonthDate = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };
  function toHKTime(date: Date) {
    // Get UTC+8 offset in minutes
    const HK_OFFSET = 8 * 60;
    // Get current timezone offset in minutes
    const localOffset = date.getTimezoneOffset();
    // Calculate the difference and apply it
    return new Date(date.getTime() + (HK_OFFSET + localOffset) * 60 * 1000);
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <style jsx global>{customDatePickerStyles}</style>
      <div
        onClick={() => setActivePopover(popoverId)}
        className={`flex z-10 flex-1 relative [ nc-hero-field-padding ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "nc-hero-field-focused rounded-none" : ""
        }`}
        style={showPopover ? { borderRadius: '0' } : undefined}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <CalendarIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none xl:text-lg font-semibold placeholder-neutral-800 dark:placeholder-neutral-200 truncate`}
            placeholder={placeHolder}
            value={date ? formatDate(date) : ""}
            autoFocus={showPopover}
            readOnly
          />
          <span className="block mt-0.5 text-sm text-neutral-400 font-light">
            <span className="line-clamp-1">{desc}</span>
          </span>
          {date && showPopover && (
            <ClearDataButton
              onClick={() => {
                setDate(null);
                localStorage.removeItem('selectedDate');
                if (onChange) {
                  onChange(null);
                }
                // Also call onDateChange with null to reset other fields
                if (onDateChange) {
                  onDateChange(null);
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
        <div className="absolute left-0 z-50 mt-3 top-full w-[90vw] sm:w-auto">
          <div className="overflow-hidden rounded-none shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-4">
            <div className="flex flex-row">
              <DatePicker
                selected={date || getDefaultDate()}
                onChange={handleDateChange}
                monthsShown={1}
                      showPopperArrow={false}
                      inline
                      locale="zh-TW"
                      dateFormat="yyyy年MM月dd日"
                      calendarClassName="w-[240px]"
                      minDate={new Date(new Date().setDate(new Date().getDate() + 3))}
              />

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateInput; 