"use client";

import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Label from "@/components/Label";

export interface AddStudentPageProps {}

const AddStudentPage: FC<AddStudentPageProps> = () => {
  const router = useRouter();
  
  const [student, setStudent] = useState({
    name: "",
    age: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would send the new student data to your API
      // For now, we'll just simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to the students page
      router.push("/account-students");
    } catch (err) {
      setError("新增失敗，請重試");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="nc-AddStudentPage min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold text-center mb-6">新增同學</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-8"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>同學姓名</Label>
              <Input 
                className="mt-1.5" 
                name="name"
                value={student.name}
                onChange={handleChange}
                placeholder="請輸入同學姓名"
                required
              />
            </div>
            
            <div>
              <Label>同學年齡</Label>
              <Input 
                className="mt-1.5" 
                type="number"
                name="age"
                value={student.age}
                onChange={handleChange}
                min="1"
                max="100"
                placeholder="請輸入同學年齡"
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
                {isLoading ? "處理中..." : "新增同學"}
              </ButtonPrimary>
              <button
                type="button"
                onClick={() => router.push("/account-students")}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-neutral-600 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={isLoading}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentPage; 