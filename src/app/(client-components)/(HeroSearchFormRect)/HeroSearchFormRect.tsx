"use client";

import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/context/BookingContext";
import LocationInput from "./components/LocationInput";
import DateInput from "./components/DateInput";
import TimeInput from "./components/TimeInput";
import StudentInput from "./components/StudentInput";
import TypeInput from "./components/TypeInput";
import SearchButton from "./components/SearchButton";
import { PopoverProvider } from "./components/PopoverContext";
import { ApiUtils } from "@/utils/ApiUtils";
import { UserTypeUtils } from "@/utils/UserTypeUtils";
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
  const { isAuthenticated, isLoading, redirectToLogin, onProfileLoaded } = useAuth();
  const { setBookingParams } = useBooking();
  
  const [district, setDistrict] = useState<string | null>(defaultValues.district || null);
  const [date, setDate] = useState<Date | null>(defaultValues.date ? new Date(defaultValues.date) : null);
  const [time, setTime] = useState<string | null>(defaultValues.time || null);
  const [student, setStudent] = useState<string | null>(defaultValues.student || null);
  const [type, setType] = useState<string | null>(defaultValues.type || null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [students, setStudents] = useState<Array<{ id: string; name: string; grade?: string | null }>>([]);
  const [selectedStudentGrade, setSelectedStudentGrade] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Example of enabled districts - you can customize this list
  const enabledDistricts = ["北角"];

  const getDefaultDate = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 3);
      return tomorrow;
  };
  useEffect(() => {
    setDate(getDefaultDate());
  }, []);

  // Function to update available time slots based on selected fields
  const updateAvailableTimeSlots = async (
    _student: string | null,
    _type: string | null,
    _district: string | null,
    _date: Date | null
  ) => {
    // Reset available time slots if any required field is missing
    if (!_student || !_type || !_district || !_date) {
      setAvailableTimeSlots([]);
      return;
    }

    const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
    const token = localStorage.getItem(`${userType}_auth_token`);

    if (!token) {
      setAvailableTimeSlots([]);
      return;
    }

    const requestData = {
      type: _type,
      district: _district,
      date: _date ? formatDateToUTC8(_date) : null,
    };

    try {
      const response = await fetch(ApiUtils.getApiUrl("api/piano-rooms/availabilitySlot"), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response data:', data);
      const timeSlots = [
        "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
        "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
        "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
        "21:00", "21:30", "22:00"
      ];
      // Extract available time slots from the response
      if (data ) {
        if (data.data.isDateAvailable === false) {
          setAvailableTimeSlots([]);
        } else {
          let blockedSlots: string[] = []; // Specify the type of blockedSlots
          blockedSlots.push("aaa")
          data.data.unAvailableSlots.forEach((slot: any) => {
            let idx: number = parseInt(slot.replace("section", ""), 10); // Corrected line
            blockedSlots.push(timeSlots[idx - 1]);
          });
          setAvailableTimeSlots(blockedSlots); // Move this outside the loop
        }
      } else {
        // If no data is available, set an empty array
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('Error making request:', error);
      setAvailableTimeSlots([]);
    }
  };

  // Register callback to receive profile data when it's loaded
  useEffect(() => {
    
    const cleanup = onProfileLoaded((profile) => {
      if (profile) {
        console.log("Profile loaded in HeroSearchFormRect:", JSON.stringify(profile));
        console.log("Set students:", JSON.stringify(profile.user.student));
         //alert(JSON.stringify(profile));
        //alert(JSON.stringify(profile));
        // Extract students from profile if available
        if (profile && profile.user.student) {
          
          setStudents(profile.user.student.map((std: any) => ({
            id: std.id || std._id || String(Math.random()),
            name: std.name || std.fullName || "未命名學生",
            grade: std.grade || null
          })));
        } else {
          setStudents([]);
        }
        setUserProfile(profile);
      }
    });
    
    // Clean up the callback when component unmounts
    return cleanup;
  }, [onProfileLoaded]);

  // Update selected student grade when student changes
  useEffect(() => {
    if (student && students.length > 0) {
      const selectedStudent = students.find(s => s.name === student);
      if (selectedStudent) {
        setSelectedStudentGrade(selectedStudent.grade || null);
      } else {
        setSelectedStudentGrade(null);
      }
    } else {
      setSelectedStudentGrade(null);
    }
  }, [student, students]);

  // Handle student change and reset other form fields
  const handleStudentChange = (student: string | null) => {
    setStudent(student);
    setType("");
    updateAvailableTimeSlots(student, type, district, date);
  };

  // Handle type change and reset other form fields
  const handleTypeChange = (type: string | null) => {
    setType(type);
    updateAvailableTimeSlots(student, type, district, date);
    // Reset other fields if needed
  };

  // Handle location change and reset other form fields
  const handleLocationChange = (location: string | null) => {
    setDistrict(location);
    updateAvailableTimeSlots(student, type, location, date);
    // Reset other fields if needed
  };

  // Handle date change and reset other form fields
  const handleDateChange = (date: Date | null) => {
    setDate(date);
    updateAvailableTimeSlots(student, type, district, date);
    // Reset other fields if needed
  };

  const formatDateToUTC8 = (date: Date) => {
    // Clone the date to avoid mutating the original
    const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    // Get the date in ISO format, but only the date part
    return utc8Date.toISOString().split("T")[0];
  };
  const handleSearch = () => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      // User is not logged in, redirect to login page
      redirectToLogin();
      return;
    }
    
    // Set booking parameters in context
    setBookingParams({
      district,
      date: date ? formatDateToUTC8(date) : null,
      time,
      student,
      type,
    });
    
    // Navigate to confirm-booking page
    router.push('/confirm-booking');
  };

  return (
    <PopoverProvider>
      <div className={`w-full max-w-10xl mx-auto ${className}`}>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-4">
          {/* First Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <StudentInput 
                defaultValue={student || ""} 
                onChange={(value) => setStudent(value)}
                onStudentChange={handleStudentChange}
                className="border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
                students={students}
              />
            </div>
            <div className="flex-1">
              <TypeInput 
                defaultValue={type || ""} 
                onChange={(value) => setType(value)}
                onTypeChange={handleTypeChange}
                className="border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
                selectedStudent={student}
                studentGrade={selectedStudentGrade}
              />
            </div>
            <div className="flex-1">
              <LocationInput 
                defaultValue={district || ""} 
                onChange={(value) => setDistrict(value)}
                onLocationChange={handleLocationChange}
                className="border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
                enabledDistricts={enabledDistricts}
              />
            </div>
          </div>
          
          {/* Second Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
            <DateInput 
                defaultValue={date} 
                onChange={(value) => setDate(value)}
                onDateChange={handleDateChange}
                className="border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
              />
              
            </div>
            <div className="flex-1">
              <TimeInput 
                defaultValue={time || ""} 
                onChange={(value) => setTime(value)}
                className="border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
                availableTimeSlots={availableTimeSlots}
                selectedStudent={student}
                selectedType={type}
                selectedDistrict={district}
                selectedDate={date}
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