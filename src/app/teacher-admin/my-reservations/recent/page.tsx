'use client';

import React, { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { usePathname } from 'next/navigation';
import { ApiUtils } from '@/utils/ApiUtils';
import { UserTypeUtils } from '@/utils/UserTypeUtils';
import { TimeSlots } from '@/utils/timeSlots';
import { useRouter } from 'next/navigation';

interface TeacherReservation {
  id: string;
  studentName: string;
  status: string;
  bookingDate: string;
  classDate: string;
  location: string;
  time: string;
  duration: string;
  roomName?: string;
  district?: string;
  address?: string;
  sectionDescription?: string;
  remark?: string;
  studioName?: string;
  studentAge?: string;
  studentGrade?: string;
  userContactNumber?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'requestCanceled':
      return 'bg-blue-100 text-blue-800';
    case 'requested':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TeacherRecentReservationsPage = () => {
  const [reservations, setReservations] = useState<TeacherReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const userType = UserTypeUtils.getUserTypeFromPathname(pathname);
    ApiUtils.makeAuthenticatedRequest(
      ApiUtils.getApiUrl('api/teacher-admin/getAllAvailabileReversation'),
      'GET',
      null,
      userType
    )
      .then(res => {
        if (res.success) {
          const mappedReservations = res.data.map((item: any) => ({
            id: item._id,
            studentName: item.student?.name || item.user?.name || '',
            status: item.status,
            bookingDate: item.date ? new Date(item.date).toLocaleDateString() : '',
            classDate: item.date ? new Date(item.date).toLocaleDateString() : '',
            location: `${item.room?.district || ''} ${item.room?.address || ''}`,
            time: item.timeSlotSection,
            duration: '30分鐘',
            roomName: item.room?.name || '',
            district: item.room?.district || '',
            address: item.room?.address || '',
            sectionDescription: item.sectionDescription || '一般課堂',
            remark: item.remark || '',
            studioName: item.studio?.name || '',
            studentAge: item.student?.age,
            studentGrade: item.student?.grade,
            userContactNumber: item.user?.contactNumber
          }));
          setReservations(mappedReservations);
        } else {
          setError('Failed to load reservations');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleCancelReservation = async (id: string) => {
    setCancelLoadingId(id);
    setError(null);
    try {
      const userType = UserTypeUtils.getUserTypeFromPathname(pathname);
      const resp = await ApiUtils.makeAuthenticatedRequest(
        ApiUtils.getApiUrl('api/teacher-admin/cancelReservation'),
        'POST',
        { reservationId: id },
        userType
      );

      if (resp.success) {
        router.refresh(); 
        setReservations(prev => 
          prev.map(res => res.id === id ? {...res, status: 'cancelled'} : res)
        );
      } else {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="text-lg text-gray-500 dark:text-gray-300">載入中...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-5xl mx-auto py-0 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 min-h-[50vh]">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 text-center">
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
                          <span className="ml-4 font-medium"></span>{reservation.time && reservation.time.startsWith('section') ? TimeSlots.slotToTime(reservation.time) : reservation.time}
                        </div>
                        <div>
                          <span className="font-medium">上課類別：</span>{reservation.sectionDescription || '一般課堂'}
                        </div>
                        <div>
                          <span className="font-medium">學生資料：</span>{reservation.studentName}
                          {reservation.studentAge && <span className="ml-2">{reservation.studentAge}歲</span>}
                          {reservation.studentGrade && <span className="ml-2">{reservation.studentGrade}級</span>}
                          {reservation.userContactNumber && <span className="ml-4 font-medium">聯絡電話：</span>}
                          {reservation.userContactNumber}
                        </div>
                        <div>
                          <span className="font-medium">琴房：</span>{reservation.roomName || reservation.location}
                          <span className="ml-4 font-medium">分區：</span>{reservation.district || ''}
                          {reservation.studioName && <span className="ml-4 font-medium">琴室：</span>}
                          {reservation.studioName}
                        </div>
                        <div>
                          <span className="font-medium">地址：</span>{reservation.address || reservation.location}
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
                          {cancelLoadingId === reservation.id ? '接單中...' : '接單'}
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
  );
};

export default TeacherRecentReservationsPage;
