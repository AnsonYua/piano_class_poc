"use client";

import converSelectedDateToString from "@/utils/converSelectedDateToString";
import React, { useState, useEffect } from "react";
import { GuestsObject } from "../../type";
import GuestsInput from "../GuestsInput";
import LocationInput from "../LocationInput";
import StayDatesRangeInput from "../DatesRangeInput";
import TimeSlotInput from "./TimeSlotInput";
import StudentDropdown from "../StudentDropdown";
import { ApiUtils } from "@/utils/ApiUtils";
import { UserTypeUtils } from "@/utils/UserTypeUtils";

interface StaySearchFormProps {
  onSubmit?: (fields: {
    student: string;
    type: string | null;
    location: string;
    date: Date | null;
    time: string | null;
    guestInput: GuestsObject;
    studentGrade: string | null;
  }) => void;
  submitTrigger?: number;
}

const StaySearchForm: React.FC<StaySearchFormProps> = ({ onSubmit, submitTrigger }) => {
  //
  const [fieldNameShow, setFieldNameShow] = useState<
    "location" | "dates" | "guests" | "time" | "student" | ""
  >("student");
  //
  const [locationInputTo, setLocationInputTo] = useState("");
  const [guestInput, setGuestInput] = useState<GuestsObject>({
    guestAdults: 0,
    guestChildren: 0,
    guestInfants: 0,
  });
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [studentGrade, setStudentGrade] = useState<string | null>(null);
  // Get tomorrow's date (current date + 1 day)
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };
  //
  const [selectedDate, setSelectedDate] = useState<Date | null>(getTomorrowDate());
  //
  const [profile, setProfile] = useState<any>(null);
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [showTimeSlotError, setShowTimeSlotError] = useState(false);

  // Format date to Japanese format (YYYY年M月D日)
  const formatDateToJapanese = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  // Utility to format Date as yyyy-mm-dd
  const formatDateYYYYMMDD = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleCloseDatePicker = () => {
    //setFieldNameShow("guests");
    setFieldNameShow("time")
  };

  const handleServiceTypeChange = (data: GuestsObject) => {
    setGuestInput(data);
  };

  const handleServiceTypeSelect = (serviceType: string) => {
    setSelectedServiceType(serviceType);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleStudentChange = (student: string) => {
    //setSelectedStudent(student);
  };

  useEffect(() => {
    if (!selectedStudent) {
      setStudentGrade(null);
      setSelectedServiceType(null);
      return;
    }
    // Find the selected student in the original profile data
    let studentObj = null;
    if (profile && profile.user && Array.isArray(profile.user.student)) {
      studentObj = profile.user.student.find((std: any, idx: number) => {
        // Match by id (with index suffix) or by name
        const mappedId = (std._id || std.id || std.name || String(idx)) + '-' + idx;
        return selectedStudent === mappedId || selectedStudent === std.name;
      });
    }
    if (studentObj && studentObj.grade) {
      setStudentGrade(studentObj.grade);
    } else {
      setStudentGrade(null);
    }
    setSelectedServiceType(null);
  }, [selectedStudent, profile]);

  useEffect(() => {
    const fetchProfileAndStudents = async () => {
      const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
      const url = ApiUtils.getUserProfileUrl(userType);
      const profileData = await ApiUtils.makeAuthenticatedRequest(url, 'GET', null, userType);
      setProfile(profileData);
      // Use profile.user as the root for student extraction
      let userObj = profileData && profileData.user ? profileData.user : profileData;
      let studentsArr = null;
      if (userObj && Array.isArray(userObj.student)) {
        studentsArr = userObj.student;
      } else if (userObj && Array.isArray(userObj.students)) {
        studentsArr = userObj.students;
      } else if (userObj && userObj.data && Array.isArray(userObj.data.students)) {
        studentsArr = userObj.data.students;
      } else if (userObj && Array.isArray(userObj.children)) {
        studentsArr = userObj.children;
      } else if (userObj && userObj.data && Array.isArray(userObj.data.children)) {
        studentsArr = userObj.data.children;
      }
      // Fallback: Try to extract students from any array property in the user object
      if (!studentsArr && userObj) {
        for (const key of Object.keys(userObj)) {
          if (Array.isArray(userObj[key]) && userObj[key].length > 0 && (userObj[key][0].name || userObj[key][0].fullName)) {
            studentsArr = userObj[key];
            break;
          }
        }
      }
      if (studentsArr) {
        // Guarantee unique keys even if _id is duplicated
        setStudents(studentsArr.map((std: any, idx: number) => {
          let idBase = std._id || std.id || std.name || String(idx);
          let id = idBase + '-' + idx; // force uniqueness
          let name = std.name || std.fullName || std.nickname || std.displayName || String(std) || "未命名學生";
          return { id, name };
        }));
      } else {
        setStudents([]);
      }
    };
    fetchProfileAndStudents();
  }, []);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedStudent || !selectedServiceType || !locationInputTo || !selectedDate) {
        setAvailableTimeSlots([]);
        return;
      }
      setLoadingSlots(true);
      setSlotsError(null);
      try {
        const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
        const token = localStorage.getItem(`${userType}_auth_token`);
        if (!token) {
          setAvailableTimeSlots([]);
          setLoadingSlots(false);
          return;
        }
        //alert(selectedDate);
        const requestData = {
          type: selectedServiceType,
          district: locationInputTo,
          date: selectedDate
            ? formatDateYYYYMMDD(selectedDate)
            : null,
        };
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
        // The time slots must match those generated in TimeSlotInput
        const timeSlots: string[] = [];
        let currentTime = new Date();
        currentTime.setHours(9, 30, 0);
        while (currentTime.getHours() < 22 || (currentTime.getHours() === 22 && currentTime.getMinutes() === 0)) {
          const hours = currentTime.getHours();
          const minutes = currentTime.getMinutes();
          const period = hours >= 12 ? "PM" : "AM";
          const displayHours = hours % 12 || 12;
          timeSlots.push(`${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`);
          currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
        let available = [...timeSlots];
        if (data && data.data) {
          if (data.data.isDateAvailable === false) {
            available = [];
          } else if (Array.isArray(data.data.unAvailableSlots)) {
            // Remove unavailable slots
            const blocked = data.data.unAvailableSlots.map((slot: any) => {
              let idx = parseInt(slot.replace("section", ""), 10);
              return timeSlots[idx - 1];
            });
            available = timeSlots.filter((slot) => !blocked.includes(slot));
          }
        } else {
          available = [];
        }
        console.log("available", available);
        console.log("available 2", JSON.stringify(data.data));
        setAvailableTimeSlots(available);
        setLoadingSlots(false);
      } catch (err: any) {
        setAvailableTimeSlots([]);
        setSlotsError(err?.message || 'Error fetching time slots');
        setLoadingSlots(false);
      }
    };
    fetchAvailableSlots();
  }, [selectedStudent, selectedServiceType, locationInputTo, selectedDate]);

  useEffect(() => {
    if (submitTrigger && onSubmit) {
      const studentId = Number(selectedStudent.split("-")[1]);
      onSubmit({
        student: students[studentId]?.name,
        type: selectedServiceType,
        location: locationInputTo,
        date: selectedDate,
        time: selectedTime,
        guestInput,
        studentGrade,
      });
    }
    // eslint-disable-next-line
  }, [submitTrigger]);

  const renderInputLocation = () => {
    const isActive = fieldNameShow === "location";
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("location")}
          >
            <span className="text-neutral-400">上課地點</span>
            <span>{locationInputTo || "地點"}</span>
          </button>
        ) : (
          <LocationInput
            defaultValue={locationInputTo}
            onChange={(value) => {
              setLocationInputTo(value);
              setFieldNameShow("dates");
            }}
          />
        )}
      </div>
    );
  };

  const renderInputDates = () => {
    const isActive = fieldNameShow === "dates";

    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4  `}
            onClick={() => setFieldNameShow("dates")}
          >
            <span className="text-neutral-400">日期</span>
            <span>
              {selectedDate
                ? formatDateToJapanese(selectedDate)
                : "Add date"}
            </span>
          </button>
        ) : (
          <StayDatesRangeInput 
            onDateChange={handleDateChange} 
            onClose={handleCloseDatePicker}
          />
        )}
      </div>
    );
  };

  const renderInputGuests = () => {
    const isActive = fieldNameShow === "guests";
    const showGuestsError = !selectedStudent && isActive;
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("guests")}
          >
            <span className="text-neutral-400">服務類型</span>
            <span>{selectedServiceType || "選擇服務類型"}</span>
          </button>
        ) : (
          <GuestsInput 
            defaultValue={guestInput} 
            onChange={handleServiceTypeChange} 
            onServiceTypeSelect={handleServiceTypeSelect}
            onClose={() => {
              setFieldNameShow("");
            }}
            selectedStudent={selectedStudent}
            studentGrade={studentGrade}
            showError={showGuestsError}
          />
        )}
      </div>
    );
  };

  const renderInputTime = () => {
    const isActive = fieldNameShow === "time";

    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <>
            <button
              className={`w-full flex justify-between text-sm font-medium p-4`}
              onClick={() => {
                if (!locationInputTo || !selectedServiceType || !selectedStudent || !selectedDate) {
                  setShowTimeSlotError(true);
                  return;
                }
                setFieldNameShow("time");
                setShowTimeSlotError(false);
              }}
            >
              <span className="text-neutral-400">上課時間</span>
              <span>{selectedTime || "選擇時間"}</span>
            </button>
            {showTimeSlotError && (
              <div className="text-red-500 text-sm mb-3 pl-4">請先選擇地點、服務類型、學生與日期</div>
            )}
          </>
        ) : (
          <TimeSlotInput
            selectedTime={selectedTime}
            onTimeSelect={handleTimeSelect}
            onClose={() => {
              setFieldNameShow("");
            }}
            availableTimeSlots={availableTimeSlots}
            loadingSlots={loadingSlots}
            slotsError={slotsError}
          />
        )}
      </div>
    );
  };

  const renderInputStudent = () => {
    const isActive = fieldNameShow === "student";
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("student")}
          >
            <span className="text-neutral-400">學生</span>
            {/* Show the selected student name, not just id */}
            <span>{students.find((s) => s.id === selectedStudent)?.name || "請選擇學生"}</span>
          </button>
        ) : (
          <StudentDropdown
            value={selectedStudent}
            onChange={(val) => {
              setSelectedStudent(val);
              handleStudentChange(val);
              setFieldNameShow("");
            }}
            students={students}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="w-full space-y-5">
        {/*  */}
        {renderInputStudent()}
        {/*  */}
        {renderInputGuests()}
        {/*  */}
        {renderInputLocation()}
        {/*  */}
        {renderInputDates()}
        {/*  */}
        {renderInputTime()}
      </div>
    </div>
  );
};

export default StaySearchForm;
