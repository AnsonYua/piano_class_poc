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

// Available districts for filtering
const DISTRICTS = [
  '全部',
  '北角',
  '銅鑼灣',
  '灣仔',
  '中環',
  '尖沙咀',
  '旺角',
  '觀塘',
  '沙田',
  '荃灣',
];

// Age ranges for filtering
const AGE_RANGES = [
  { label: '全部', min: 0, max: 100 },
  { label: '3-6歲', min: 3, max: 6 },
  { label: '7-10歲', min: 7, max: 10 },
  { label: '11-14歲', min: 11, max: 14 },
  { label: '15-18歲', min: 15, max: 18 },
  { label: '18歲以上', min: 18, max: 100 },
];

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
  const [filteredReservations, setFilteredReservations] = useState<TeacherReservation[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('全部');
  const [selectedAgeRange, setSelectedAgeRange] = useState<{label: string, min: number, max: number}>(AGE_RANGES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [acceptLoadingId, setAcceptLoadingId] = useState<string | null>(null);
  const [acceptSuccessId, setAcceptSuccessId] = useState<string | null>(null);
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
          setFilteredReservations(mappedReservations);
        } else {
          setError('Failed to load reservations');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [pathname]);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...reservations];
    
    // Apply district filter
    if (selectedDistrict !== '全部') {
      filtered = filtered.filter(res => res.district === selectedDistrict);
    }
    
    // Apply age filter
    if (selectedAgeRange.label !== '全部') {
      filtered = filtered.filter(res => {
        const age = Number(res.studentAge);
        return !isNaN(age) && age >= selectedAgeRange.min && age <= selectedAgeRange.max;
      });
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(res => 
        res.studentName?.toLowerCase().includes(query) || 
        res.location?.toLowerCase().includes(query) ||
        res.roomName?.toLowerCase().includes(query)
      );
    }
    
    setFilteredReservations(filtered);
  }, [reservations, selectedDistrict, selectedAgeRange, searchQuery]);

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

  // Handler for 接單 (Accept Order)
  const handleAcceptOrder = async (id: string) => {
    setAcceptLoadingId(id);
    setError(null);
    setAcceptSuccessId(null);
    try {
      const userType = UserTypeUtils.getUserTypeFromPathname(pathname);
      const url = ApiUtils.getApiUrl(`/api/teacher-admin/confirm/${id}`);
      const resp = await ApiUtils.makeAuthenticatedRequest(
        url,
        'PATCH',
        null,
        userType
      );
      if (resp.success) {
        setAcceptSuccessId(id);
        // Optionally update UI or refresh
        router.refresh();
      } else {
        setError(resp.message || '接單失敗');
      }
    } catch (err: any) {
      setError(err.message || '接單時發生錯誤');
    } finally {
      setAcceptLoadingId(null);
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
            
            {/* Filter Bar */}
            <div className="bg-gray-50 dark:bg-neutral-800/70 rounded-xl p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                {/* Search input 
                <div className="w-full md:w-1/3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md leading-5 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="搜尋學生名稱或地點"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                */}
                
                {/* District filter */}
                <div className="w-full md:w-auto">
                  <label htmlFor="district-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    地區
                  </label>
                  <select
                    id="district-filter"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                  >
                    {DISTRICTS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Age range filter */}
                <div className="w-full md:w-auto">
                  <label htmlFor="age-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    年齡範圍
                  </label>
                  <select
                    id="age-filter"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
                    value={selectedAgeRange.label}
                    onChange={(e) => {
                      const selected = AGE_RANGES.find(range => range.label === e.target.value);
                      if (selected) setSelectedAgeRange(selected);
                    }}
                  >
                    {AGE_RANGES.map((range) => (
                      <option key={range.label} value={range.label}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Reset filters button */}
                <div className="w-full md:w-auto md:self-end">
                  <button
                    type="button"
                    className="w-full md:w-auto mt-6 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                      setSelectedDistrict('全部');
                      setSelectedAgeRange(AGE_RANGES[0]);
                      setSearchQuery('');
                    }}
                  >
                    重設篩選
                  </button>
                </div>
              </div>
              
              {/* Filter summary */}
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                共找到 {filteredReservations.length} 個預約
                {selectedDistrict !== '全部' && ` · 地區: ${selectedDistrict}`}
                {selectedAgeRange.label !== '全部' && ` · 年齡: ${selectedAgeRange.label}`}
                {searchQuery && ` · 搜尋: "${searchQuery}"`}
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredReservations.length === 0 ? (
                <div className="flex items-center justify-center min-h-[20vh]">
                  <span className="text-lg text-gray-500 dark:text-gray-300">
                    {reservations.length === 0 ? '沒有預約課程。' : '沒有符合篩選條件的預約。'}
                  </span>
                </div>
               ) : (
                filteredReservations.map((reservation) => (
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
                      {reservation.status === 'requested' && (
                        <button
                          onClick={() => handleAcceptOrder(reservation.id)}
                          className="inline-flex items-center px-5 py-2 border border-blue-300 text-sm font-medium rounded-full text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                          style={{ fontWeight: 500, letterSpacing: '0.02em' }}
                          disabled={acceptLoadingId === reservation.id}
                        >
                          {acceptLoadingId === reservation.id ? '接單中...' : '接單'}
                        </button>
                      )}
                      {acceptSuccessId === reservation.id && (
                        <span className="text-green-600 dark:text-green-400 text-xs mt-2">已成功接單！</span>
                      )}
                      {/* Keep the cancel button for other statuses if needed */}
                      {reservation.status !== 'cancelled' && reservation.status !== 'requestCanceled' && reservation.status !== 'requested' && (
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
  );
};

export default TeacherRecentReservationsPage;
