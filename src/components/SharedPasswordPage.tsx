'use client';

import React, { useState } from "react";
import Label from "@/components/Label";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import { UserTypeUtils, UserType } from "@/utils/UserTypeUtils";
import { usePathname } from "next/navigation";

export interface SharedPasswordPageProps {
  userType?: UserType;
}

const SharedPasswordPage: React.FC<SharedPasswordPageProps> = ({ userType }) => {
  const pathname = usePathname();
  const currentUserType = userType || UserTypeUtils.getUserTypeFromPathname(pathname);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate passwords
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('新密碼與確認密碼不符');
      }

      // TODO: Add your API call here to update the password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      setSuccessMessage('密碼更新成功');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新密碼時發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nc-AccountPage max-w-sm mx-auto bg-white rounded-lg shadow-sm p-6">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold text-center mb-4">密碼修改</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-6"></div>
      
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>目前密碼</Label>
            <Input 
              className="mt-1.5" 
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="請輸入目前密碼"
              required
            />
          </div>
          
          <div>
            <Label>新密碼</Label>
            <Input 
              className="mt-1.5" 
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="請輸入新密碼"
              required
            />
          </div>
          
          <div>
            <Label>確認新密碼</Label>
            <Input 
              className="mt-1.5" 
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="請再次輸入新密碼"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          {successMessage && (
            <div className="text-green-500 text-sm">{successMessage}</div>
          )}
          
          <ButtonPrimary 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? '處理中...' : '更新密碼'}
          </ButtonPrimary>
        </form>
      </div>
    </div>
  );
};

export default SharedPasswordPage; 