"use client";

import DatePicker from "react-datepicker";
import React, { FC, Fragment, useEffect, useState } from "react";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";





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


export interface StayDatesRangeInputProps {
  className?: string;
  onDateChange?: (date: Date | null) => void;
  onClose?: () => void;
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  className = "",
  onDateChange,
  onClose,
}) => {

  const getDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    return tomorrow;
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(getDefaultDate());

  // Update the selected date when the component mounts
  useEffect(() => {
    const defaultDate = getDefaultDate();
    setSelectedDate(defaultDate);
    if (onDateChange) {
      onDateChange(defaultDate);
    }
  }, []);

  const onChangeDate = (date: Date | null) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
    
    // Close the date picker after selection
    if (onClose) {
      onClose();
    }
  };



  return (
    <div>
      <div className="p-5">
      <style jsx global>{customDatePickerStyles}</style>
        <span className="block font-semibold text-xl sm:text-2xl">
          {``}
        </span>
      </div>
      <div
        className={`relative flex-shrink-0 flex justify-center z-10 py-5 ${className} `}
      >
        {/*
        <DatePicker
          selected={selectedDate}
          onChange={onChangeDate}
          showPopperArrow={false}
          inline
          monthsShown={2}
          renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
          renderDayContents={(day, date) => (
            <DatePickerCustomDay dayOfMonth={day} date={date} />
          )}
        />*/}
        <DatePicker
          selected={selectedDate || getDefaultDate()}
          onChange={onChangeDate}
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
  );
};

export default StayDatesRangeInput;
