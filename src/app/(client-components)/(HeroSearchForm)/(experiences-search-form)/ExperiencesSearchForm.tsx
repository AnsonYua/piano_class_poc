import React, { FC, useState, useEffect } from "react";
import LocationInput from "../LocationInput";
import GuestsInput from "../GuestsInput";
import ExperiencesDateSingleInput from "./ExperiencesDateSingleInput";
import ClassTimeSlotInput from "./ClassTimeSlotInput";
import { PathName } from "@/routers/types";
import ButtonSubmit from "../ButtonSubmit";

export interface ExperiencesSearchFormProps {
  onSearch?: () => void;
  defaultValues?: {
    section?: string;
    district?: string;
    date?: string;
  };
}

const ExperiencesSearchForm: FC<ExperiencesSearchFormProps> = ({ onSearch, defaultValues }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  useEffect(() => {
    // Set default values if provided
    if (defaultValues) {
      if (defaultValues.district) {
        setSelectedDistrict(defaultValues.district);
      }
      if (defaultValues.section) {
        setSelectedSection(defaultValues.section);
      }
      if (defaultValues.date) {
        const date = new Date(defaultValues.date);
        if (!isNaN(date.getTime())) {
          setSelectedDate(date);
        }
      }
    }
  }, [defaultValues]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
  };

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
  };

  const handleSearch = () => {
    // Handle form submission here
    console.log("Form submitted with time:", selectedTime);
    console.log("Form submitted with date:", selectedDate);
    console.log("Form submitted with district:", selectedDistrict);
    console.log("Form submitted with section:", selectedSection);
    
    // Call the onSearch callback if provided
    if (onSearch) {
      onSearch();
    }
  };

  const renderForm = () => {
    // Check if we're on the room-availability page
    const isRoomAvailabilityPage = typeof window !== 'undefined' && 
      window.location.pathname.includes('/room-availability');
    
    return (
      <form className={`w-full relative mt-0 mb-0 flex flex-col md:flex-row ${
        isRoomAvailabilityPage ? 'rounded-none shadow-none bg-transparent' : 'rounded-3xl md:rounded-full shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800'
      } mx-auto max-w-10xl`}>
        <LocationInput 
          className="flex-1" 
          defaultValue={selectedDistrict}
          onChange={handleDistrictSelect}
        />
        
        <div className="self-center border-r border-slate-200 dark:border-slate-700 h-4"></div>
        <ExperiencesDateSingleInput 
          className="flex-1" 
          selectsRange={false} 
          defaultValue={selectedDate}
          onChange={handleDateSelect}
        />
        <div className="self-center border-r border-slate-200 dark:border-slate-700 h-4"></div>
        <ClassTimeSlotInput
          className="flex-1"
          selectedTime={selectedTime}
          onTimeSelect={handleTimeSelect}
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
