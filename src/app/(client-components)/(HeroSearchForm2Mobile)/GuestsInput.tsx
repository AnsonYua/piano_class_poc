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
}

const GuestsInput: FC<GuestsInputProps> = ({
  defaultValue,
  onChange,
  className = "",
  onClose,
  onServiceTypeSelect,
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

  useEffect(() => {
    setGuestAdultsInputValue(defaultValue?.guestAdults || 0);
  }, [defaultValue?.guestAdults]);
  useEffect(() => {
    setGuestChildrenInputValue(defaultValue?.guestChildren || 0);
  }, [defaultValue?.guestChildren]);
  useEffect(() => {
    setGuestInfantsInputValue(defaultValue?.guestInfants || 0);
  }, [defaultValue?.guestInfants]);

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
    
    // Notify parent component about the selected service type
    if (onServiceTypeSelect) {
      onServiceTypeSelect(option);
    }
    
    // Close the picker after selection
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`flex flex-col relative p-5 ${className}`}>
      <span className="mb-5 block font-semibold text-xl sm:text-2xl">
        {`選擇服務類型`}
      </span>
      
      <div className="space-y-4">
        <button 
          className={`w-full p-4 text-left rounded-lg border ${
            selectedOption === "參加評估" 
              ? "bg-blue-50 border-blue-500 text-blue-700" 
              : "border-gray-200 hover:border-blue-300"
          }`}
          onClick={() => handleOptionSelect("參加評估")}
        >
          <div className="font-medium">參加評估</div>
          <div className="text-sm text-gray-500">預約評估時間</div>
        </button>
        
        <button 
          className={`w-full p-4 text-left rounded-lg border ${
            selectedOption === "上堂" 
              ? "bg-blue-50 border-blue-500 text-blue-700" 
              : "border-gray-200 hover:border-blue-300"
          }`}
          onClick={() => handleOptionSelect("上堂")}
        >
          <div className="font-medium">上堂</div>
          <div className="text-sm text-gray-500">預約上課時間</div>
        </button>
      </div>
    </div>
  );
};

export default GuestsInput;
