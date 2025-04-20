'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Route } from '@/routers/types';
import { ApiUtils } from '@/utils/ApiUtils';
import { UserTypeUtils } from '@/utils/UserTypeUtils';
import { TimeSlots } from '@/utils/timeSlots';
interface ClassHistory {
  id: string;
  studentName: string;
  date: string;
  location: string;
  duration: string;
  teacher: string;
  notes: string;
  status: string;
}

const ClassHistoryPage = () => {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [classHistory, setClassHistory] = useState<ClassHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
        const url = ApiUtils.getUserProfileUrl(userType);
        const profileData = await ApiUtils.makeAuthenticatedRequest(url, 'GET', null, userType);
        // Adapted for actual API response structure
        // Handle both previous and new response structures
        let students: { id: string; name: string }[] = [];
        if (profileData && Array.isArray(profileData.data)) {
          // Old structure: data[].student
          students = profileData.data
            .map((item: any) => item.student)
            .filter((student: any) => student && student._id)
            .map((student: any) => ({
              id: student._id,
              name: student.name,
            }));
        } else if (profileData && profileData.user && Array.isArray(profileData.user.student)) {
          // New structure: user.student[]
          students = profileData.user.student
            .filter((student: any) => student && student._id)
            .map((student: any) => ({
              id: student._id,
              name: student.name,
            }));
        }
        setStudents(students);
        if (students.length > 0) {
          setSelectedStudent(students[0].id + (students[0].name || ''));
        }
      } catch (e: any) {
        setError('無法獲取學生資料');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Helper: get studentIdx (index) from selectedStudent composite key
  const getStudentIdx = () => {
    if (!selectedStudent) return null;
    // Find the index in the students array that matches the selectedStudent composite key
    return students.findIndex(s => getStudentKey(s) === selectedStudent);
  };

  useEffect(() => {
    const fetchLessons = async () => {
      const studentIdx = getStudentIdx();
      if (studentIdx === -1 || studentIdx === null) {
        setClassHistory([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
        const url = ApiUtils.getApiUrl(`/api/user/student-lessons?studentIdx=${studentIdx}`);
        const lessonsData = await ApiUtils.makeAuthenticatedRequest(url, 'GET', null, userType);
        const lessonArray = Array.isArray(lessonsData?.data) ? lessonsData.data : [];
        setClassHistory(
          lessonArray.map((l: any) => ({
            id: String(l._id || l.id),
            studentName: l.student?.name || '',
            date: l.date,
            location: l.sectionDescription || l.location || '',
            duration: l.timeSlotSection || l.duration || '',
            teacher: l.teacher || '',
            notes: Array.isArray(l.options) ? l.options.join('，') : (l.lessonComment || ''),
            status: l.status || '',
          }))
        );
      } catch (e: any) {
        setError('無法獲取課程紀錄');
        setClassHistory([]);
      } finally {
        setLoading(false);
      }
    };
    if (selectedStudent) {
      fetchLessons();
    } else {
      setClassHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudent]);

  const getStudentKey = (student: {id: string, name: string}) => student.id + (student.name || '');

  const filteredHistory = selectedStudent
    ? classHistory
    : [];

  return (
    <div className="bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-5xl mx-auto py-0 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-center mb-4">上課紀錄</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Student List Column */}
              <div className="md:col-span-3">
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">學生列表</h3>
                  <div className="md:hidden mb-3">
                    <select
                      value={selectedStudent || ''}
                      onChange={(e) => setSelectedStudent(e.target.value || null)}
                      className="w-full p-2 border border-gray-300 dark:border-neutral-600 rounded-md"
                      disabled={loading}
                    >
                      <option value="">所有學生</option>
                      {students.map((student) => (
                        <option key={getStudentKey(student)} value={getStudentKey(student)}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden md:block space-y-1">
                    {students.map((student) => (
                      <button
                        key={getStudentKey(student)}
                        onClick={() => setSelectedStudent(getStudentKey(student))}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                          selectedStudent === getStudentKey(student)
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                            : 'hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300'
                        }`}
                        disabled={loading}
                      >
                        {student.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Class History Column */}
              <div className="md:col-span-9">
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">上課紀錄</h3>
                  <div className="space-y-3">
                    {loading && <div className="text-center text-gray-400">載入中...</div>}
                    {error && <div className="text-center text-red-500">{error}</div>}
                    {!loading && !error && filteredHistory.length === 0 && (
                      <div className="text-center text-gray-400">沒有上課紀錄</div>
                    )}
                    {!loading && !error && filteredHistory.map((history) => (
                      <div
                        key={history.id}
                        className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-[0_2px_12px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.07)] transition-shadow duration-200 px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">{history.studentName}</span>
                            {/* Status badge */}
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              history.status === 'open' ? 'bg-green-100 text-green-800' :
                              history.status === 'pendingForComment' ? 'bg-yellow-100 text-yellow-800' :
                              history.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              history.status === 'requestCanceled' ? 'bg-blue-100 text-blue-800' :
                              history.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                              'bg-gray-100 text-gray-800'}
                            `}>
                              {history.status === 'open' ? '已確認' :
                                history.status === 'pendingForComment' ? '待補上課後評估' :
                                history.status === 'canceled' ? '已取消' :
                                history.status === 'requestCanceled' ? '等待退款' :
                                history.status === 'closed' ? '已完成' : history.status}
                            </span>
                          </div>
                          <div className="flex flex-col gap-y-1 text-gray-700 dark:text-gray-300 text-sm">
                            <div className="flex flex-wrap gap-x-2 sm:gap-x-4">
                              <div>
                                <span className="font-medium">上課日期：</span>{history.date ? new Date(history.date).toLocaleDateString() : ''}
                              </div>
                              <div>
                                <span className="font-medium">時間：</span> {  TimeSlots.slotToDisplay(TimeSlots.slotToTime(history.duration))}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">上課類別：</span>{history.location || '一般課堂'}
                            </div>
                            {history.status === 'closed' && (
                              <div>
                                <span className="font-medium">課後評估：</span>{history.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassHistoryPage;