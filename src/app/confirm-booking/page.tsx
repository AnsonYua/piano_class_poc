"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/hooks/useAuth';
import { UserTypeUtils, UserType } from '@/utils/UserTypeUtils';
import { ApiUtils } from '@/utils/ApiUtils';
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { TimeSlots } from '@/utils/timeSlots';

interface PianoRoom {
  _id: string;
  name: string;
  district: string;
  address: string;
  roomCount: number;
  studios: string[];
}

const ConfirmBookingPage = () => {
  const router = useRouter();
  const { bookingParams } = useBooking();
  const { userProfile, isAuthenticated, isLoading } = useAuth();
  const [pianoRooms, setPianoRooms] = useState<PianoRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<PianoRoom | null>(null);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchPianoRooms = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoadingRooms(true);
        setError(null);
        
        // Get user type and token
        const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
        const token = localStorage.getItem(`${userType}_auth_token`);
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const timeSlot = TimeSlots.getTimeSlots(bookingParams.time || "");
        const response = await fetch(ApiUtils.getApiUrl('api/piano-rooms/availability'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            section:timeSlot,
            district: bookingParams.district || "",
            date: bookingParams.date || "",
            type: bookingParams.type || ""
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch piano rooms');
        }
        
        const data = await response.json();
        setPianoRooms(data);
        
        // Select the first room by default if available
        if (data.length > 0) {
          setSelectedRoom(data[0]);
        }
      } catch (err) {
        setError('Failed to load available piano rooms. Please try again.');
        console.error('Error fetching piano rooms:', err);
      } finally {
        setIsLoadingRooms(false);
      }
    };
    
    fetchPianoRooms();
  }, [isAuthenticated, bookingParams]);

  const handleConfirmBooking = async () => {
    if (!selectedRoom) {
      setError('Please select a piano room ');
      return;
    }
    setIsSubmitting(true);
    console.log('selectedRoom', JSON.stringify(selectedRoom));
    console.log('studentId', JSON.stringify(userProfile.user.student));
    try {
      // Get user type and token
      const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
      const token = localStorage.getItem(`${userType}_auth_token`);
      const studentId = userProfile.user.student.filter((student:any) => student.name !== bookingParams.student)[0]._id;
      let studentIdx = -1;
      for (let i = 0; i < userProfile.user.student.length; i++) {
        if (userProfile.user.student[i].name === bookingParams.student) {
          studentIdx = i;
          break;
        }
      }
     
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const timeSlot = TimeSlots.getTimeSlots(bookingParams.time || "");
      const response = await fetch(ApiUtils.getApiUrl('api/studio-status/students/make-booking'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          updates:[
            {
              studioId: selectedRoom.studios[0],
              roomId: selectedRoom._id,
              date: bookingParams.date,
              timeSlotSection: timeSlot,
              sectionDescription: bookingParams.type,
              status: 'requested',
              remark: 'student_booking',
              studentId: studentIdx
            }
          ]
        })
      });
      
      if (response.ok) {
        router.push('/booking-success');
      } else {
        const errData = await response.json();
        setError(errData?.message || 'Failed to confirm booking. Please try again.');
      }
    } catch (err) {
      setError('Failed to confirm booking. Please try again.');
      console.error('Error confirming booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If loading or not authenticated, show nothing
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">確認您的預訂</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6 pb-4 border-b border-gray-200">預訂詳情</h2>
          
          <div className="space-y-5">
            <div className="flex items-center">
              <span className="font-medium w-32 text-gray-600">地區：</span>
              <span className="text-gray-800">{bookingParams.district || '未選擇'}</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-medium w-32 text-gray-600">日期：</span>
              <span className="text-gray-800">{bookingParams.date || '未選擇'}</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-medium w-32 text-gray-600">時間：</span>
              <span className="text-gray-800">{bookingParams.time || '未選擇'}</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-medium w-32 text-gray-600">學生：</span>
              <span className="text-gray-800">{bookingParams.student || '未選擇'}</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-medium w-32 text-gray-600">類型：</span>
              <span className="text-gray-800">{bookingParams.type || '未選擇'}</span>
            </div>
            
            <div className="flex items-center justify-end mt-4">
              <span className="text-lg font-medium text-gray-700 mr-2">總價：</span>
              <span className="text-2xl font-bold text-blue-600">$350</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-8"></div>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">可用琴房</h3>
            
            {isLoadingRooms ? (
              <div className="text-center py-6">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">載入中...</span>
                </div>
                <p className="mt-2 text-gray-600">正在載入可用房間...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-md">
                {error}
              </div>
            ) : pianoRooms.length === 0 ? (
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
                根據所選條件，沒有可用的鋼琴房間。
              </div>
            ) : (
              <div className="space-y-4">
                {pianoRooms.map((room) => (
                  <div 
                    key={room._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedRoom?._id === room._id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-lg">{room.name}</h4>
                        <p className="text-gray-600">{room.address}</p>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded-full mr-2 ${
                          selectedRoom?._id === room._id ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-sm font-medium">
                          {selectedRoom?._id === room._id ? '已選擇' : '選擇'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 my-8"></div>
          
          <div className="mt-10 flex justify-end">
            <div className="flex space-x-4">
              <ButtonSecondary
                onClick={() => router.back()}
                className="w-32"
              >
                返回
              </ButtonSecondary>
              <ButtonPrimary
                onClick={handleConfirmBooking}
                disabled={!selectedRoom || isLoadingRooms || isSubmitting}
                className="w-32"
              >
                {isSubmitting ? '處理中...' : '結帳'}
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingPage; 