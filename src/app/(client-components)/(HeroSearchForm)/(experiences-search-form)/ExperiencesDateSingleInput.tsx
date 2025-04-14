"use client";

import React, { Fragment, useState, FC, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import ClearDataButton from "../ClearDataButton";
import { registerLocale } from "react-datepicker";
import zhTW from "date-fns/locale/zh-TW";
import DatePicker from "react-datepicker";
// Register Traditional Chinese locale
registerLocale("zh-TW", zhTW);

export interface ExperiencesDateSingleInputProps {
  className?: string;
  fieldClassName?: string;
  selectsRange?: boolean;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
}

const ExperiencesDateSingleInput: FC<ExperiencesDateSingleInputProps> = ({
  className = "",
  fieldClassName = "[ nc-hero-field-padding ]",
  selectsRange = false,
  defaultValue = null,
  onChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      setSelectedDate(defaultValue);
    }
  }, [defaultValue]);

  const onChangeDate = (date: Date | null) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
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
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  // Calculate the minimum date (current date - 2 days)
  const getMinDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 2);
    return minDate;
  };

  return (
    <>
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
              <Popover.Panel className="absolute left-1/2 z-50 mt-3 top-full -translate-x-1/2 w-[90vw] sm:w-auto">
                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-4">
                  <DatePicker
                    selected={selectedDate || getDefaultDate()}
                    onChange={(date: Date | null) => {
                      onChangeDate(date);
                      close();
                    }}
                    monthsShown={2}
                    showPopperArrow={false}
                    inline
                    selectsRange={selectsRange}
                    peekNextMonth={true}
                    showPreviousMonths={false}
                    showMonthYearPicker={false}
                    showYearPicker={false}
                    showQuarterYearPicker={false}
                    showTimeSelect={false}
                    showTimeSelectOnly={false}
                    showWeekNumbers={false}
                    showTwoColumnMonthYearPicker={false}
                    showFourColumnMonthYearPicker={false}
                    locale="zh-TW"
                    dateFormat="yyyy年MM月dd日"
                    minDate={getMinDate()}
                    renderCustomHeader={(p: any) => (
                      <DatePickerCustomHeaderTwoMonth {...p} />
                    )}
                    renderDayContents={(day: number, date: Date) => (
                      <DatePickerCustomDay dayOfMonth={day} date={date} />
                    )}
                    calendarClassName="w-full sm:w-[600px]"
                    wrapperClassName="w-full sm:w-[600px]"
                    popperClassName="w-full sm:w-[600px]"
                  />
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
