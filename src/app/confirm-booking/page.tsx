"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiUtils } from "@/utils/ApiUtils";
import { UserTypeUtils } from "@/utils/UserTypeUtils";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { Route } from "@/routers/types";

interface Room {
  _id: string;
  name: string;
  district: string;
  address: string;
  roomCount: number;
  studios: string[];
}

interface BookingDetails {
  studentName: string;
  lessonType: string;
  date: string;
  section: string;
  district: string;
}

const ConfirmBookingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    studentName: searchParams?.get("studentName") || "",
    lessonType: searchParams?.get("lessonType") || "",
    date: searchParams?.get("date") || "",
    section: searchParams?.get("section") || "",
    district: searchParams?.get("district") || "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
        const token = localStorage.getItem(`${userType}_auth_token`);

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(ApiUtils.getApiUrl("api/piano-rooms/availability"), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            section: "section1",
            district: "北角",
            date: "2025-04-24",
            type: "",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch room availability");
        }

        const data = await response.json();
        setRooms(data);
        
        // Select the first room by default
        if (data.length > 0) {
          setSelectedRoom(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [bookingDetails]);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleConfirmBooking = async () => {
    try {
      const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
      const token = localStorage.getItem(`${userType}_auth_token`);

      if (!token || !selectedRoom) {
        throw new Error("Missing required information");
      }

      // TODO: Replace with actual booking confirmation API endpoint
      const response = await fetch(ApiUtils.getApiUrl("api/bookings/confirm"), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: selectedRoom._id,
          studentName: bookingDetails.studentName,
          lessonType: bookingDetails.lessonType,
          date: bookingDetails.date,
          section: bookingDetails.section,
          district: bookingDetails.district,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to confirm booking");
      }

      // Redirect to success page
      router.push("/booking-success" as Route<string>);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm booking");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 text-sm">載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-medium mb-2">發生錯誤</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <ButtonPrimary onClick={() => window.location.reload()}>
            重試
          </ButtonPrimary>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-medium text-center mb-8">預約確認</h1>
            
            <div className="mb-10">
              <h2 className="text-xl font-medium mb-4">預約詳情</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">學生姓名</p>
                    <p className="text-lg">{bookingDetails.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">課程類型</p>
                    <p className="text-lg">{bookingDetails.lessonType}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">日期</p>
                    <p className="text-lg">{bookingDetails.date}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">時段</p>
                    <p className="text-lg">{bookingDetails.section}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">地區</p>
                    <p className="text-lg">{bookingDetails.district}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-medium mb-4">選擇琴房</h2>
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div 
                    key={room._id} 
                    className={`border rounded-xl p-5 transition-all duration-200 cursor-pointer ${
                      selectedRoom?._id === room._id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleRoomSelect(room)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{room.name}</h3>
                        <p className="text-gray-500 mt-1">{room.address}</p>
                      </div>
                      <div className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {room.roomCount} 間琴房
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-auto">
                  {selectedRoom && (
                    <div className="text-center md:text-left">
                      <p className="text-sm text-gray-500 mb-1">已選擇琴房</p>
                      <p className="font-medium">{selectedRoom.name}</p>
                    </div>
                  )}
                </div>
                <ButtonPrimary 
                  onClick={handleConfirmBooking}
                  className="w-full md:w-auto"
                  disabled={!selectedRoom}
                >
                  確認預約
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingPage; 