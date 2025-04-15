"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextType {
  bookingParams: {
    district: string | null;
    date: string | null;
    time: string | null;
    student: string | null;
    type: string | null;
  };
  setBookingParams: (params: {
    district: string | null;
    date: string | null;
    time: string | null;
    student: string | null;
    type: string | null;
  }) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingParams, setBookingParams] = useState<BookingContextType['bookingParams']>({
    district: null,
    date: null,
    time: null,
    student: null,
    type: null,
  });

  return (
    <BookingContext.Provider value={{ bookingParams, setBookingParams }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}; 