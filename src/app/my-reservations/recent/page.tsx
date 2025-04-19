'use client';

import { useState, useEffect } from 'react';
import { ApiUtils } from '@/utils/ApiUtils';
import { UserTypeUtils } from '@/utils/UserTypeUtils';
import { TimeSlots } from "@/utils/timeSlots";
import { useRouter } from 'next/navigation';

interface Reservation {
  id: string;
  bookingDate: string;
  location: string;
  time: string;
  status: string;
  studentName: string;
  studioName?: string;
  roomName?: string;
  district?: string;
  address?: string;
  sectionDescription?: string;
  remark?: string;
  createdAt?: string;
}

const RecentReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
        const token = localStorage.getItem(`${userType}_auth_token`);
        if (!token) throw new Error('未登入或憑證失效');
        const res = await fetch(
          ApiUtils.getApiUrl('api/studio-status/students/mybooking'),
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': '*/*',
              'Content-Type': 'application/json',
            },
          }
        );
        if (!res.ok) throw new Error('無法取得預約資料');
        const data = await res.json();
        const bookings = data.bookings.map((b: any) => ({
          id: b._id,
          bookingDate: b.date ? b.date.split('T')[0] : '',
          location: b.pianoRoom?.district + ' ' + b.pianoRoom?.address,
          time: b.timeSlotSection,
          status: b.status,
          studentName: b.student?.name,
          studioName: b.studioId?.name,
          roomName: b.pianoRoom?.name,
          district: b.pianoRoom?.district,
          address: b.pianoRoom?.address,
          sectionDescription: b.sectionDescription,
          remark: b.remark,
          createdAt: b.createdAt,
        }));
        setReservations(bookings);
      } catch (err: any) {
        setError(err.message || '發生錯誤');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleCancelReservation = async (id: string) => {
    setCancelLoadingId(id);
    setError(null);
    try {
      const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
      const resp= await ApiUtils.makeAuthenticatedRequest(
        ApiUtils.getApiUrl('api/studio-status/students/cancel-booking'),
        'POST',
        { bookingId: id},
        userType
      );
      
      if (resp.success) {
        router.refresh(); // only refresh if success
      }else{
        let msg = resp.message || '取消預約失敗';
        setError(msg);
      }
    } catch (err: any) {
      let msg = '取消預約失敗';
      if (err?.message) {
        msg = err.message;
      } else if (typeof err === 'string') {
        msg = err;
      } else if (err?.response?.message) {
        msg = err.response.message;
      }
      setError(msg);
    } finally {
      setCancelLoadingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'requested':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="text-lg text-gray-500 dark:text-gray-300">載入中...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-neutral-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 min-h-[50vh]">
            {error && (
              <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300 text-center">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-center mb-4">近期預約</h2>
              <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-6"></div>
              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <div className="flex items-center justify-center min-h-[20vh]">
                    <span className="text-lg text-gray-500 dark:text-gray-300">沒有預約課程。</span>
                  </div>
                ) : (
                  reservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-[0_2px_12px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.07)] transition-shadow duration-200 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
                      style={{ minHeight: '120px' }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-xl font-semibold text-gray-900 dark:text-white truncate">{reservation.studentName}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                            {reservation.status === 'confirmed' ? '已確認' :
                              reservation.status === 'pending' ? '待確認' :
                              reservation.status === 'cancelled' ? '已取消' :
                              reservation.status === 'requestCanceled' ? '等待退款' :
                              reservation.status === 'requested' ? '配對導師中' : reservation.status}
                          </span>
                        </div>
                        <div className="flex flex-col gap-y-1 text-gray-700 dark:text-gray-300 text-sm">
                          <div>
                            <span className="font-medium">預約日期：</span>{reservation.bookingDate}
                            <span className="ml-4 font-medium"></span>{TimeSlots.slotToTime(reservation.time)}
                          </div>
                          <div>
                            <span className="font-medium">上課類別：</span>{reservation.sectionDescription}
                            {/*reservation.remark && <span className="ml-4 font-medium">備註：</span> {reservation.remark}*/}
                          </div>
                          <div>
                            <span className="font-medium">琴房：</span>{reservation.roomName}
                            <span className="ml-4 font-medium">分區：</span>{reservation.district}
                            {/*reservation.studioName && (
                              <span className="ml-4 text-base text-gray-500 dark:text-gray-300 font-medium">{reservation.studioName}</span>
                            )*/}
                          </div>
                          <div>
                            <span className="font-medium">地址：</span>{reservation.address}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-[120px]">
                        {reservation.status !== 'cancelled' && reservation.status !== 'requestCanceled' && (
                          <button
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="inline-flex items-center px-5 py-2 border border-red-300 text-sm font-medium rounded-full text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
                            style={{ fontWeight: 500, letterSpacing: '0.02em' }}
                            disabled={cancelLoadingId === reservation.id}
                          >
                            {cancelLoadingId === reservation.id ? '取消中...' : '取消預約'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentReservationsPage;