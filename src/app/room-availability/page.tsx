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

        setSection(sectionParam);
        setDistrict(districtParam);
        setDate(dateParam);

        if (!sectionParam || !districtParam || !dateParam) {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Available Piano Rooms</h1>
        
        <div className="mb-8 bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
          <HeroSearchFormRect 
            defaultValues={{
              section: section || "",
              district: district || "",
              date: date || "",
            }}
          />
        </div>

        <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-6 shadow-md">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    className="bg-white dark:bg-neutral-700 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <MapPinIcon className="h-5 w-5 text-primary-600 mr-2" />
                        <h2 className="text-xl font-semibold">{room.name}</h2>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {room.address}, {room.district}
                      </p>
                      
                      <div className="flex items-center mb-4">
                        <ClockIcon className="h-5 w-5 text-primary-600 mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {room.roomCount} {room.roomCount === 1 ? 'Room' : 'Rooms'} Available
                        </span>
                      </div>
                      
                      <div className="mt-6">
                        <ButtonPrimary className="w-full">Book Now</ButtonPrimary>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomAvailabilityPage; 