"use client";

import React, { FC, useState, useEffect } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import Link from "next/link";
import { Route } from "@/routers/types";
import AdminPageLayout from "@/components/AdminPageLayout";
import { HONG_KONG_DISTRICTS } from "@/utils/locationData";
import { isDistrictEnabled } from "@/config/locationConfig";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ApiUtils } from "@/utils/ApiUtils";
import { UserTypeUtils, UserType } from "@/utils/UserTypeUtils";
import LoadingScreen from "@/components/LoadingScreen";

export interface ShopOwnerRoomsPageProps {}

interface TimeSlot {
  time: string;
  isSelected: boolean;
  status: 'requested' | 'requestCanceled' | 'confirmed' | 'blocked' | 'pending' | 'available';
  bookingId?: string;  // For tracking booking requests
  timeSlotSection?: string;
}

interface PianoRoom {
  id: string;
  name: string;
  selectedDate: Date | null;
  showTimeSlots: boolean;
  timeSlots: TimeSlot[];
  existingBookings: { 
    date: Date; 
    slots: { 
      time: string;
      status: 'requested' | 'requestCanceled' | 'confirmed' | 'blocked' | 'pending' | 'available';
      bookingId?: string;
    }[] 
  }[];
  showDatePicker?: boolean;  // Add this to control date picker visibility
}

interface PianoStudio {
  _id: string;
  name: string;
  address: string;
  district: string;
  roomCount: number;
  adminId: string;
  rooms: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ShopOwnerRoomsPage: FC<ShopOwnerRoomsPageProps> = () => {
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];  // Returns YYYY-MM-DD format
  };

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    let currentTime = new Date();
    currentTime.setHours(9, 30, 0); // Start at 9:30 AM
    let sectionIdx = 1;
    while (currentTime.getHours() < 22 || (currentTime.getHours() === 22 && currentTime.getMinutes() === 0)) {
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const timeSlotSection = `section${sectionIdx}`;
      slots.push({
        time: `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`,
        isSelected: false,
        status: 'available',
        timeSlotSection: timeSlotSection
      });
      sectionIdx = sectionIdx + 1
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    
    return slots;
  };

  /*  const initialStudios: PianoStudio[] = [
    { 
      id: "studio1", 
      name: "信義琴室", 
      address: "台北市信義區松高路68號", 
      district: "北角",
      rooms: [
        { 
          id: "room1", 
          name: "琴房 1", 
          selectedDate: null, 
          showTimeSlots: false, 
          timeSlots: [],
          existingBookings: [
            { 
              date: new Date("2025-04-15"), 
              slots: [
                { time: "9:30 AM", status: 'booked', bookingId: '1' },
                { time: "10:00 AM", status: 'blocked' },
                { time: "11:00 AM", status: 'available' }
              ]
            }
          ]
        },
        { id: "room2", name: "琴房 2", selectedDate: null, showTimeSlots: false, timeSlots: [], existingBookings: [] },
        { id: "room3", name: "琴房 3", selectedDate: null, showTimeSlots: false, timeSlots: [], existingBookings: [] },
      ]
    },
    { 
      id: "studio2", 
      name: "大安琴室", 
      address: "台北市大安區敦化南路二段201號", 
      district: "北角",
      rooms: [
        { id: "room4", name: "琴房 1", selectedDate: null, showTimeSlots: false, timeSlots: [], existingBookings: [] },
        { id: "room5", name: "琴房 2", selectedDate: null, showTimeSlots: false, timeSlots: [], existingBookings: [] },
      ]
    },
  ];*/

  // Sample data - replace with actual data from your API
  const initialStudios: PianoStudio[] = [
  ];

  const [studios, setStudios] = useState<PianoStudio[]>(initialStudios);
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [focusedRoomId, setFocusedRoomId] = useState<string | null>(null);
  
  // Extract fetchPianoRooms to a separate function so it can be called from other places
  const fetchPianoRooms = async () => {
    try {
      const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
      const token = localStorage.getItem(`${userType}_auth_token`);
      if (!token) {
        setError('未登入或登入已過期');
        setIsLoading(false);
        return;
      }

      const response = await fetch(ApiUtils.getApiUrl('api/piano-rooms'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch piano rooms');
      }

      const data = await response.json();
      
      // Process the data to ensure each studio has rooms based on roomCount
      const processedData = data.map((studio: any) => {
        // Convert API field 'studios' to interface property 'rooms'
        const studioWithRooms = {
          ...studio,
          rooms: studio.studios || []
        };
        delete studioWithRooms.studios;
        
        // If rooms array is empty but roomCount is greater than 0, create default rooms
        if (studioWithRooms.rooms.length === 0 && studioWithRooms.roomCount > 0) {
          const defaultRooms = Array.from({ length: studioWithRooms.roomCount }, (_, index) => ({
            id: `room-${index + 1}`,
            name: `琴房 ${index + 1}`,
            selectedDate: null,
            showTimeSlots: false,
            timeSlots: [],
            existingBookings: []
          }));
          
          return {
            ...studioWithRooms,
            rooms: defaultRooms
          };
        }
        return studioWithRooms;
      });
      setStudios(processedData);
      
      // Automatically select the first studio if there is data
      if (processedData && processedData.length > 0) {
        handleStudioSelection(processedData[0]._id);
      }
    } catch (err) {
      console.error('Error fetching piano rooms:', err);
      setError('獲取琴室資料失敗');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPianoRooms();
  }, []);

  // Add a useEffect to log studios after it's updated
  useEffect(() => {
    console.log("Studios updated:", JSON.stringify(studios));
  }, [studios]);

  // Function to fetch room status from the API
  const fetchRoomStatus = async (roomId: string) => {
    try {
      const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
      const token = localStorage.getItem(`${userType}_auth_token`);
      if (!token) {
        console.error('未登入或登入已過期');
        return null;
      }

      const response = await fetch(ApiUtils.getApiUrl(`api/studio-status/room/${roomId}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch room status');
      }

      const data = await response.json();
      
      // Process the response data to update the UI
      if (data && data.studios && data.studios.length > 0) {
        // Update the studios state with the new status data
        
        setStudios(prevStudios => 
          prevStudios.map(studio => {
            console.log("studio ",JSON.stringify(studio));  
            // Only update the studio that matches the roomId (琴室)
            if (studio._id === data.roomId) {
              // Map each item in the studios array to a room (琴房)
              const updatedRooms = data.studios.map((studioEntry: any) => {
                // Find the existing room in our state
                const existingRoom = studio.rooms.find((room: any) => room._id === studioEntry._id);
                
                if (existingRoom && studioEntry.statusEntries) {
                  // Convert statusEntries to existingBookings format
                  const existingBookings = studioEntry.statusEntries.map((entry: any) => {
                    // Convert the slots to our format
                    const formattedSlots = entry.slot.map((slot: any) => {
                      // Convert section numbers to time slots
                      let time = slot.sectionDescription;
                      
                      if (slot.timeSlotSection.startsWith('section')) {
                        const sectionNum = parseInt(slot.timeSlotSection.replace('section', ''));
                        if (sectionNum === 0) {
                          time = '9:00 AM'; // Default time for section0
                        } else {
                          const hours = Math.floor((sectionNum * 30 + 540) / 60); // 540 minutes = 9:00 AM
                          const minutes = (sectionNum * 30 + 540) % 60;
                          const period = hours >= 12 ? 'PM' : 'AM';
                          const displayHours = hours % 12 || 12;
                          time = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                        }
                      }
                      return {
                        time,
                        timeSlotSection: slot.timeSlotSection,
                        status: slot.status,
                        bookingId: slot._id
                      };
                    });

                    return {
                      date: new Date(entry.date),
                      slots: formattedSlots
                    };
                  });
                  
                  return {
                    ...existingRoom,
                    existingBookings
                  };
                }
                
                // If room doesn't exist in our state, create a new one
                return {
                  id: studioEntry._id,
                  name: studioEntry.name,
                  selectedDate: null,
                  showTimeSlots: false,
                  timeSlots: [],
                  existingBookings: []
                };
              });
              
              return {
                ...studio,
                rooms: updatedRooms
              };
            }
            return studio;
          })
        );
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching room status:', err);
      return null;
    }
  };

  const handleDateChange = (studioId: string, roomId: string, date: Date | null) => {
    console.log("handleDateChange :",JSON.stringify(studios));
    if (!date) {
      setStudios(prevStudios => 
        prevStudios.map(studio => 
          studio._id === studioId
            ? {
                ...studio,
                rooms: studio.rooms.map(room =>
                  room.id === roomId
                    ? { 
                        ...room, 
                        selectedDate: null,
                        showTimeSlots: false,
                        timeSlots: []
                      }
                    : room
                )
              }
            : studio
        )
      );
      return;
    }

    // First update the UI to show loading state
    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map(room =>
                room.id === roomId
                  ? { 
                      ...room, 
                      selectedDate: date,
                      showTimeSlots: true,
                      timeSlots: generateTimeSlots().map(slot => {
                        // Find if there's a matching slot in existing bookings
                        const existingBooking = room.existingBookings?.find((booking: { 
                          date: Date; 
                          slots: { 
                            time: string;
                            status: 'requested' | 'requestCanceled' | 'confirmed' | 'blocked' | 'pending' | 'available';
                            bookingId?: string;
                            timeSlotSection?: string;
                          }[] 
                        }) => 
                          booking.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
                        );
                        
                        if (existingBooking) {
                          const matchingSlot = existingBooking.slots.find((existingSlot: { 
                            time: string;
                            status: 'requested' | 'requestCanceled' | 'confirmed' | 'blocked' | 'pending' | 'available';
                            bookingId?: string;
                            timeSlotSection?: string;
                          }) => 
                            existingSlot.timeSlotSection === slot.timeSlotSection
                          );
                          
                          if (matchingSlot) {
                            return {
                              ...slot,
                              status: matchingSlot.status,
                              bookingId: matchingSlot.bookingId
                            };
                          }
                        }
                        
                        return {
                          ...slot,
                          status: 'available'
                        };
                      })
                    }
                  : room
              )
            }
          : studio
      )
    );

    // Then fetch the room status from the API
    /*
    fetchRoomStatus(roomId).then(statusData => {
      if (statusData) {
        // Find the existing booking for the selected date
        const studio = studios.find(s => s._id === studioId);
        const room = studio?.rooms.find(r => r.id === roomId);
        
        if (room && Array.isArray(room.existingBookings)) {
          const existingBooking = room.existingBookings.find((booking: { date: Date; slots: any[] }) => 
            booking.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
          );
          
          if (existingBooking) {
            // Update the time slots with the existing booking data
            setStudios(prevStudios => 
              prevStudios.map(studio => 
                studio._id === studioId
                  ? {
                      ...studio,
                      rooms: studio.rooms.map(room =>
                        room.id === roomId
                          ? { 
                              ...room, 
                              timeSlots: room.timeSlots.map((slot: TimeSlot) => {
                                // Find matching slot in the existing booking
                                const existingSlot = existingBooking.slots.find((s: { time: string; status: string; bookingId?: string }) => 
                                  s.time === slot.time
                                );
                                if (existingSlot) {
                                  return {
                                    ...slot,
                                    status: existingSlot.status,
                                    bookingId: existingSlot.bookingId
                                  };
                                }
                                return slot;
                              })
                            }
                          : room
                      )
                    }
                  : studio
              )
            );
          }
        }
      }
    });
    */
  };

  const generateTimeSlotsWithBookings = (room: PianoRoom, date: Date) => {
    const slots = generateTimeSlots().map(slot => ({
      ...slot,
      status: 'available' as const
    }));
    
    if (!Array.isArray(room.existingBookings)) {
      return slots;
    }
    
    const existingBooking = room.existingBookings.find(booking => 
      booking.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );

    if (existingBooking) {
      return slots.map(slot => {
        const existingSlot = existingBooking.slots.find(s => s.time === slot.time);
        return existingSlot ? {
          ...slot,
          status: existingSlot.status,
          bookingId: existingSlot.bookingId
        } : slot;
      });
    }

    return slots;
  };

  const handleShowTimeSlots = (studioId: string, roomId: string) => {
    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map(room =>
                room.id === roomId
                  ? { 
                      ...room, 
                      showTimeSlots: !room.showTimeSlots,
                      timeSlots: !room.showTimeSlots ? generateTimeSlots() : []
                    }
                  : room
              )
            }
          : studio
      )
    );
  };

  const handleTimeSlotAction = (studioId: string, roomId: string, slotIndex: number, action: 'cancel' | 'block' | 'unblock') => {
    const studio = studios.find(s => s._id === studioId);
    const room = studio?.rooms.find(r => r.id === roomId);
    
    if (!room?.selectedDate) return;

    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map((room: PianoRoom) =>
                room.id === roomId
                  ? {
                      ...room,
                      timeSlots: room.timeSlots.map((slot: TimeSlot, index: number) => {
                        if (slot.timeSlotSection === room.timeSlots[slotIndex].timeSlotSection) {
                          switch (action) {
                            case 'cancel':
                              return { ...slot, status: 'available' };
                            case 'block':
                              return { ...slot, status: 'blocked' };
                            case 'unblock':
                              return { ...slot, status: 'available' };
                            default:
                              return slot;
                          }
                        }
                        return slot;
                      })
                    }
                  : room
              )
            }
          : studio
      )
    );
  };

  const handleAddNewDate = (studioId: string, roomId: string) => {
    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map(room =>
                room.id === roomId
                  ? { 
                      ...room, 
                      showTimeSlots: false,
                      selectedDate: null,
                      timeSlots: [],
                      showDatePicker: true
                    }
                  : room
              )
            }
          : studio
      )
    );
  };

  const handleDatePickerSelect = (studioId: string, roomId: string, date: Date | null) => {
    if (!date) return;

    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map(room =>
                room.id === roomId
                  ? { 
                      ...room, 
                      showTimeSlots: true,
                      selectedDate: date,
                      timeSlots: generateTimeSlots(),
                      showDatePicker: false
                    }
                  : room
              )
            }
          : studio
      )
    );
  };

  const handleCancelAddDate = (studioId: string, roomId: string) => {
    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map(room =>
                room.id === roomId
                  ? { 
                      ...room, 
                      showTimeSlots: false,
                      selectedDate: null,
                      timeSlots: [],
                      showDatePicker: false
                    }
                  : room
              )
            }
          : studio
      )
    );
  };

  const getDisabledDates = (room: PianoRoom) => {
    // Get dates that already have bookings
    if (!Array.isArray(room.existingBookings)) {
      return () => true; // Enable all dates if existingBookings is not an array
    }
    
    const bookedDates = room.existingBookings.map(booking => {
      const date = new Date(booking.date);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return (date: Date) => {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      
      // For debugging
      console.log('Checking date:', checkDate.toISOString());
      console.log('Booked dates:', bookedDates.map(d => d.toISOString()));
      
      // Return true to enable dates that don't have bookings
      // Return false to disable dates that have bookings
      const isBooked = bookedDates.some(bookedDate => 
        bookedDate.getFullYear() === checkDate.getFullYear() &&
        bookedDate.getMonth() === checkDate.getMonth() &&
        bookedDate.getDate() === checkDate.getDate()
      );
      
      return !isBooked;
    };
  };

  const handleConfirmTimeSlots = (studioId: string, roomId: string) => {
    const studio = studios.find(s => s._id === studioId);
    const room = studio?.rooms.find(r => r.id === roomId);
    
    if (!room?.selectedDate) return;  // Don't allow confirmation if no date is selected

    const selectedDate = room.selectedDate; // Store the date before it becomes null

    // Update the UI to reflect the changes
    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map((room: PianoRoom) =>
                room.id === roomId
                  ? { 
                      ...room, 
                      showTimeSlots: false,
                      selectedDate: null,
                      existingBookings: [
                        ...(Array.isArray(room.existingBookings) ? room.existingBookings : []),
                        {
                          date: selectedDate,
                          slots: room.timeSlots.map((slot: TimeSlot) => ({
                            time: slot.time,
                            status: slot.status,
                            bookingId: slot.bookingId
                          }))
                        }
                      ]
                    }
                  : room
              )
            }
          : studio
      )
    );
    
    // Here you would typically make an API call to update the server with the new time slot statuses
    // For example:
    /*
    const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
    const token = localStorage.getItem(`${userType}_auth_token`);
    
    if (token) {
      fetch(ApiUtils.getApiUrl(`api/studio-status/room/${roomId}/update`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          slots: room.timeSlots.map(slot => ({
            timeSlotSection: slot.time,
            status: slot.status
          }))
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update time slots');
        }
        return response.json();
      })
      .then(data => {
        console.log('Time slots updated successfully', data);
      })
      .catch(err => {
        console.error('Error updating time slots:', err);
        setError('更新時段失敗，請重試');
      });
    }
    */
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if any room has a date selected but no time slots
    const hasInvalidRoom = studios.some(studio => 
      studio.rooms.some((room: PianoRoom) => 
        room.selectedDate && (!room.timeSlots.length || !room.timeSlots.some((slot: TimeSlot) => slot.isSelected))
      )
    );
    
    if (hasInvalidRoom) {
      setError("請確保每個選擇了日期的琴房都至少選擇了一個時段");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // In a real app, you would send the data to your API
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage("更新成功");
      setIsLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError("更新失敗，請重試");
      setIsLoading(false);
    }
  };
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-500 text-white';
      case 'requestCanceled':
        return 'bg-red-500 text-white';
      case 'confirmed':
        return 'bg-blue-500 text-white';
      case 'blocked':
        return 'bg-orange-500 text-white';
      case 'pending':
        return 'bg-purple-500 text-white';
      case 'available':
      default:
        return 'bg-emerald-500 text-white';
    }
  };

  // Helper function to get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'requested':
        return '待確認';
      case 'requestCanceled':
        return '已取消';
      case 'confirmed':
        return '已確認';
      case 'blocked':
        return '不可預約';
      case 'pending':
        return '待取消';
      case 'available':
      default:
        return '可預約';
    }
  };

  // Create a function to handle studio selection
  const handleStudioSelection = (studioId: string) => {
    setSelectedStudio(studioId);
    //alert(studioId);
    fetchRoomStatus(studioId);
  };

  return (
    <AdminPageLayout userType="shopOwner">
      <div className="nc-AccountRoomsPage max-w-4xl mx-auto">
        {/* HEADING */}
        <div className="relative mb-4">
          <h2 className="text-3xl font-semibold text-center">琴室管理</h2>
          <Link href={"/shop-owner-admin/account-rooms/add" as Route} className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-600 hover:underline">
            新增琴室
          </Link>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-6"></div>
        
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <div className="space-y-4">
            {studios.length === 0 ? (
              <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-8 text-center">
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">沒有琴室資料</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">請新增琴室以開始管理</p>
                <Link 
                  href={"/shop-owner-admin/account-rooms/add" as Route} 
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  新增琴室
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Studio List Column */}
                <div className="md:col-span-3">
                  <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">琴室列表</h3>
                    {/* Desktop view - List */}
                    <div className="hidden md:block space-y-1">
                      {studios.map((studio) => (
                        <button
                          key={studio._id}
                          onClick={() => handleStudioSelection(studio._id)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                            selectedStudio === studio._id
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                              : 'hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {studio.name}
                        </button>
                      ))}
                    </div>
                    {/* Mobile/Tablet view - Dropdown */}
                    <div className="md:hidden">
                      <select
                        value={selectedStudio || ""}
                        onChange={(e) => handleStudioSelection(e.target.value)}
                        className="w-full rounded-lg border-gray-300 dark:border-neutral-600 dark:bg-neutral-700"
                      >
                        <option value="">選擇琴室</option>
                        {studios.map((studio) => (
                          <option key={studio._id} value={studio._id}>
                            {studio.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Studio Details Column */}
                <div className="md:col-span-9">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {selectedStudio && (
                      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">琴房管理</h3>
                        
                        {/* Studio Information */}
                        {(() => {
                          const studio = studios.find(s => s._id === selectedStudio);
                          if (!studio) return null;
                          
                          return (
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>琴室名稱</Label>
                                  <div className="mt-1 text-lg font-medium">{studio.name}</div>
                                </div>
                                <div>
                                  <Label>地區</Label>
                                  <div className="mt-1 text-lg font-medium">{studio.district}</div>
                                </div>
                                <div className="md:col-span-2">
                                  <Label>琴室地址</Label>
                                  <div className="mt-1 text-lg font-medium">{studio.address}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                        
                        {studios.find(s => s._id === selectedStudio)?.rooms.map((room) => (
                          <div 
                            key={room.id} 
                            className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors mb-4"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-medium">{room.name}</h4>
                              </div>
                              
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="w-full md:w-48">
                                  <select
                                    value={room.selectedDate ? formatDate(room.selectedDate) : ""}
                                    onChange={(e) => {
                                      if (e.target.value === "add-new") {
                                        handleAddNewDate(selectedStudio, room.id);
                                      } else if (e.target.value) {
                                        handleDateChange(selectedStudio, room.id, new Date(e.target.value));
                                      } else {
                                        handleDateChange(selectedStudio, room.id, null);
                                      }
                                    }}
                                    className="w-full rounded-lg border-gray-300 dark:border-neutral-600 dark:bg-neutral-700"
                                  >
                                    <option value="">選擇日期</option>
                                    {Array.isArray(room.existingBookings) ? [...room.existingBookings]
                                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                                      .map((booking, index) => (
                                        <option key={index} value={formatDate(booking.date)}>
                                          {formatDate(booking.date)}
                                        </option>
                                      )) : null}
                                    <option value="add-new">添加日期</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            
                            {room.showDatePicker && (
                              <div className="mt-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                <Label>選擇新日期</Label>
                                <div className="mt-2">
                                  <DatePicker
                                    selected={room.selectedDate}
                                    onChange={(date) => handleDatePickerSelect(selectedStudio, room.id, date)}
                                    className="w-full rounded-lg border-gray-300 dark:border-neutral-600 dark:bg-neutral-700"
                                    dateFormat="yyyy/MM/dd"
                                    placeholderText="選擇日期"
                                    filterDate={getDisabledDates(room)}
                                    minDate={new Date()}
                                  />
                                </div>
                                <div className="mt-4 flex justify-end space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleCancelAddDate(selectedStudio, room.id)}
                                    className="text-gray-600 hover:underline"
                                  >
                                    取消
                                  </button>
                                </div>
                              </div>
                            )}

                            {room.showTimeSlots && room.selectedDate && !room.showDatePicker && (
                              <div className="mt-4">
                                <div className="mb-4 text-lg font-medium">
                                  選擇日期: {room.selectedDate.toLocaleDateString()}
                                </div>
                                <Label>選擇時段</Label>
                                <div className="mb-4 flex gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                    <span>已確認</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                    <span>待確認</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                    <span>不可預約</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                    <span>待取消</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <span>已取消</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                                    <span>可預約</span>
                                  </div>
                                </div>
                                <div className="mt-2 grid grid-cols-4 gap-2">
                                  {room.timeSlots.map((slot: TimeSlot, index: number) => (
                                    <div key={slot.time} className="relative">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (slot.status === 'confirmed' || slot.status === 'requested') {
                                            handleTimeSlotAction(selectedStudio, room.id, index, 'cancel');
                                          } else if (slot.status === 'blocked') {
                                            handleTimeSlotAction(selectedStudio, room.id, index, 'unblock');
                                          } else {
                                            handleTimeSlotAction(selectedStudio, room.id, index, 'block');
                                          }
                                        }}
                                        disabled={slot.status === 'confirmed' || slot.status === 'requested'}
                                        className={`w-full p-2 text-sm rounded-lg transition-colors ${
                                          getStatusColor(slot.status)
                                        }`}
                                      >
                                        {slot.time}
                                      </button>
                                      {(slot.status === 'confirmed' || slot.status === 'requested') && (
                                        <button
                                          type="button"
                                          onClick={() => handleTimeSlotAction(selectedStudio, room.id, index, 'cancel')}
                                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                          ×
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 flex justify-end space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmTimeSlots(selectedStudio, room.id)}
                                    className="text-blue-600 hover:underline"
                                  >
                                    確認
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setStudios(prevStudios => 
                                        prevStudios.map(studio => 
                                          studio._id === selectedStudio
                                            ? {
                                                ...studio,
                                                rooms: studio.rooms.map((r: PianoRoom) =>
                                                  r.id === room.id
                                                    ? { 
                                                        ...r, 
                                                        showTimeSlots: false,
                                                        selectedDate: null,
                                                        timeSlots: []
                                                      }
                                                    : r
                                                )
                                              }
                                            : studio
                                        )
                                      );
                                    }}
                                    className="text-gray-600 hover:underline"
                                  >
                                    取消
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-center">
                        {error}
                      </div>
                    )}
                    
                    {successMessage && (
                      <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg text-center">
                        {successMessage}
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <ButtonPrimary type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "處理中..." : "更新時段"}
                      </ButtonPrimary>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>  
    </AdminPageLayout>
  );
};

export default ShopOwnerRoomsPage; 