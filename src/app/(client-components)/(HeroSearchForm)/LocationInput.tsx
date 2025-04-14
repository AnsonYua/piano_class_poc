"use client";

import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import React, { useState, useRef, useEffect, FC } from "react";
import ClearDataButton from "./ClearDataButton";
import { HONG_KONG_DISTRICTS } from "@/utils/locationData";

export interface LocationInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
}

const LocationInput: FC<LocationInputProps> = ({
  autoFocus = false,
  placeHolder = "地區",
  desc = "上課地區",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const [showPopover, setShowPopover] = useState(autoFocus);

  useEffect(() => {
    setShowPopover(autoFocus);
  }, [autoFocus]);

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
    setShowPopover(false);
  };

  const handleSelectLocation = (item: string) => {
    // Only allow selection of "北角"
    if (item !== "北角") return;
    
    setValue(item);
    setShowPopover(false);
  };

  const filteredDistricts = HONG_KONG_DISTRICTS.filter(district => 
    district.toLowerCase().includes(value.toLowerCase())
  );

  const renderSearchValues = () => {
    return (
      <>
        <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800 dark:text-neutral-100">
          搜尋結果
        </h3>
        <div className="mt-2 grid grid-cols-4 gap-2 px-4 sm:px-8">
          {filteredDistricts.map((district) => {
            const isActive = district === "北角";
            return (
              <span
                onClick={() => handleSelectLocation(district)}
                key={district}
                className={`flex items-center space-x-3 py-3 ${
                  isActive 
                    ? "hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer" 
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                <span className={`block ${isActive ? "text-neutral-400" : "text-neutral-200 dark:text-neutral-600"}`}>
                  <MapPinIcon className="h-4 w-4" />
                </span>
                <span className={`block font-medium ${
                  isActive 
                    ? "text-neutral-700 dark:text-neutral-200" 
                    : "text-neutral-400 dark:text-neutral-500"
                }`}>
                  {district}
                </span>
              </span>
            );
          })}
        </div>
      </>
    );
  };

  const renderRecentSearches = () => {
    return (
      <>
        <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800 dark:text-neutral-100">
         
        </h3>
        <div className="mt-2 grid grid-cols-4 gap-2 px-4 sm:px-8">
          {HONG_KONG_DISTRICTS.map((district) => {
            const isActive = district === "北角";
            return (
              <span
                onClick={() => handleSelectLocation(district)}
                key={district}
                className={`flex items-center space-x-3 py-3 ${
                  isActive 
                    ? "hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer" 
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                <span className={`block ${isActive ? "text-neutral-400" : "text-neutral-200 dark:text-neutral-600"}`}>
                  <MapPinIcon className="h-4 w-4" />
                </span>
                <span className={`block font-medium ${
                  isActive 
                    ? "text-neutral-700 dark:text-neutral-200" 
                    : "text-neutral-400 dark:text-neutral-500"
                }`}>
                  {district}
                </span>
              </span>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`flex z-10 flex-1 relative [ nc-hero-field-padding ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "nc-hero-field-focused" : ""
        }`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" />
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
              }}
            />
          )}
        </div>
      </div>

      {showPopover && (
        <div
          className={`h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 bg-white dark:bg-neutral-800 ${divHideVerticalLineClass}`}
        ></div>
      )}

      {showPopover && (
        <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[500px] bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-6 rounded-3xl shadow-xl max-h-96 overflow-y-auto">
          {value ? renderSearchValues() : renderRecentSearches()}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
