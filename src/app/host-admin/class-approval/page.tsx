"use client";

import React, { useState, useEffect } from "react";
import AdminPageLayout from "@/components/AdminPageLayout";
import LoadingScreen from "@/components/LoadingScreen";
import { ApiUtils } from "@/utils/ApiUtils";
import { UserTypeUtils } from "@/utils/UserTypeUtils";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { TimeSlots } from '@/utils/timeSlots';

interface CancelRequest {
  _id: string;
  status: string;
  date: string;
  timeSlotSection: string;
  cancelReason: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
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
    __v: number;
  };
  room: {
    _id: string;
    name: string;
    district: string;
    address: string;
    __v: number;
  };
  studio: {
    _id: string;
    name: string;
    pianoRoomId: string;
    status: string;
    description: string;
    __v: number;
  };
  student: {
    name: string;
    age: number;
    _id: string;
    grade: string;
    createdAt: string;
  };
}

const HostAdminClassApprovalPage = () => {
  const [cancelRequests, setCancelRequests] = useState<CancelRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Add loading and error state for fund approval
  const [fundProcessingRequests, setFundProcessingRequests] = useState<Set<string>>(new Set());
  const [fundError, setFundError] = useState<string | null>(null);
  const [fundSuccessMessage, setFundSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCancelRequests();
    // eslint-disable-next-line
  }, []);

  const rawUserType = UserTypeUtils.getUserTypeFromPathname(typeof window !== 'undefined' ? window.location.pathname : '/host-admin');
  const userType: "teacher" | "shopOwner" | "hostAdmin" =
    rawUserType === "teacher" || rawUserType === "shopOwner" || rawUserType === "hostAdmin"
      ? rawUserType
      : "hostAdmin";

  const fetchCancelRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = ApiUtils.getApiUrl("/api/host-admin/getCancelRequest");
      const response = await ApiUtils.makeAuthenticatedRequest(
        url,
        "GET",
        null,
        userType
      );
      if (response.success) {
        setCancelRequests(response.data);
      } else {
        setError(response.message || "獲取課堂取消申請失敗");
      }
    } catch (err) {
      setError("獲取課堂取消申請時發生錯誤");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    setProcessingRequests(prev => new Set(prev).add(requestId));
    setError(null);
    setSuccessMessage(null);
    try {
      // PATCH /api/host-admin/approveCancelRequest/:id
      const url = ApiUtils.getApiUrl(`/api/host-admin/approveCancel/${requestId}`);
      const response = await ApiUtils.makeAuthenticatedRequest(
        url,
        "PATCH",
        null,
        userType
      );
      if (response.success) {
        setSuccessMessage("課堂取消申請已批准");
        setCancelRequests(prev => prev.filter(req => req._id !== requestId));
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      } else {
        setError(response.message || "批准失敗");
      }
    } catch (err) {
      setError("批准時發生錯誤");
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  // Approve Fund Request Handler
  const handleApproveFundRequest = async (studioStatusId: string) => {
    setFundProcessingRequests(prev => new Set(prev).add(studioStatusId));
    setFundError(null);
    setFundSuccessMessage(null);
    try {
      // Use UserTypeUtils to get userType from path
      const rawUserType = UserTypeUtils.getUserTypeFromPathname(typeof window !== 'undefined' ? window.location.pathname : '/host-admin');
      const userType: "teacher" | "shopOwner" | "hostAdmin" =
        rawUserType === "teacher" || rawUserType === "shopOwner" || rawUserType === "hostAdmin"
          ? rawUserType
          : "hostAdmin";
      // Use ApiUtils to build URL and make authenticated request
      const url = ApiUtils.getApiUrl(`/api/host-admin/approveFund/${studioStatusId}`);
      const result = await ApiUtils.makeAuthenticatedRequest(
        url,
        "PATCH",
        null,
        userType
      );
      if (result.success) {
        setFundSuccessMessage('已批准');
        // Refresh the page after approval
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        // You can add logic to update UI if needed
      } else {
        setFundError(result.message || '批准資金申請失敗');
      }
    } catch (err: any) {
      setFundError(err.message || '批准資金申請時發生錯誤');
    } finally {
      setFundProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(studioStatusId);
        return newSet;
      });
    }
  };

  return (
    <AdminPageLayout userType={userType}>
      <div>
        <h2 className="text-2xl font-semibold mb-4">課堂取消申請審核</h2>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <div className="mt-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-center mb-4">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg text-center mb-4">
                {successMessage}
              </div>
            )}
            {cancelRequests.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                目前沒有課堂取消申請
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">學生</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">地點</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">日期</th>
                     {/* <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">原因</th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">備註</th>
                     {/* <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">狀態</th>*/}
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {cancelRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                          {req.student?.name || req.user?.name || '-'}
                        </td>
                        {/* 課室 / Studio in one column, two lines */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                          <div>{req.room?.name || '-'}</div>
                          <div className="text-xs text-neutral-400 dark:text-neutral-500">{req.studio?.name || '-'}</div>
                        </td>
                        {/* 日期 / 時段 in one column, two lines */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                          <div>{req.date ? new Date(req.date).toLocaleDateString() : '-'}</div>
                          <div className="text-xs text-neutral-400 dark:text-neutral-500">{TimeSlots.slotToTime(req.timeSlotSection)}</div>
                        </td>
                        {/*
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                          {req.cancelReason}
                        </td>
                        */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                          {req.remark === 'student_booking' ? '學生取消' : '琴行取消'}
                        </td>
                        {/*
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                          {req.status}
                        </td>
                        */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <ButtonPrimary
                            onClick={() => handleApproveRequest(req._id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm"
                            disabled={processingRequests.has(req._id)}
                          >
                            {processingRequests.has(req._id) ? (
                              "處理中..."
                            ) : (
                              <>批准</>
                            )}
                          </ButtonPrimary>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Example usage in UI, add wherever you want to trigger fund approval (replace <STUDIO_STATUS_ID> with actual id): */}
      {/* 
      <ButtonPrimary
        onClick={() => handleApproveFundRequest('<STUDIO_STATUS_ID>')}
        disabled={fundProcessingRequests.has('<STUDIO_STATUS_ID>')}
      >
        {fundProcessingRequests.has('<STUDIO_STATUS_ID>') ? '處理中...' : '批准資金'}
      </ButtonPrimary>
      {fundError && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-center mb-4">{fundError}</div>}
      {fundSuccessMessage && <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg text-center mb-4">{fundSuccessMessage}</div>}
      */}
    </AdminPageLayout>
  );
};

export default HostAdminClassApprovalPage;
