"use client";

import React, { useState, useEffect } from "react";
import AdminPageLayout from "@/components/AdminPageLayout";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { ApiUtils } from "@/utils/ApiUtils";
import { UserTypeUtils } from "@/utils/UserTypeUtils";
import LoadingScreen from "@/components/LoadingScreen";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface PendingAccount {
  _id: string;
  role: string;
  contactNumber: string;
  name: string;
  accountStatus: string;
  isVerified: boolean;
  createdAt_utc8: string;
}

const HostAdminAccountApprovalPage = () => {
  const [pendingAccounts, setPendingAccounts] = useState<PendingAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processingAccounts, setProcessingAccounts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPendingAccounts();
  }, []);

  const rawUserType = UserTypeUtils.getUserTypeFromPathname(typeof window !== 'undefined' ? window.location.pathname : '/host-admin');
  const userType: "teacher" | "shopOwner" | "hostAdmin" =
    rawUserType === "teacher" || rawUserType === "shopOwner" || rawUserType === "hostAdmin"
      ? rawUserType
      : "hostAdmin";

  const fetchPendingAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = ApiUtils.getApiUrl("/api/host-admin/getPendingAccounts");
      const response = await ApiUtils.makeAuthenticatedRequest(
        url,
        "GET",
        null,
        userType
      );
      if (response.success) {
        setPendingAccounts(response.data);
      } else {
        setError(response.message || "獲取待審核帳號失敗");
      }
    } catch (err) {
      console.error('Error fetching pending accounts:', err);
      setError("獲取待審核帳號時發生錯誤");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAccount = async (accountId: string) => {
    setProcessingAccounts(prev => new Set(prev).add(accountId));
    setError(null);
    setSuccessMessage(null);
    try {
      // PATCH /api/host-admin/approveAccount/:userId
      const url = ApiUtils.getApiUrl(`/api/host-admin/approveAccount/${accountId}`);
      const response = await ApiUtils.makeAuthenticatedRequest(
        url,
        "PATCH",
        null,
        userType
      );
      if (response.success) {
        setSuccessMessage("帳號審核成功");
        setPendingAccounts(prev => prev.filter(account => account._id !== accountId));
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      } else {
        setError(response.message || "帳號審核失敗");
      }
    } catch (err) {
      setError("帳號審核時發生錯誤");
    } finally {
      setProcessingAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(accountId);
        return newSet;
      });
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'teacher':
        return '老師';
      case 'shop_admin':
        return '琴室管理員';
      default:
        return role;
    }
  };

  return (
    <AdminPageLayout userType={userType}>
      <div>
        <h2 className="text-2xl font-semibold mb-4">帳號批核</h2>
        
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
            
            {pendingAccounts.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                目前沒有待審核的帳號
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        名稱
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        角色
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        聯絡電話
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        建立時間
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {pendingAccounts.map((account) => (
                      <tr key={account._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                          {account.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                          {getRoleDisplay(account.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                          {account.contactNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                          {account.createdAt_utc8}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <ButtonPrimary
                            onClick={() => handleApproveAccount(account._id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm"
                            disabled={processingAccounts.has(account._id)}
                          >
                            {processingAccounts.has(account._id) ? (
                              "處理中..."
                            ) : (
                              <>
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                批核
                              </>
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
    </AdminPageLayout>
  );
};

export default HostAdminAccountApprovalPage;
