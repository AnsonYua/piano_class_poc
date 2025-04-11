"use client";

import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import ClientAccountLayout from "@/app/(account-pages)/(components)/ClientAccountLayout";
import AdminPageLayout from "@/components/AdminPageLayout";
import { HONG_KONG_DISTRICTS } from "@/utils/locationData";
import { isDistrictEnabled } from "@/config/locationConfig";
import { ApiUtils } from "@/utils/ApiUtils";
import { UserTypeUtils } from "@/utils/UserTypeUtils";

export interface AddRoomPageProps {}

const AddRoomPage: FC<AddRoomPageProps> = () => {
  const router = useRouter();
  
  const [room, setRoom] = useState({
    name: "",
    address: "",
    pianoCount: 0,
    district: "北角" // Default to 北角
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoom(prev => ({
      ...prev,
      [name]: name === "pianoCount" ? parseInt(value) || 0 : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const userType = 'shopOwner';
      const token = localStorage.getItem(`${userType}_auth_token`);
      
      if (!token) {
        throw new Error('未登入或登入已過期');
      }

      const response = await fetch(ApiUtils.getApiUrl('api/piano-rooms'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: room.name,
          district: room.district,
          address: room.address,
          roomCount: room.pianoCount
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '新增失敗，請重試');
      }
      
      // Redirect back to the rooms page
      router.push("/shop-owner-admin/account-rooms" as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : '新增失敗，請重試');
      setIsLoading(false);
    }
  };
  
  return (
    <AdminPageLayout userType="shopOwner">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center mb-6">新增琴室</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>琴室名稱</Label>
            <Input 
              className="mt-1.5" 
              name="name"
              value={room.name}
              onChange={handleChange}
              placeholder="請輸入琴室名稱"
              required
            />
          </div>
          
          <div>
            <Label>地區</Label>
            <select
              className="mt-1.5 w-full rounded-lg border-gray-300 dark:border-neutral-600 dark:bg-neutral-800"
              name="district"
              value={room.district}
              onChange={handleChange}
              required
            >
              {HONG_KONG_DISTRICTS.map((district) => (
                <option 
                  key={district} 
                  value={district}
                  disabled={!isDistrictEnabled(district)}
                >
                  {district}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">目前只有北角地區可用</p>
          </div>
          
          <div>
            <Label>琴室地址</Label>
            <Input 
              className="mt-1.5" 
              name="address"
              value={room.address}
              onChange={handleChange}
              placeholder="請輸入琴室地址"
              required
            />
          </div>
          
          <div>
            <Label>琴室數目</Label>
            <Input 
              className="mt-1.5" 
              type="number"
              name="pianoCount"
              value={room.pianoCount}
              onChange={handleChange}
              min="1"
              placeholder="請輸入琴室數目"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="pt-2 flex space-x-4">
            <ButtonPrimary type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "處理中..." : "新增琴室"}
            </ButtonPrimary>
            <button
              type="button"
              onClick={() => router.push("/shop-owner-admin/account-rooms" as any)}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-neutral-600 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              disabled={isLoading}
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
};

export default AddRoomPage; 