"use client";

import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Label from "@/components/Label";

export interface EditStudentPageProps {
  params: {
    id: string;
  };
}

const EditStudentPage: FC<EditStudentPageProps> = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  
  // Sample data - replace with actual data from your API
  const [student, setStudent] = useState({
    id: "",
    name: "",
    age: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch student data
  useEffect(() => {
    // In a real app, you would fetch the student data from your API
    // For now, we'll use sample data
    const fetchStudent = () => {
      // Simulate API call
      setTimeout(() => {
        // Sample data - replace with actual API call
        const sampleStudents = {
          "student1": { id: "student1", name: "同學 1", age: 10 },
          "student2": { id: "student2", name: "同學 2", age: 12 },
          "student3": { id: "student3", name: "同學 3", age: 8 },
        };
        
        if (sampleStudents[id as keyof typeof sampleStudents]) {
          setStudent(sampleStudents[id as keyof typeof sampleStudents]);
        } else {
          setError("找不到同學資料");
        }
      }, 500);
    };
    
    fetchStudent();
  }, [id]);
  
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
      // In a real app, you would send the updated data to your API
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to the students page
      router.push("/account-students");
    } catch (err) {
      setError("更新失敗，請重試");
      setIsLoading(false);
    }
  };
  
  if (error) {
    return (
      <div className="nc-EditStudentPage min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="container max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-4">錯誤</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">{error}</p>
              <ButtonPrimary onClick={() => router.push("/account-students")}>
                返回同學列表
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="nc-EditStudentPage min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold text-center mb-6">編輯同學資料</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-8"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>同學姓名</Label>
              <Input 
                className="mt-1.5" 
                name="name"
                value={student.name}
                onChange={handleChange}
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
                required
              />
            </div>
            
            <div className="pt-2 flex space-x-4">
              <ButtonPrimary type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "處理中..." : "更新資料"}
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

export default EditStudentPage; 