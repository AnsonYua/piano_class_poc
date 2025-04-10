"use client";

import { MapPinIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef, FC } from "react";
import { HONG_KONG_DISTRICTS } from "@/utils/locationData";

interface Props {
  onClick?: () => void;
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  headingText?: string;
}

const LocationInput: FC<Props> = ({
  onChange = () => {},
  className = "",
  defaultValue = "United States",
  headingText = "上課地點？",
}) => {
  const [value, setValue] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSelectLocation = (item: string) => {
    // Only allow selection of "北角"
    if (item !== "北角") return;
    
    // DO NOT REMOVE SETTIMEOUT FUNC
    setTimeout(() => {
      setValue(item);
      onChange && onChange(item);
    }, 0);
  };

  const renderSearchValues = ({
    heading,
    items,
  }: {
    heading: string;
    items: string[];
  }) => {
    return (
      <>
        <p className="block font-semibold text-base">
          {heading || ""}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {items.map((item) => {
            const isActive = item === "北角";
            return (
              <div
                className={`py-2 flex items-center space-x-3 text-sm ${
                  isActive 
                    ? "hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer" 
                    : "opacity-40 cursor-not-allowed"
                } rounded-lg`}
                onClick={() => handleSelectLocation(item)}
                key={item}
              >
                <MapPinIcon className={`w-5 h-5 ${isActive ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-300 dark:text-neutral-600"}`} />
                <span className="truncate">{item}</span>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className={`${className}`} ref={containerRef}>
      <div className="p-5">
        <span className="block font-semibold text-xl sm:text-2xl">
          {headingText}
        </span>
        <div className="relative mt-5">
          <input
            className={`block w-full bg-transparent border px-4 py-3 pr-12 border-neutral-900 dark:border-neutral-200 rounded-xl focus:ring-0 focus:outline-none text-base leading-none placeholder-neutral-500 dark:placeholder-neutral-300 truncate font-bold placeholder:truncate`}
            placeholder={"選擇地區"}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            ref={inputRef}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-400" />
          </span>
        </div>
        <div className="mt-7">
          {renderSearchValues({
            heading: "",
            items: HONG_KONG_DISTRICTS,
          })}
        </div>
      </div>
    </div>
  );
};

export default LocationInput;
