"use client";

import React, { FC, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import Link from "next/link";
import { Route } from "@/routers/types";

export interface ShopOwnerRoomsPageProps {}

const ShopOwnerRoomsPage: FC<ShopOwnerRoomsPageProps> = () => {
  // Sample data - replace with actual data from your API
  const [selectedRoom, setSelectedRoom] = useState("room1");
  
  const rooms = [
    { id: "room1", name: "琴房 1", address: "台北市信義區松高路68號", pianoCount: 5 },
    { id: "room2", name: "琴房 2", address: "台北市大安區敦化南路二段201號", pianoCount: 3 },
    { id: "room3", name: "琴房 3", address: "台北市信義區松仁路100號", pianoCount: 4 },
  ];
  
  // Get the currently selected room data
  const currentRoom = rooms.find(room => room.id === selectedRoom) || rooms[0];
  
  // State for the form
  const [formData, setFormData] = useState({
    name: currentRoom.name,
    address: currentRoom.address,
    pianoCount: currentRoom.pianoCount
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Update form data when selected room changes
  React.useEffect(() => {
    const room = rooms.find(r => r.id === selectedRoom);
    if (room) {
      setFormData({
        name: room.name,
        address: room.address,
        pianoCount: room.pianoCount
      });
    }
  }, [selectedRoom]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "pianoCount" ? parseInt(value) || 0 : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // In a real app, you would send the updated data to your API
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage("更新成功");
      setIsLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError("更新失敗，請重試");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="nc-AccountRoomsPage max-w-4xl mx-auto">
      {/* HEADING */}
      <div className="relative mb-4">
        <h2 className="text-3xl font-semibold text-center">琴房管理</h2>
        <Link href={"/shop-owner-admin/account-rooms/add" as Route} className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-600 hover:underline">
          新增琴房
        </Link>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-6"></div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Room List Column */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">琴房列表</h3>
              <div className="md:hidden mb-3">
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-neutral-600 rounded-md"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="hidden md:block space-y-1">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                      selectedRoom === room.id
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                        : 'hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Room Details Column */}
          <div className="md:col-span-9">
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">琴房詳情</h3>
              <div className="space-y-3">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label>琴房名稱</Label>
                    <Input 
                      className="mt-1.5" 
                      name="name"
                      value={formData.name}
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
                      value={formData.address}
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
                      value={formData.pianoCount}
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
                  
                  {successMessage && (
                    <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg text-center">
                      {successMessage}
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <ButtonPrimary type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "處理中..." : "更新琴房"}
                    </ButtonPrimary>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerRoomsPage; 