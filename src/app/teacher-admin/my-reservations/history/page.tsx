'use client';

import React, { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { usePathname } from 'next/navigation';
import { ApiUtils } from '@/utils/ApiUtils';
import { UserTypeUtils } from '@/utils/UserTypeUtils';

interface TeacherHistoryReservation {
  id: string;
  studentName: string;
  date: string;
  location: string;
  duration: string;
  teacher: string;
  notes: string;
}

const TeacherHistoryReservationsPage = () => {
  const [reservations, setReservations] = useState<TeacherHistoryReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const userType = UserTypeUtils.getUserTypeFromPathname(pathname);
    ApiUtils.makeAuthenticatedRequest(
      ApiUtils.getApiUrl('api/teacher-admin/getAllHistoryReversation'),
      'GET',
      null,
      userType
    )
      .then(res => {
        if (res.success) setReservations(res.data);
        else setError('Failed to load history');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [pathname]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-5xl mx-auto py-0 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 min-h-[50vh]">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300 text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-center mb-4">上課紀錄</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-6"></div>
            <div className="space-y-3">
              {reservations.length === 0 ? (
                <div className="flex items-center justify-center min-h-[20vh]">
                  <span className="text-lg text-gray-500 dark:text-gray-300">沒有上課紀錄。</span>
                </div>
              ) : (
                reservations.map((history) => (
                  <div
                    key={history.id}
                    className="border-b border-neutral-200 dark:border-neutral-700 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{history.date}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{history.location}</p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{history.duration}</span>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">導師：{history.teacher}</p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{history.notes}</p>
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
