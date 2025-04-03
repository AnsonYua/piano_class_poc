"use client";

import converSelectedDateToString from "@/utils/converSelectedDateToString";
import React, { useState, useEffect } from "react";
import { GuestsObject } from "../../type";
import GuestsInput from "../GuestsInput";
import LocationInput from "../LocationInput";
import DatesRangeInput from "../DatesRangeInput";
import TimeSlotInput from "./TimeSlotInput";

const StaySearchForm = () => {
  //
  const [fieldNameShow, setFieldNameShow] = useState<
    "location" | "dates" | "guests" | "time" | ""
  >("location");
  //
  const [locationInputTo, setLocationInputTo] = useState("");
  const [guestInput, setGuestInput] = useState<GuestsObject>({
    guestAdults: 0,
    guestChildren: 0,
    guestInfants: 0,
  });
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Get tomorrow's date (current date + 1 day)
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(getTomorrowDate());
  //

  // Format date to Japanese format (YYYY年M月D日)
  const formatDateToJapanese = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleCloseDatePicker = () => {
    setFieldNameShow("guests");
  };

  const handleServiceTypeChange = (data: GuestsObject) => {
    setGuestInput(data);
  };

  const handleServiceTypeSelect = (serviceType: string) => {
    setSelectedServiceType(serviceType);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const renderInputLocation = () => {
    const isActive = fieldNameShow === "location";
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("location")}
          >
            <span className="text-neutral-400">Where</span>
            <span>{locationInputTo || "Location"}</span>
          </button>
        ) : (
          <LocationInput
            defaultValue={locationInputTo}
            onChange={(value) => {
              setLocationInputTo(value);
              setFieldNameShow("dates");
            }}
          />
        )}
      </div>
    );
  };

  const renderInputDates = () => {
    const isActive = fieldNameShow === "dates";

    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4  `}
            onClick={() => setFieldNameShow("dates")}
          >
            <span className="text-neutral-400">When</span>
            <span>
              {selectedDate
                ? formatDateToJapanese(selectedDate)
                : "Add date"}
            </span>
          </button>
        ) : (
          <DatesRangeInput 
            onDateChange={handleDateChange} 
            onClose={handleCloseDatePicker}
          />
        )}
      </div>
    );
  };

  const renderInputGuests = () => {
    const isActive = fieldNameShow === "guests";

    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("guests")}
          >
            <span className="text-neutral-400">服務類型</span>
            <span>{selectedServiceType || "選擇服務類型"}</span>
          </button>
        ) : (
          <GuestsInput 
            defaultValue={guestInput} 
            onChange={handleServiceTypeChange} 
            onServiceTypeSelect={handleServiceTypeSelect}
            onClose={() => {
              setFieldNameShow("");
              // After selection, we don't automatically move to another field
            }}
          />
        )}
      </div>
    );
  };

  const renderInputTime = () => {
    const isActive = fieldNameShow === "time";

    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("time")}
          >
            <span className="text-neutral-400">上課時間</span>
            <span>{selectedTime || "選擇時間"}</span>
          </button>
        ) : (
          <TimeSlotInput 
            selectedTime={selectedTime}
            onTimeSelect={handleTimeSelect}
            onClose={() => {
              setFieldNameShow("");
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="w-full space-y-5">
        {/*  */}
        {renderInputLocation()}
        {/*  */}
        {renderInputDates()}
        {/*  */}
        {renderInputGuests()}
        {/*  */}
        {renderInputTime()}
      </div>
    </div>
  );
};

export default StaySearchForm;
