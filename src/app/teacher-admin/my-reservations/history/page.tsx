'use client';

import React, { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { usePathname } from 'next/navigation';
import { ApiUtils } from '@/utils/ApiUtils';
import { UserTypeUtils } from '@/utils/UserTypeUtils';
import { TimeSlots } from '@/utils/timeSlots';

// --- Added for fetching lesson history ---
const LESSON_HISTORY_API_URL = ApiUtils.getApiUrl('/api/teacher-admin/getAllMyLession');

interface LessonHistoryItem {
  _id: string;
  status: string;
  date: string;
  timeSlotSection: string;
  sectionDescription: string;
  room: {
    _id: string;
    name: string;
    district: string;
    address: string;
  };
  studio: {
    _id: string;
    name: string;
    pianoRoomId: string;
    status: string;
    description: string;
  };
  user: {
    _id: string;
    role: string;
    contactNumber: string;
    name: string;
    isVerified: boolean;
    accountStatus: string;
    loginFailCount: number;
    verifyOtpCount: number;
    resetFailCount: number;
    createdAt: string;
  };
  student: {
    name: string;
    age: number;
    _id: string;
    createdAt: string;
  };
}

const TeacherHistoryReservationsPage = () => {
  const pathname = usePathname();
  const userType = UserTypeUtils.getUserTypeFromPathname(pathname);

  const [reservations, setReservations] = useState<LessonHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // reservation id being updated

  // Helper to get JWT (now uses UserTypeUtils)
  const jwtToken = UserTypeUtils.getAuthToken(userType);

  const fetchReservations = () => {
    setLoading(true);
    setError(null);
    ApiUtils.makeAuthenticatedRequest(LESSON_HISTORY_API_URL, 'GET', null, userType)
      .then((data) => {
        if (data.success) {
          setReservations(data.data);
        } else {
          setError('Failed to load lesson history');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // PATCH 完成上課
  const handleCompleteLesson = async (lessonId: string) => {
    setActionLoading(lessonId);
    setError(null);
    try {
      const url = ApiUtils.getApiUrl(`/api/teacher-admin/teacherLessons/${lessonId}/status`);
      const result = await ApiUtils.makeAuthenticatedRequest(url, 'PATCH', null, userType);
      
      if (result && (result.success || result.status === 200)) {
        if (typeof window !== 'undefined') {
          window.location.reload();
        } else {
          fetchReservations();
        }
      } else {
        throw new Error(result?.message || '操作失敗，請稍後再試');
      }
    } catch (err: any) {
      setError(err.message || '操作失敗，請稍後再試');
    } finally {
      setActionLoading(null);
    }
  };

  // PATCH 取消上課
  const handleCancelLesson = async (lessonId: string) => {
    setActionLoading(lessonId);
    setError(null);
    try {
      const url = ApiUtils.getApiUrl(`/api/teacher-admin/teacherLessons/${lessonId}/cancel`);
      const result = await ApiUtils.makeAuthenticatedRequest(url, 'PATCH', null, userType);
      if (result && (result.success || result.status === 200)) {
        if (typeof window !== 'undefined') {
          window.location.reload();
        } else {
          fetchReservations();
        }
      } else {
        throw new Error(result?.message || '取消失敗，請稍後再試');
      }
    } catch (err: any) {
      setError(err.message || '取消失敗，請稍後再試');
    } finally {
      setActionLoading(null);
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
            <h2 className="text-3xl font-semibold text-center mb-4">上課紀錄</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-6"></div>
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="flex items-center justify-center min-h-[20vh]">
                  <span className="text-lg text-gray-500 dark:text-gray-300">沒有上課紀錄。</span>
                </div>
              ) : (
                reservations.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-[0_2px_12px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.07)] transition-shadow duration-200 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
                    style={{ minHeight: '120px' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-xl font-semibold text-gray-900 dark:text-white truncate">{item.student?.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.status === 'open' ? 'bg-green-100 text-green-800' : item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : item.status === 'cancelled' ? 'bg-red-100 text-red-800' : item.status === 'requestCanceled' ? 'bg-blue-100 text-blue-800' : item.status === 'requested' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.status === 'open' ? '已確認' :
                            item.status === 'pendingForComment' ? '請補上課後評估' :
                            item.status === 'cancelled' ? '已取消' :
                            item.status === 'requestCanceled' ? '等待退款' :
                            item.status === 'requested' ? '配對導師中' : item.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-y-1 text-gray-700 dark:text-gray-300 text-sm">
                        <div>
                          <span className="font-medium">上課日期：</span>{item.date ? new Date(item.date).toLocaleDateString() : ''}
                          <span className="ml-4 font-medium"></span>{TimeSlots.slotToTime(item.timeSlotSection)}
                        </div>
                        <div>
                          <span className="font-medium">上課類別：</span>{item.sectionDescription || '一般課堂'}
                        </div>
                        <div>
                          <span className="font-medium">學生資料：</span>{item.student?.name}
                          {item.student?.age && <span className="ml-2">{item.student?.age}歲</span>}
                        </div>
                        <div>
                          <span className="font-medium">琴房：</span>{item.room?.name}
                          <span className="ml-4 font-medium">分區：</span>{item.room?.district || ''}
                          {item.studio?.name && <span className="ml-4 font-medium">琴室：</span>}
                          {item.studio?.name}
                        </div>
                        <div>
                          <span className="font-medium">地址：</span>{item.room?.address || ''}
                        </div>
                        <div>
                          <span className="font-medium">聯絡電話：</span>{item.user?.contactNumber}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                      <button
                        className="inline-flex items-center px-5 py-2 border border-blue-300 text-sm font-medium rounded-full text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        type="button"
                        disabled={actionLoading === item._id}
                        onClick={() => handleCompleteLesson(item._id)}
                      >
                        {actionLoading === item._id ? (
                          <span className="flex items-center"><svg className="animate-spin h-4 w-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>處理中...</span>
                        ) : (
                          item.status === 'open' ? '完成上課' :'課後評估'
                        )}
                      </button>
                      {item.status === 'open' && (
                        <button
                          className="inline-flex items-center px-5 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow-sm mt-2"
                          type="button"
                          disabled={actionLoading === item._id}
                          onClick={() => handleCancelLesson(item._id)}
                        >
                          取消上課
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

export default TeacherHistoryReservationsPage;
