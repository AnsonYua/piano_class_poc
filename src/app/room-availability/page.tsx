"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import HeroSearchFormRect from "../(client-components)/(HeroSearchFormRect)/HeroSearchFormRect";
import { ApiUtils } from "@/utils/ApiUtils";
import { UserTypeUtils } from "@/utils/UserTypeUtils";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";

interface PianoRoom {
  _id: string;
  name: string;
  district: string;
  address: string;
  roomCount: number;
  adminId: string;
  studios: string[];
  createdAt: string;
  updatedAt: string;
}

const RoomAvailabilityPage = () => {
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<PianoRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [student, setStudent] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
   
  /*
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (!searchParams) {
          setError("Search parameters not available");
          setIsLoading(false);
          return;
        }

        const sectionParam = searchParams.get("section");
        const districtParam = searchParams.get("district");
        const dateParam = searchParams.get("date");
        const timeParam = searchParams.get("time");
        const studentParam = searchParams.get("student");
        const typeParam = searchParams.get("type");

        setSection(sectionParam);
        setDistrict(districtParam);
        setDate(dateParam);
        setTime(timeParam);
        setStudent(studentParam);
        setType(typeParam);

        if (!districtParam || !dateParam) {
          setError("Missing required search parameters");
          setIsLoading(false);
          return;
        }

        const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
        const token = localStorage.getItem(`${userType}_auth_token`);

        if (!token) {
          setError("Please login to view room availability");
          setIsLoading(false);
          return;
        }

        const response = await fetch(ApiUtils.getApiUrl("api/piano-rooms/availability"), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            section: sectionParam,
            district: districtParam,
            date: dateParam,
            time: timeParam,
            student: studentParam,
            type: typeParam,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch room availability");
        }

        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [searchParams]);
  */

  return (
    <div className="bg-gray-100 dark:bg-neutral-900 min-h-0 md:min-h-screen lg:min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">立即上課</h1>
        <div className="mb-8">
          <HeroSearchFormRect 
            defaultValues={{
              section: section || "",
              district: district || "",
              date: date || "",
              time: time || "",
              student: student || "",
              type: type || "",
            }}
          />
        </div>
        <div className="border-t border-gray-200 dark:border-neutral-700 my-8"></div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[150px]">
            {/* <span className="text-lg text-gray-500">Loading...</span> */}
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <span className="text-lg text-red-500">{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 border border-gray-200 dark:border-neutral-700 flex flex-col h-full"
              >
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-3">
                      <MapPinIcon className="h-5 w-5 text-primary-600 mr-2" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{room.name}</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">
                      {room.address}, {room.district}
                    </p>
                  </div>
                  <div className="flex items-center mt-2 mb-4">
                    <span className="text-base font-medium text-primary-700 dark:text-primary-300">HKD $300</span>
                  </div>
                  <ButtonPrimary className="w-full mt-auto">預約</ButtonPrimary>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomAvailabilityPage; 