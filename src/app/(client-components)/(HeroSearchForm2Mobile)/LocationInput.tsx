"use client";

import { MapPinIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef, FC } from "react";

interface Props {
  onClick?: () => void;
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  headingText?: string;
}

const HONG_KONG_DISTRICTS = [
  "中西區",
  "灣仔區",
  "東區",
  "南區",
  "油尖旺區",
  "深水埗區",
  "九龍城區",
  "黃大仙區",
  "觀塘區",
  "荃灣區",
  "屯門區",
  "元朗區",
  "北區",
  "大埔區",
  "西貢區",
  "沙田區",
  "葵青區",
  "離島區"
];

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
          {heading || "Destinations"}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {items.map((item) => {
            return (
              <div
                className="py-2 flex items-center space-x-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer rounded-lg"
                onClick={() => handleSelectLocation(item)}
                key={item}
              >
                <MapPinIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
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
            heading: "香港十八區",
            items: HONG_KONG_DISTRICTS,
          })}
        </div>
      </div>
    </div>
  );
};

export default LocationInput;
