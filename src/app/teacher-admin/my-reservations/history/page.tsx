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

// --- Modal for 課後評估 ---
interface AppleStyleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: (opts: string[]) => void;
  remark: string;
  setRemark: (r: string) => void;
  evalType: 'lesson' | 'assessment';
  level: string;
  setLevel: (l: string) => void;
}

const AppleStyleModal: React.FC<AppleStyleModalProps> = ({
  open,
  onClose,
  onSubmit,
  options,
  selectedOptions,
  setSelectedOptions,
  remark,
  setRemark,
  evalType,
  level,
  setLevel
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto p-4 sm:p-8 relative animate-fadeIn border border-gray-200" style={{boxShadow:'0 16px 40px rgba(0,0,0,0.18)'}}>
        <button
          className="absolute top-3 sm:top-4 right-3 sm:right-4 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h2 className="text-center text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">課後評估</h2>
        <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>
          <div className="space-y-3 mb-6">
            {evalType === 'lesson' ? (
              <>
                {options.map(option => (
                  <label key={option} className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 border border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={e => {
                        if (e.target.checked) setSelectedOptions([...selectedOptions, option]);
                        else setSelectedOptions(selectedOptions.filter(o => o !== option));
                      }}
                      className="accent-blue-600 w-5 h-5"
                    />
                    <span className="text-gray-800 text-sm sm:text-base">{option}</span>
                  </label>
                ))}
              </>
            ) : (
              <div className="mb-4">
                <label className="block text-gray-800 font-medium mb-2" htmlFor="level">學生等級</label>
                <select
                  id="level"
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 p-3 text-base text-gray-800 bg-gray-50 shadow-sm"
                >
                  {[...Array(8)].map((_, i) => (
                    <option key={i+1} value={String(i+1)}>{i+1}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="mt-6">
              <label className="block text-gray-800 font-medium mb-2" htmlFor="remark">備註</label>
              <div className="relative">
                <textarea
                  id="remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 p-3 min-h-[70px] text-base text-gray-800 bg-gray-50 resize-none shadow-sm"
                  placeholder="請輸入備註..."
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow transition-all text-base sm:text-lg"
          >
            提交
          </button>
        </form>
      </div>
    </div>
  );
};

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

  const [evalType, setEvalType] = useState<'lesson' | 'assessment'>('lesson');
  const [level, setLevel] = useState('1');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLessonId, setModalLessonId] = useState<string|null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [remark, setRemark] = useState('');
  const evalOptions = [
    '學生準時出席',
    '學生積極參與',
    '課堂內容完成',
    '需加強練習',
    '學生表現良好',
  ];

  const handleOpenEvalModal = (lessonId: string, sectionDescription?: string) => {
    setModalLessonId(lessonId);
    setSelectedOptions([]);
    setRemark('');
    if (sectionDescription === '評估') {
      setEvalType('assessment');
      setLevel('1');
    } else {
      setEvalType('lesson');
    }
    setModalOpen(true);
  };
  const handleCloseEvalModal = () => {
    setModalOpen(false);
    setModalLessonId(null);
  };
  const handleSubmitEval = async () => {
    if (!modalLessonId) return;
    setActionLoading(modalLessonId);
    setError(null);
    try {
      const url = ApiUtils.getApiUrl(`/api/teacher-admin/teacherLessons/${modalLessonId}/comment`);
      let data: any;
      if (evalType === 'assessment') {
        data = {
          level,
          remark,
          type: 'assessment',
        };
      } else {
        data = {
          options: selectedOptions,
          remark,
          type: 'lesson',
        };
      }
      const result = await ApiUtils.makeAuthenticatedRequest(url, 'PATCH', data, userType);
      if (result && (result.success || result.status === 200)) {
        setModalOpen(false);
        setModalLessonId(null);
        setRemark('');
        if (typeof window !== 'undefined') {
          window.location.reload();
        } else {
          fetchReservations();
        }
      } else {
        throw new Error(result?.message || '提交失敗，請稍後再試');
      }
    } catch (err: any) {
      setError(err.message || '提交失敗，請稍後再試');
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
      <div className="container max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-4 sm:p-6 min-h-[50vh]">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-2 sm:mb-4">上課紀錄</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-4 sm:mb-6"></div>
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="flex items-center justify-center min-h-[20vh]">
                  <span className="text-lg text-gray-500 dark:text-gray-300">沒有上課紀錄。</span>
                </div>
              ) : (
                reservations.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-[0_2px_12px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.07)] transition-shadow duration-200 px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">{item.student?.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.status === 'open' ? 'bg-green-100 text-green-800' : item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : item.status === 'cancelled' ? 'bg-red-100 text-red-800' : item.status === 'requestCanceled' ? 'bg-blue-100 text-blue-800' : item.status === 'requested' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.status === 'open' ? '已確認' :
                            item.status === 'pendingForComment' ? '請補上課後評估' :
                            item.status === 'cancelled' ? '已取消' :
                            item.status === 'requestCanceled' ? '等待退款' :
                            item.status === 'closed' ? '已完成' : item.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-y-1 text-gray-700 dark:text-gray-300 text-sm">
                        <div className="flex flex-wrap gap-x-2 sm:gap-x-4">
                          <div>
                            <span className="font-medium">上課日期：</span>{item.date ? new Date(item.date).toLocaleDateString() : ''}
                          </div>
                          <div>
                            <span className="font-medium">時間：</span>{TimeSlots.slotToDisplay(TimeSlots.slotToTime(item.timeSlotSection))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">上課類別：</span>{item.sectionDescription || '一般課堂'}
                        </div>
                        <div>
                          <span className="font-medium">學生資料：</span>{item.student?.name}
                          {item.student?.age && <span className="ml-2">{item.student?.age}歲</span>}
                        </div>
                        <div className="flex flex-wrap gap-x-2 sm:gap-x-4">
                          <div>
                            <span className="font-medium">琴房：</span>{item.room?.name}
                          </div>
                          <div>
                            <span className="font-medium">分區：</span>{item.room?.district || ''}
                          </div>
                          {item.studio?.name && (
                            <div>
                              <span className="font-medium">琴室：</span>{item.studio?.name}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">地址：</span>{item.room?.address || ''}
                        </div>
                        <div>
                          <span className="font-medium">聯絡電話：</span>{item.user?.contactNumber}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col justify-end sm:items-end gap-2 mt-3 sm:mt-0 min-w-[120px]">
                    {item.status != 'closed' && (
                      <button
                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-5 py-2 border border-blue-300 text-sm font-medium rounded-full text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        type="button"
                        disabled={actionLoading === item._id}
                        onClick={item.status === 'pendingForComment' ? () => handleOpenEvalModal(item._id, item.sectionDescription) : () => handleCompleteLesson(item._id)}
                      >
                        {actionLoading === item._id ? (
                          <span className="flex items-center"><svg className="animate-spin h-4 w-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>處理中...</span>
                        ) : (
                          item.status === 'open' ? '完成上課' : item.status === 'pendingForComment' ? '課後評估' : '課後評估'
                        )}
                      </button>
                      )}
                      {item.status === 'open' && (
                        <button
                          className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-5 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow-sm"
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
      <AppleStyleModal
        open={modalOpen}
        onClose={handleCloseEvalModal}
        onSubmit={handleSubmitEval}
        options={evalOptions}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        remark={remark}
        setRemark={setRemark}
        evalType={evalType}
        level={level}
        setLevel={setLevel}
      />
    </div>
  );
};

export default TeacherHistoryReservationsPage;
