"use client";

import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import Select from "@/shared/Select";

export interface AddLessonPageProps {}

const AddLessonPage: FC<AddLessonPageProps> = () => {
  const router = useRouter();
  
  // Sample data - replace with actual data from your API
  const students = [
    { id: "student1", name: "同學 1" },
    { id: "student2", name: "同學 2" },
    { id: "student3", name: "同學 3" },
  ];
  
  const teachers = [
    { id: "teacher1", name: "王老師" },
    { id: "teacher2", name: "李老師" },
    { id: "teacher3", name: "張老師" },
  ];
  
  const [lesson, setLesson] = useState({
    studentId: "student1",
    date: "",
    time: "",
    teacherId: "teacher1",
    notes: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLesson(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would send the new lesson data to your API
      // For now, we'll just simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to the lessons page
      router.push("/account-lessons");
    } catch (err) {
      setError("新增失敗，請重試");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="nc-AddLessonPage min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold text-center mb-6">新增課程</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-8"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>同學</Label>
              <Select 
                className="mt-1.5" 
                name="studentId"
                value={lesson.studentId}
                onChange={handleChange}
                required
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </Select>
            </div>
            
            <div>
              <Label>日期</Label>
              <Input 
                className="mt-1.5" 
                type="date"
                name="date"
                value={lesson.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label>時間</Label>
              <Input 
                className="mt-1.5" 
                type="time"
                name="time"
                value={lesson.time}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label>老師</Label>
              <Select 
                className="mt-1.5" 
                name="teacherId"
                value={lesson.teacherId}
                onChange={handleChange}
                required
              >
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </Select>
            </div>
            
            <div>
              <Label>備註</Label>
              <Input 
                className="mt-1.5" 
                name="notes"
                value={lesson.notes}
                onChange={handleChange}
                placeholder="請輸入備註"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            
            <div className="pt-2 flex space-x-4">
              <ButtonPrimary type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "處理中..." : "新增課程"}
              </ButtonPrimary>
              <button
                type="button"
                onClick={() => router.push("/account-lessons")}
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

export default AddLessonPage; 