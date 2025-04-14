"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";
import React, { useState, useRef, useEffect, FC } from "react";
import ClearDataButton from "../../(HeroSearchForm)/ClearDataButton";
import { HONG_KONG_DISTRICTS } from "@/utils/locationData";
import { usePopover } from "./PopoverContext";

export interface LocationInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
  enabledDistricts?: string[];
}

const LocationInput: FC<LocationInputProps> = ({
  autoFocus = false,
  placeHolder = "地區",
  desc = "上課地區",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 right-0.5",
  defaultValue = "",
  onChange,
  enabledDistricts = HONG_KONG_DISTRICTS,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { activePopover, setActivePopover } = usePopover();
  const popoverId = "location-input";

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

  const handleSelectLocation = (item: string) => {
    setValue(item);
    if (onChange) {
      onChange(item);
    }
    setActivePopover(null);
  };

  const filteredDistricts = HONG_KONG_DISTRICTS.filter(district => 
    district.toLowerCase().includes(value.toLowerCase())
  );

  const renderSearchValues = () => {
    return (
      <>
        <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800 dark:text-neutral-100">
          選擇地區
        </h3>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 sm:px-8">
          {filteredDistricts.map((district) => {
            const isEnabled = enabledDistricts.includes(district);
            return (
              <span
                onClick={() => isEnabled && handleSelectLocation(district)}
                key={district}
                className={`flex items-center space-x-3 py-3 ${
                  isEnabled 
                    ? "hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer" 
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <span className="block text-neutral-400">
                  <MapPinIcon className="h-4 w-4" />
                </span>
                <span className="block font-medium text-neutral-700 dark:text-neutral-200">
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
    <div className={`relative flex ${className} `} ref={containerRef}>
      <div
        onClick={() => setActivePopover(popoverId)}
        className={`flex z-10 flex-1 relative [ nc-hero-field-padding ]flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "nc-hero-field-focused rounded-none" : ""
        }`}
        style={showPopover ? { borderRadius: '0' } : undefined}
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
        <div className="absolute right-1 translate-x-1 z-50 w-full min-w-[300px] sm:min-w-[500px] bg-white dark:bg-neutral-800 top-full mt-3 py-3 sm:py-6 rounded-none shadow-xl max-h-96 overflow-y-auto">
          {renderSearchValues()}
        </div>
      )}
    </div>
  );
};

export default LocationInput; 