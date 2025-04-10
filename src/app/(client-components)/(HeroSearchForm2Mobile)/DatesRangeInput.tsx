"use client";

import DatePicker from "react-datepicker";
import React, { FC, Fragment, useEffect, useState } from "react";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";

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
  // Get tomorrow's date (current date + 1 day)
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(getTomorrowDate());

  // Update the selected date when the component mounts
  useEffect(() => {
    const tomorrow = getTomorrowDate();
    setSelectedDate(tomorrow);
    if (onDateChange) {
      onDateChange(tomorrow);
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
        <span className="block font-semibold text-xl sm:text-2xl">
          {``}
        </span>
      </div>
      <div
        className={`relative flex-shrink-0 flex justify-center z-10 py-5 ${className} `}
      >
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
        />
      </div>
    </div>
  );
};

export default StayDatesRangeInput;
