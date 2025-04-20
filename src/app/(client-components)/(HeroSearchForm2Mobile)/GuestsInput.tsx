"use client";
import React, { useEffect, useState } from "react";
import NcInputNumber from "@/components/NcInputNumber";
import { FC } from "react";
import { GuestsObject } from "../type";

export interface GuestsInputProps {
  defaultValue?: GuestsObject;
  onChange?: (data: GuestsObject) => void;
  className?: string;
  onClose?: () => void;
  onServiceTypeSelect?: (serviceType: string) => void;
  selectedStudent?: string | null;
  studentGrade?: string | null;
  showError?: boolean;
}

const GuestsInput: FC<GuestsInputProps> = ({
  defaultValue,
  onChange,
  className = "",
  onClose,
  onServiceTypeSelect,
  selectedStudent = null,
  studentGrade = null,
  showError = false,
}) => {
  const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(
    defaultValue?.guestAdults || 0
  );
  const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(
    defaultValue?.guestChildren || 0
  );
  const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(
    defaultValue?.guestInfants || 0
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);

  useEffect(() => {
    setGuestAdultsInputValue(defaultValue?.guestAdults || 0);
  }, [defaultValue?.guestAdults]);
  useEffect(() => {
    setGuestChildrenInputValue(defaultValue?.guestChildren || 0);
  }, [defaultValue?.guestChildren]);
  useEffect(() => {
    setGuestInfantsInputValue(defaultValue?.guestInfants || 0);
  }, [defaultValue?.guestInfants]);

  // Dynamically set service type options based on selectedStudent/studentGrade
  useEffect(() => {
    if (!selectedStudent) {
      setServiceOptions([]);
    } else if (studentGrade) {
      setServiceOptions(["上堂", "練琴"]);
    } else {
      setServiceOptions(["評估"]);
    }
  }, [selectedStudent, studentGrade]);

  const handleChangeData = (value: number, type: keyof GuestsObject) => {
    let newValue = {
      guestAdults: guestAdultsInputValue,
      guestChildren: guestChildrenInputValue,
      guestInfants: guestInfantsInputValue,
    };
    if (type === "guestAdults") {
      setGuestAdultsInputValue(value);
      newValue.guestAdults = value;
    }
    if (type === "guestChildren") {
      setGuestChildrenInputValue(value);
      newValue.guestChildren = value;
    }
    if (type === "guestInfants") {
      setGuestInfantsInputValue(value);
      newValue.guestInfants = value;
    }
    onChange && onChange(newValue);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (onServiceTypeSelect) {
      onServiceTypeSelect(option);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`flex flex-col relative p-5 ${className}`}>
      <span className="mb-5 block font-semibold text-xl sm:text-2xl">
        {`選擇服務類型`}
      </span>
      {showError && !selectedStudent && (
        <div className="text-red-500 text-sm mb-3">請先選擇學生</div>
      )}
      <div className="space-y-4">
        {serviceOptions.length === 0 && (
          <div className="text-neutral-400 text-sm">請先選擇學生以顯示服務類型</div>
        )}
        {serviceOptions.map((option) => (
          <button
            key={option}
            className={`w-full p-4 text-left rounded-lg border ${
              selectedOption === option
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => handleOptionSelect(option)}
            disabled={!selectedStudent}
          >
            <div className="font-medium">{option}</div>
            <div className="text-sm text-gray-500">
              {option === "評估" ? "預約評估時間" : option === "上堂" ? "預約上課時間" : option === "練琴" ? "預約練琴時間" : ""}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GuestsInput;
