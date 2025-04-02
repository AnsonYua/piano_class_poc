"use client";

import React, { Fragment, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { FC } from "react";
import ClearDataButton from "./ClearDataButton";
import ButtonSubmit from "./ButtonSubmit";
import { PathName } from "@/routers/types";
import { UserPlusIcon } from "@heroicons/react/24/outline";

export interface GuestsInputProps {
  fieldClassName?: string;
  className?: string;
  buttonSubmitHref?: PathName;
  hasButtonSubmit?: boolean;
}

const GuestsInput: FC<GuestsInputProps> = ({
  fieldClassName = "[ nc-hero-field-padding ]",
  className = "[ nc-flex-1 ]",
  buttonSubmitHref = "/listing-stay-map",
  hasButtonSubmit = true,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = [
    { id: "assessment", label: "參加評估" },
    { id: "lesson", label: "上堂" },
  ];

  const handleOptionClick = (label: string, close: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedOption(label);
    close();
  };

  return (
    <Popover className={`flex relative ${className}`}>
      {({ open, close }) => (
        <>
          <div
            className={`flex-1 z-10 flex items-center focus:outline-none ${
              open ? "nc-hero-field-focused" : ""
            }`}
          >
            <Popover.Button
              className={`relative z-10 flex-1 flex text-left items-center ${fieldClassName} space-x-3 focus:outline-none`}
            >
              <div className="text-neutral-300 dark:text-neutral-400">
                <UserPlusIcon className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="flex-grow">
                <span className="block xl:text-lg font-semibold">
                  {selectedOption || "類型"}
                </span>
                <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
                  參加評估還是上堂？
                </span>
              </div>

              {selectedOption && open && (
                <ClearDataButton
                  onClick={() => {
                    setSelectedOption(null);
                  }}
                />
              )}
            </Popover.Button>

            {hasButtonSubmit && (
              <div className="pr-2 xl:pr-4">
                <ButtonSubmit href={buttonSubmitHref} />
              </div>
            )}
          </div>

          {open && (
            <div className="h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -left-0.5 right-0.5 bg-white dark:bg-neutral-800"></div>
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
            <Popover.Panel className="absolute right-0 z-10 w-full sm:min-w-[400px] max-w-md bg-white dark:bg-neutral-800 top-full mt-3 py-5 sm:py-6 px-4 sm:px-8 rounded-3xl shadow-xl">
              <div className="space-y-4">
                {options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={handleOptionClick(option.label, close)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedOption === option.label
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default GuestsInput;
