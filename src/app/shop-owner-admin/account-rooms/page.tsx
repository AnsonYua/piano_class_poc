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

/**
 * Interface for a time slot in the booking system
 */
interface TimeSlot {
  time: string;
  isSelected: boolean;
  status: 'requested' |  'confirmed' | 'blocked' | 'pending' | 'available';  // For tracking booking requests
  timeSlotSection?: string;
}
interface BookingData {
  date: Date;
  slots: BookingSlotsDetails[];
}
interface BookingSlotsDetails { 
  status: 'requested' | 'confirmed' | 'blocked' | 'pending' | 'available';
  timeSlotSection?: string;
}
/**
 * Interface for a piano room with booking functionality
 */
interface PianoRoom {
  _id: string;
  name: string;
  selectedDate: Date | null;
  showTimeSlots: boolean;
  timeSlots: TimeSlot[];
  existingBookings: BookingData[];
  showDatePicker?: boolean;  // Controls date picker visibility
}

/**
 * Interface for a piano studio containing multiple rooms
 */
interface PianoStudio {
  _id: string;
  name: string;
  address: string;
  district: string;
  roomCount: number;
  adminId: string;
  rooms: PianoRoom[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
let tempStudioData:PianoStudio[] = [];
const ShopOwnerRoomsPage: FC<ShopOwnerRoomsPageProps> = () => {
  // State management
  const [studios, setStudios] = useState<PianoStudio[]>([]);
  //const [apiStudios, setApiStudios] = useState<PianoStudio[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [focusedRoomId, setFocusedRoomId] = useState<string | null>(null);
  const [hasUpdates, setHasUpdates] = useState(false);


  // Add a useEffect hook to watch for changes to the studios state
  useEffect(() => {
    // Check for updates whenever studios state changes
    const updates = generateUpdates();
    console.log("Updates from useEffect:", updates);
    setHasUpdates(updates.length > 0);
  }, [studios]);

  /**
   * Formats a Date object to YYYY-MM-DD string format
   */
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    if (date && typeof date === 'string') {
      date = new Date(date);
    }
    // Use local date formatting instead of ISO string to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Generates time slots from 9:30 AM to 10:00 PM in 30-minute intervals
   * Each slot has a unique section identifier for tracking
   */
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
      
      sectionIdx = sectionIdx + 1;
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    
    return slots;
  };

  /**
   * Fetches piano rooms data from the API
   * Processes the data to ensure each studio has rooms based on roomCount
   */
  const fetchPianoRooms = async (shouldSelectFirst: boolean = false) => {
    try {
      const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
      const token = localStorage.getItem(`${userType}_auth_token`);
      
      if (!token) {
        setError('未登入或登入已過期');
        setIsLoading(false);
        return;
      }

      console.log("fetchPianoRooms - Fetching piano rooms");
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
      console.log("fetchPianoRooms - API response:", JSON.stringify(data));
      
      // Process the data to ensure each studio has rooms based on roomCount
      const processedData = data.map((studio: any) => {
        console.log("fetchPianoRooms - Processing studio:", studio._id);
        // Convert API field 'studios' to interface property 'rooms'
        const studioWithRooms = {
          ...studio,
          rooms: studio.studios || []
        };
        delete studioWithRooms.studios;
        
        console.log("fetchPianoRooms - Studio rooms:", JSON.stringify(studioWithRooms.rooms));
        
        // If rooms array is empty but roomCount is greater than 0, create default rooms
        if (studioWithRooms.rooms.length === 0 && studioWithRooms.roomCount > 0) {
          console.log("fetchPianoRooms - Creating default rooms for studio:", studio._id);
          const defaultRooms = Array.from({ length: studioWithRooms.roomCount }, (_, index) => ({
            _id: `room-${index + 1}`,
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
      console.log("fetchPianoRooms - Processed data:", JSON.stringify(processedData));
      setStudios(processedData);
      //setApiStudios(processedData);
      tempStudioData = JSON.parse(JSON.stringify(processedData));
      // Only select first studio if explicitly requested
      if (shouldSelectFirst && processedData && processedData.length > 0) {
        console.log("fetchPianoRooms - Selecting first studio:", processedData[0]._id);
        handleStudioSelection(processedData[0]._id);
      }
    } catch (err) {
      console.error('Error fetching piano rooms:', err);
      setError('獲取琴室資料失敗');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch piano rooms on component mount
  useEffect(() => {
    fetchPianoRooms(true);
  }, []);

  // Log studios after updates (for debugging)
  useEffect(() => {
    console.log("shouldUpdateApiStudios Studios updated:", JSON.stringify(studios));
   

  }, [studios]);

  /**
   * Fetches room status from the API for a specific room
   * Updates the UI with the fetched status data
   */
  const fetchRoomStatus = async (roomId: string) => {
    try {
      const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
      const token = localStorage.getItem(`${userType}_auth_token`);
      
      if (!token) {
        console.error('未登入或登入已過期');
        return null;
      }

      console.log("fetchRoomStatus - Fetching status for room:", roomId);
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
      console.log("fetchRoomStatus - API response:", JSON.stringify(data));
      
      // Process the response data to update the UI
      if (data && data.studios && data.studios.length > 0) {
          console.log("fetchRoomStatus - Updating studios with room status");
          updateStudiosWithRoomStatus(data);
      } else {
          console.log("fetchRoomStatus - No studios found in response");
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching room status:', err);
      return null;
    }
  };

  /**
   * Updates the studios state with room status data from the API
   */
  const updateStudiosWithRoomStatus = (data: any) => {
    console.log("updateStudiosWithRoomStatus - Input data:", JSON.stringify(data));
    let updatedStudios: PianoStudio[] = [];
    setStudios(prevStudios => {
      console.log("updateStudiosWithRoomStatus - Previous studios:", JSON.stringify(prevStudios));
      updatedStudios = prevStudios.map(studio => {
        // Only update the studio that matches the roomId
        if (studio._id === data.roomId) {
          console.log("updateStudiosWithRoomStatus - Found matching studio:", studio._id);
          
          // Get all rooms from the current studio
          const currentRooms = [...studio.rooms];
          
          // Create a map of existing rooms by ID for quick lookup
          const existingRoomsMap = new Map();
          currentRooms.forEach(room => {
            existingRoomsMap.set(room._id, room);
          });
          
          // Create a map of API rooms by ID for quick lookup
          const apiRoomsMap = new Map();
          data.studios.forEach((apiRoom: any) => {
            apiRoomsMap.set(apiRoom._id, apiRoom);
          });
          
          // Update rooms while preserving the original order
          const updatedRooms = currentRooms.map(existingRoom => {
            const apiRoom = apiRoomsMap.get(existingRoom._id);
            
            if (apiRoom && apiRoom.statusEntries) {
              console.log("updateStudiosWithRoomStatus - Found existing room with status entries:", existingRoom._id);
              // Convert statusEntries to existingBookings format
              const existingBookings = apiRoom.statusEntries.map((entry: any) => {
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
            
            // If no API data for this room, keep the existing room as is
            return existingRoom;
          });
          
          console.log("updateStudiosWithRoomStatus - Updated rooms:", JSON.stringify(updatedRooms));
          return {
            ...studio,
            rooms: updatedRooms
          };
        }
        return studio;
      });
      console.log("updateStudiosWithRoomStatus - Updated studios:", JSON.stringify(updatedStudios))
      //(updatedStudios);
      tempStudioData = JSON.parse(JSON.stringify(updatedStudios));;
      return updatedStudios;
    });
    console.log("updateStudiosWithRoomStatus - Final updated studios:", JSON.stringify(updatedStudios))
    //setApiStudios(updatedStudios);
    tempStudioData = JSON.parse(JSON.stringify(updatedStudios));
    return updatedStudios;
  };

  /**
   * Handles date selection for a room
   * Updates the UI to show time slots for the selected date
   * Checks for existing bookings and applies their status
   */
  const handleDateChange = (studioId: string, roomId: string, date: Date | null) => {
    setError(null);
    console.log("handleDateChange:", JSON.stringify(studios));
    
    if (!date) {
      // Clear date selection
      clearDateSelection(studioId, roomId);
      return;
    }

    // Update the UI to show time slots for the selected date
    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map(room =>
                room._id === roomId
                  ? { 
                      ...room, 
                      selectedDate: date,
                      showTimeSlots: true,
                      timeSlots: generateTimeSlotsWithExistingBookings(room, date)
                    }
                  : room
              )
            }
          : studio
      )
    );
  };

  /**
   * Clears date selection for a room
   */
  const clearDateSelection = (studioId: string, roomId: string) => {
    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map(room =>
                room._id === roomId
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
  };

  /**
   * Generates time slots and applies existing booking statuses
   */
  const generateTimeSlotsWithExistingBookings = (room: PianoRoom, date: Date) => {
    return generateTimeSlots().map(slot => {
      // Find if there's a matching slot in existing bookings
      const existingBooking = room.existingBookings?.find((booking: BookingData) => 
        booking.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
      );
      
      if (existingBooking) {
        const matchingSlot = existingBooking.slots.find((existingSlot: BookingSlotsDetails) => 
          existingSlot.timeSlotSection === slot.timeSlotSection
        );
        
        if (matchingSlot) {
          return {
            ...slot,
            status: matchingSlot.status
          };
        }
      }
      
      return {
        ...slot,
        status: 'available' as const
      };
    });
  };

  /**
   * Handles showing/hiding time slots for a room
   */
  const handleShowTimeSlots = (studioId: string, roomId: string) => {
    setError(null);
    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map(room =>
                room._id === roomId
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

  /**
   * Handles time slot actions (cancel, block, unblock)
   */
  const handleTimeSlotAction = (studioId: string, roomId: string, slotIndex: number, action: 'cancel' | 'block' | 'unblock') => {
    const studio = studios.find(s => s._id === studioId);
    const room = studio?.rooms.find(r => r._id === roomId);
    setError(null);
    if (!room?.selectedDate) return;

    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map((room: PianoRoom) =>
                room._id === roomId
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

  /**
   * Handles adding a new date for a room
   */
  const handleAddNewDate = (studioId: string, roomId: string) => {
    setError(null);
    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map(room =>
                room._id === roomId
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

  /**
   * Handles date picker selection
   */
  const handleDatePickerSelect = (studioId: string, roomId: string, date: Date | null) => {
    setError(null);
    if (!date) return;
    console.log("handleDatePickerSelect:", date)
    
    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map(room =>
                room._id === roomId
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

  /**
   * Handles canceling date addition
   */
  const handleCancelAddDate = (studioId: string, roomId: string) => {
    setError(null);
    setStudios(prevStudios => 
      prevStudios.map(studio => 
        studio._id === studioId
          ? {
              ...studio,
              rooms: studio.rooms.map(room =>
                room._id === roomId
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

  /**
   * Returns a function to determine which dates should be disabled in the date picker
   */
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

  /**
   * Updates existing bookings with new time slots
   */
  const updateExistingBookingsFromTimeSlots = (
    existingBookings: BookingData[],
    timeSlots: TimeSlot[],
    selectedDate: Date
  ) => {
    // Create a deep copy of existing bookings to avoid mutating the original
    const updatedBookings = existingBookings?JSON.parse(JSON.stringify(existingBookings)):[]
    
    let isDateExistInBookings = false;
    // Convert date strings back to Date objects
    updatedBookings.forEach((booking: any) => {
      if (booking.date && typeof booking.date === 'string') {
        booking.date = new Date(booking.date);
      }
      if(booking.date.toISOString() === selectedDate.toISOString()) {
        isDateExistInBookings = true;
      }
    });
    
    console.log("isDateExistInBookings:", isDateExistInBookings)
    if (isDateExistInBookings) {
      // Loop through each booking
      updatedBookings.forEach((booking: BookingData) => {
        // Loop through each time slot
        timeSlots.forEach(timeSlot => {
          // Find if there's a matching slot in the booking
          const existingSlotIndex = booking.slots.findIndex(
            (slot: BookingSlotsDetails) => slot.timeSlotSection === timeSlot.timeSlotSection
          );
          
          if (existingSlotIndex !== -1) {
            // Update the existing slot with the new status
            booking.slots[existingSlotIndex].status = timeSlot.status;
          } else {
            // Add the new slot to the booking
            booking.slots.push({
              status: timeSlot.status,
              timeSlotSection: timeSlot.timeSlotSection
            });
          }
        });
      });
      
      return updatedBookings;
    }else{
      const unavailableSlots = timeSlots.filter((timeSlot: TimeSlot) => timeSlot.status !== 'available');
      const removeSection0 = unavailableSlots.filter((timeSlot: TimeSlot) => timeSlot.timeSlotSection !== 'section0');
      if(existingBookings == null){
          existingBookings = []
      }
        existingBookings.push({
          date: selectedDate,
          slots: [{ 
          status: 'pending',
          timeSlotSection:'section0'
        },...removeSection0]})

      console.log("unavailableSlots:", unavailableSlots)
      console.log("existingBookings:", existingBookings)
      return existingBookings;
    }
  }

  /**
   * Handles confirming time slots for a room
   * Updates the existingBookings array with the new time slots
   */
  const handleConfirmTimeSlots = (studioId: string, roomId: string) => {
    setError(null);
    const studio = studios.find(s => s._id === studioId);
    const room = studio?.rooms.find(r => r._id === roomId);
    if (!room?.selectedDate) return;  // Don't allow confirmation if no date is selected

    const selectedDate = room.selectedDate; // Store the date before it becomes null
    console.log("handleConfirmTimeSlots:", selectedDate)
    
    // Create a new studios array with the updated data
    const updatedStudios = studios.map(studio => 
      studio._id === studioId
        ? {
            ...studio,
            rooms: studio.rooms.map((room: PianoRoom) =>
              room._id === roomId
                ? { 
                    ...room, 
                    showTimeSlots: false,
                    selectedDate: null,
                    existingBookings: updateExistingBookingsFromTimeSlots(room.existingBookings, room.timeSlots, selectedDate)
                  }
                : room
            )
          }
        : studio
    );
    
    // Update the state with the new data
    setStudios(updatedStudios);
  };

  /**
   * Handles removing a date from existing bookings
   */
  const handleRemoveDate = (studioId: string, roomId: string) => {
    setError(null);
    const studio = studios.find(s => s._id === studioId);
    const room = studio?.rooms.find(r => r._id === roomId);
    
    if (!room?.selectedDate) return;

    // Create a new studios array with the updated data
    const updatedStudios = studios.map(studio => 
      studio._id === studioId
        ? {
            ...studio,
            rooms: studio.rooms.map((r: PianoRoom) =>
              r._id === roomId
                ? { 
                    ...r, 
                    showTimeSlots: false,
                    selectedDate: null,
                    existingBookings: r.existingBookings.filter((booking: BookingData) => 
                      booking.date.toISOString().split('T')[0] !== r.selectedDate?.toISOString().split('T')[0]
                    )
                  }
                : r
            )
          }
        : studio
    );
    
    // Update the state with the new data
    setStudios(updatedStudios);
  };

  /**
   * Compares original and current studio data to generate updates
   */
  const generateUpdates = () => {
    const updates: any[] = [];
    
    console.log("generateUpdates:", JSON.stringify(studios))
    console.log("apiStudios:", JSON.stringify(tempStudioData))
    // Iterate through each studio
    studios.forEach(studio => {
      // Find corresponding studio in apiStudios
      const apiStudio = tempStudioData.find(s => s._id === studio._id);
      if (!apiStudio) return;

      // Iterate through each room
      studio.rooms.forEach(room => {
        // Find corresponding room in apiStudio
        const apiRoom = apiStudio.rooms.find(r => r._id === room._id);
        if (!apiRoom) return;

        // Create a deep copy of existing bookings to avoid mutating the original
        const updatedBookings = room.existingBookings ? JSON.parse(JSON.stringify(room.existingBookings)) : [];
        updatedBookings.forEach((booking: any) => {
          if (booking.date && typeof booking.date === 'string') {
            booking.date = new Date(booking.date);
          }
          booking.slots = booking.slots.filter((slot: BookingSlotsDetails) => slot.status !== 'available');
        });

        // If current room has no bookings but API room has bookings, mark all API bookings as delete
        if (updatedBookings.length === 0 && apiRoom.existingBookings && apiRoom.existingBookings.length > 0) {
          apiRoom.existingBookings.forEach((apiBooking: BookingData) => {
            apiBooking.slots.forEach((apiSlot: BookingSlotsDetails) => {
              updates.push({
                studioId: room._id,
                roomId: studio._id,
                date: formatDate(apiBooking.date),
                timeSlotSection: apiSlot.timeSlotSection,
                sectionDescription: "-",
                status: 'delete'
              });
            });
          });
          return;
        }
      
        // Compare existingBookings
        updatedBookings?.forEach((booking: BookingData) => {
          const formattedDate = formatDate(booking.date);
          
          // Find corresponding booking in apiRoom
          const apiBooking = apiRoom.existingBookings?.find(b => 
            formatDate(b.date) === formattedDate
          );


          // Compare slots
          booking.slots.forEach(slot => {
            const apiSlot = apiBooking?.slots.find(s => s.timeSlotSection === slot.timeSlotSection);
            
            // If slot doesn't exist in api data or status is different, add to updates
            if (!apiSlot || apiSlot.status !== slot.status) {
              updates.push({
                studioId: room._id,
                roomId: studio._id,
                date: formattedDate,
                timeSlotSection: slot.timeSlotSection,
                sectionDescription: "-",
                status: slot.status
              });
            }
          });

          // Check for deleted slots in apiBooking
          if (apiBooking) {
            apiBooking.slots.forEach(apiSlot => {
              const existingSlot = booking.slots.find(s => s.timeSlotSection === apiSlot.timeSlotSection);
              if (!existingSlot) {
                updates.push({
                  studioId: room._id,
                  roomId: studio._id,
                  date: formattedDate,
                  timeSlotSection: apiSlot.timeSlotSection,
                  sectionDescription: "-",
                  status: 'delete'
                });
              }
            });
          }
        });


        apiRoom.existingBookings?.forEach((apiBooking: BookingData) => {
          if (apiBooking.date && typeof apiBooking.date === 'string') {
            apiBooking.date = new Date(apiBooking.date);
          }
          const missingBooking = updatedBookings?.find((b: BookingData) => 
            formatDate(b.date) === formatDate(apiBooking.date)
          );
          if(!missingBooking){
            apiRoom.existingBookings = apiRoom.existingBookings?.filter((b: BookingData) => 
              formatDate(b.date) === formatDate(apiBooking.date)
            );
            console.log("missingBooking:", apiRoom.existingBookings[0])
            apiRoom.existingBookings[0].slots.forEach((slot: BookingSlotsDetails) => {
               updates.push({
                  studioId: room._id,
                  roomId: studio._id,
                  date: formatDate(apiRoom.existingBookings[0].date),
                  timeSlotSection: slot.timeSlotSection,
                  sectionDescription: "-",
                  status: 'delete'
                });
            });
          }
        });
      });
    });

    return updates;
  };

  /**
   * Handles form submission
   * Validates that all rooms with selected dates have at least one selected time slot
   */
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
      const updates = generateUpdates();
      console.log("updates:", updates)
      if (updates.length > 0) {
        const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
        const token = localStorage.getItem(`${userType}_auth_token`);
        
        if (!token) {
          throw new Error('未登入或登入已過期');
        }

        const response = await fetch(ApiUtils.getApiUrl('api/studio-status/batch-update'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ updates })
        });

        if (!response.ok) {
          throw new Error('更新失敗');
        }

        // Refresh room status after successful update
        await fetchRoomStatus(selectedStudio!);
      }
      
      setSuccessMessage("更新成功");
      setIsLoading(false);
      setHasUpdates(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating studio status:', err);
      setError("更新失敗，請重試");
      setIsLoading(false);
    }
  };
  
  /**
   * Returns the appropriate CSS class for a status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-500 text-white';
      case 'confirmed':
        return 'bg-blue-500 text-white';
      case 'blocked':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-purple-500 text-white';
      case 'available':
      default:
        return 'bg-emerald-500 text-white';
    }
  };

  /**
   * Returns the display text for a status
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case 'requested':
        return '待導師確認';
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

  /**
   * Handles studio selection
   * Fetches room status for the selected studio
   */
  const handleStudioSelection = async (studioId: string) => {
    console.log("handleStudioSelection - Selecting studio:", studioId);
    setError(null);
    setIsLoading(true);
    setSelectedStudio(studioId);
    try {
      console.log("handleStudioSelection - Fetching piano rooms");
      await fetchPianoRooms(false);
      console.log("handleStudioSelection - Fetching room status");
      await fetchRoomStatus(studioId);
    } catch (error) {
      console.error('Error refreshing studio data:', error);
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingScreen />
          </div>
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
                            key={room._id} 
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
                                      console.log("e",e.target.value)
                                      if (e.target.value === "add-new") {
                                        handleAddNewDate(selectedStudio, room._id);
                                      } else if (e.target.value) {
                                        handleDateChange(selectedStudio, room._id, new Date(e.target.value));
                                      } else {
                                        handleDateChange(selectedStudio, room._id, null);
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
                                    onChange={(date) => handleDatePickerSelect(selectedStudio, room._id, date)}
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
                                    onClick={() => handleCancelAddDate(selectedStudio, room._id)}
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
                                    <span>待導師確認</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <span>不可預約</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                    <span>待取消</span>
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
                                            handleTimeSlotAction(selectedStudio, room._id, index, 'cancel');
                                          } else if (slot.status === 'blocked') {
                                            handleTimeSlotAction(selectedStudio, room._id, index, 'unblock');
                                          } else {
                                            handleTimeSlotAction(selectedStudio, room._id, index, 'block');
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
                                          onClick={() => handleTimeSlotAction(selectedStudio, room._id, index, 'cancel')}
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
                                    onClick={() => handleConfirmTimeSlots(selectedStudio, room._id)}
                                    className="text-blue-600 hover:underline"
                                  >
                                    確認
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDate(selectedStudio, room._id)}
                                    className="text-red-600 hover:underline"
                                  >
                                    移除日期
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
                                                  r._id === room._id
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
                      <ButtonPrimary 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading || !hasUpdates}
                      >
                        {isLoading ? "處理中..." : "更新琴房"}
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