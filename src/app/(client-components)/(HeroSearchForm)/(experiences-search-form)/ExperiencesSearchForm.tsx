import React, { FC, useState } from "react";
import LocationInput from "../LocationInput";
import GuestsInput from "../GuestsInput";
import ExperiencesDateSingleInput from "./ExperiencesDateSingleInput";
import ClassTimeSlotInput from "./ClassTimeSlotInput";
import { PathName } from "@/routers/types";
import ButtonSubmit from "../ButtonSubmit";

export interface ExperiencesSearchFormProps {
  onSearch?: () => void;
}

const ExperiencesSearchForm: FC<ExperiencesSearchFormProps> = ({ onSearch }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSearch = () => {
    // Handle form submission here
    console.log("Form submitted with time:", selectedTime);
    
    // Call the onSearch callback if provided
    if (onSearch) {
      onSearch();
    }
  };

  const renderForm = () => {
    return (
      <form className="w-full relative mt-6 mb-6 flex flex-col md:flex-row rounded-3xl md:rounded-full shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800 mx-auto max-w-10xl">
        <LocationInput className="flex-1" />
        
        <div className="self-center border-r border-slate-200 dark:border-slate-700 h-4"></div>
        <ExperiencesDateSingleInput className="flex-1" selectsRange={false} />
        <div className="self-center border-r border-slate-200 dark:border-slate-700 h-4"></div>
        <ClassTimeSlotInput
          className="flex-1"
          selectedTime={selectedTime}
          onTimeSelect={handleTimeSelect}
        />
        <div className="self-center border-r border-slate-200 dark:border-slate-700 h-4"></div>
        <GuestsInput
          className="flex-1"
          hasButtonSubmit={false}
        />
        
        <div className="flex items-center justify-center px-4 py-3">
          <ButtonSubmit 
            onClick={handleSearch}
          />
        </div>
      </form>
    );
  };

  return renderForm();
};

export default ExperiencesSearchForm;
