"use client";

import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import ClientAccountLayout from "@/app/(account-pages)/(components)/ClientAccountLayout";

export interface AddRoomPageProps {}

const AddRoomPage: FC<AddRoomPageProps> = () => {
  const router = useRouter();
  
  const [room, setRoom] = useState({
    name: "",
    address: "",
    pianoCount: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // In a real app, you would send the new room data to your API
      // For now, we'll just simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to the rooms page
      router.push("/shop-owner-admin/account-rooms");
    } catch (err) {
      setError("新增失敗，請重試");
      setIsLoading(false);
    }
  };
  
  return (
    <ClientAccountLayout role="shop-owner">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center mb-6">新增琴房</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>琴房名稱</Label>
            <Input 
              className="mt-1.5" 
              name="name"
              value={room.name}
              onChange={handleChange}
              placeholder="請輸入琴房名稱"
              required
            />
          </div>
          
          <div>
            <Label>琴房地址</Label>
            <Input 
              className="mt-1.5" 
              name="address"
              value={room.address}
              onChange={handleChange}
              placeholder="請輸入琴房地址"
              required
            />
          </div>
          
          <div>
            <Label>琴房數目</Label>
            <Input 
              className="mt-1.5" 
              type="number"
              name="pianoCount"
              value={room.pianoCount}
              onChange={handleChange}
              min="1"
              placeholder="請輸入琴房數目"
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
              {isLoading ? "處理中..." : "新增琴房"}
            </ButtonPrimary>
            <button
              type="button"
              onClick={() => router.push("/shop-owner-admin/account-rooms")}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-neutral-600 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              disabled={isLoading}
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </ClientAccountLayout>
  );
};

export default AddRoomPage; 