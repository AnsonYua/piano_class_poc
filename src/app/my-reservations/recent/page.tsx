'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Route } from '@/routers/types';

interface Reservation {
  id: string;
  bookingDate: string;
  location: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  studentName: string;
}

const RecentReservationsPage = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      bookingDate: '2024-04-10',
      location: '台北市信義區',
      time: '14:00',
      status: 'confirmed',
      studentName: '王小明',
    },
    {
      id: '2',
      bookingDate: '2024-04-15',
      location: '台北市信義區',
      time: '15:30',
      status: 'pending',
      studentName: '李小華',
    },
  ]);

  const handleCancelReservation = (id: string) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: 'cancelled' } : res
    ));
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-5xl mx-auto py-0 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-center mb-4">近期預約</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-6"></div>
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium">{reservation.studentName}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {reservation.status === 'confirmed' ? '已確認' : 
                           reservation.status === 'pending' ? '待確認' : '已取消'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>預約日期：{reservation.bookingDate}</p>
                        <p>上課時間：{reservation.time}</p>
                        <p>上課地點：{reservation.location}</p>
                      </div>
                    </div>
                    {reservation.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        取消預約
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentReservationsPage; 