"use client";

import converSelectedDateToString from "@/utils/converSelectedDateToString";
import React, { useState, useEffect } from "react";
import { GuestsObject } from "../../type";
import GuestsInput from "../GuestsInput";
import LocationInput from "../LocationInput";
import DatesRangeInput from "../DatesRangeInput";
import TimeSlotInput from "./TimeSlotInput";
import StudentDropdown from "../StudentDropdown";
import { ApiUtils } from "@/utils/ApiUtils";
import { UserTypeUtils } from "@/utils/UserTypeUtils";

const StaySearchForm = () => {
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

  // Format date to Japanese format (YYYY年M月D日)
  const formatDateToJapanese = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleCloseDatePicker = () => {
    setFieldNameShow("guests");
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
    // Find the selected student from the dropdown's student list (assume StudentDropdown exposes a way to get student info)
    // For this example, we'll use a temporary workaround: if selectedStudent includes "grade", extract it; otherwise null
    // In real code, StudentDropdown should provide the full student object or a lookup
    // Example: setStudentGrade(students.find(s => s.id === selectedStudent)?.grade ?? null);
    // --- Placeholder logic below ---
    if (selectedStudent.includes("高")) {
      setStudentGrade("高");
    } else if (selectedStudent.includes("低")) {
      setStudentGrade("低");
    } else {
      setStudentGrade(null);
    }
    // Reset selected service type when student changes
    setSelectedServiceType(null);
  }, [selectedStudent]);

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
          <DatesRangeInput 
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
          <button
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("time")}
          >
            <span className="text-neutral-400">上課時間</span>
            <span>{selectedTime || "選擇時間"}</span>
          </button>
        ) : (
          <TimeSlotInput 
            selectedTime={selectedTime}
            onTimeSelect={handleTimeSelect}
            onClose={() => {
              setFieldNameShow("");
            }}
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
