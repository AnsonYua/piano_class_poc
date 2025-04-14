"use client";

import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LocationInput from "./components/LocationInput";
import DateInput from "./components/DateInput";
import TimeInput from "./components/TimeInput";
import StudentInput from "./components/StudentInput";
import TypeInput from "./components/TypeInput";
import SearchButton from "./components/SearchButton";
import { PopoverProvider } from "./components/PopoverContext";

export interface HeroSearchFormRectProps {
  className?: string;
  defaultValues?: {
    section?: string;
    district?: string;
    date?: string;
    time?: string;
    student?: string;
    type?: string;
  };
}

const HeroSearchFormRect: FC<HeroSearchFormRectProps> = ({
  className = "",
  defaultValues = {},
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, redirectToLogin } = useAuth();
  
  const [district, setDistrict] = useState<string | null>(defaultValues.district || null);
  const [date, setDate] = useState<Date | null>(defaultValues.date ? new Date(defaultValues.date) : null);
  const [time, setTime] = useState<string | null>(defaultValues.time || null);
  const [student, setStudent] = useState<string | null>(defaultValues.student || null);
  const [type, setType] = useState<string | null>(defaultValues.type || null);

  const handleSearch = () => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      // User is not logged in, redirect to login page
      redirectToLogin();
      return;
    }
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (district) params.append("district", district);
    if (date) params.append("date", date.toISOString().split("T")[0]);
    if (time) params.append("time", time);
    if (student) params.append("student", student);
    if (type) params.append("type", type);
    
    // Navigate to room availability page with query parameters
    router.push(`/room-availability?${params.toString()}` as any);
  };

  return (
    <PopoverProvider>
      <div className={`w-full max-w-10xl mx-auto ${className}`}>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-4">
          {/* First Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <LocationInput 
                defaultValue={district || ""} 
                onChange={(value) => setDistrict(value)}
                className="border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
              />
            </div>
            <div className="flex-1">
              <DateInput 
                defaultValue={date} 
                onChange={(value) => setDate(value)}
                className="border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
              />
            </div>
            <div className="flex-1">
              <TimeInput 
                defaultValue={time || ""} 
                onChange={(value) => setTime(value)}
                className="border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
              />
            </div>
          </div>
          
          {/* Second Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <StudentInput 
                defaultValue={student || ""} 
                onChange={(value) => setStudent(value)}
                className="border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
              />
            </div>
            <div className="flex-1">
              <TypeInput 
                defaultValue={type || ""} 
                onChange={(value) => setType(value)}
                className="border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
              />
            </div>
            <div className="flex items-center justify-end md:justify-end mt-4 md:mt-0">
              <SearchButton 
                onClick={handleSearch} 
                className="w-full md:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </PopoverProvider>
  );
};

export default HeroSearchFormRect; 