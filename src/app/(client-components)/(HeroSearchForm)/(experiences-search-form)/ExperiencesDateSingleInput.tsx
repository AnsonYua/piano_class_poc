"use client";

import React, { Fragment, useState } from "react";
import { FC } from "react";
import DatePicker from "react-datepicker";
import { Popover, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import ClearDataButton from "../ClearDataButton";
import { registerLocale } from "react-datepicker";
import zhTW from "date-fns/locale/zh-TW";
// Register Traditional Chinese locale
registerLocale("zh-TW", zhTW);

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

export interface ExperiencesDateSingleInputProps {
  className?: string;
  fieldClassName?: string;
  selectsRange?: boolean;
}

const ExperiencesDateSingleInput: FC<ExperiencesDateSingleInputProps> = ({
  className = "",
  fieldClassName = "[ nc-hero-field-padding ]",
  selectsRange = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const onChangeDate = (date: Date | null) => {
    setSelectedDate(date);
  };

  const renderInput = () => {
    return (
      <>
        <div className="text-neutral-300 dark:text-neutral-400">
          <CalendarIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow text-left">
          <span className="block xl:text-lg font-semibold">
            {selectedDate?.toLocaleDateString("zh-TW", {
              year: "numeric",
              month: "long",
              day: "2-digit",
            }) || "日期"}
          </span>
          <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
            {selectedDate ? "上課日期" : `上課日期`}
          </span>
        </div>
      </>
    );
  };

  // Set default date to tomorrow when calendar is shown
  const getDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    return tomorrow;
  };

  return (
    <>
      <style jsx global>{customDatePickerStyles}</style>
      <Popover
        className={`ExperiencesDateSingleInput relative flex ${className}`}
      >
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex-1 z-10 flex relative ${fieldClassName} items-center space-x-3 focus:outline-none ${
                open ? "nc-hero-field-focused" : ""
              }`}
            >
              {renderInput()}
              {selectedDate && open && (
                <ClearDataButton onClick={() => onChangeDate(null)} />
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
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 top-full -translate-x-1/2">
                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-3">
                  {
                    <DatePicker
                      selected={selectedDate || getDefaultDate()}
                      onChange={(date: Date | null) => {
                        onChangeDate(date);
                        close();
                      }}
                      monthsShown={1}
                      showPopperArrow={false}
                      inline
                      selectsRange={selectsRange}
                      locale="zh-TW"
                      dateFormat="yyyy年MM月dd日"
                      calendarClassName="w-[240px]"
                      minDate={new Date(new Date().setDate(new Date().getDate() + 3))}
                    />
                  }
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

export default ExperiencesDateSingleInput;
