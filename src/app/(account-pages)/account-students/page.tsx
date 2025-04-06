"use client";

import React, { FC, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Select from "@/shared/Select";
import Link from "next/link";
import Input from "@/shared/Input";
import Label from "@/components/Label";

export interface AccountStudentsPageProps {}

const AccountStudentsPage = () => {
  // Sample data - replace with actual data from your API
  const [selectedStudent, setSelectedStudent] = useState("student1");
  
  const students = [
    { id: "student1", name: "同學 1", age: 10 },
    { id: "student2", name: "同學 2", age: 12 },
    { id: "student3", name: "同學 3", age: 8 },
  ];
  
  // Get the currently selected student data
  const currentStudent = students.find(student => student.id === selectedStudent) || students[0];
  
  // State for the form
  const [formData, setFormData] = useState({
    name: currentStudent.name,
    age: currentStudent.age
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Update form data when selected student changes
  React.useEffect(() => {
    const student = students.find(s => s.id === selectedStudent);
    if (student) {
      setFormData({
        name: student.name,
        age: student.age
      });
    }
  }, [selectedStudent]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // In a real app, you would send the updated student data to your API
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the local data (in a real app, this would come from the API response)
      const updatedStudents = students.map(student => 
        student.id === selectedStudent 
          ? { ...student, name: formData.name, age: formData.age } 
          : student
      );
      
      // In a real app, you would update the state with the API response
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
    <div className="nc-AccountStudentsPage min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-5xl mx-auto py-0 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold text-center mb-4">同學資料</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-6"></div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Student List Column */}
              <div className="md:col-span-3">
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">同學列表</h3>
                  <div className="md:hidden mb-3">
                    <select
                      value={selectedStudent || ''}
                      onChange={(e) => setSelectedStudent(e.target.value || null)}
                      className="w-full p-2 border border-gray-300 dark:border-neutral-600 rounded-md"
                    >
                      <option value="">所有同學</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden md:block space-y-1">
                    {students.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudent(student.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                          selectedStudent === student.id
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                            : 'hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {student.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Student Details Column */}
              <div className="md:col-span-9">
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">同學資料</h3>
                  <div className="space-y-3">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label>同學姓名</Label>
                        <Input 
                          className="mt-1.5" 
                          name="name"
                          value={formData.name}
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
                          value={formData.age}
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
                      
                      {successMessage && (
                        <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg text-center">
                          {successMessage}
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <ButtonPrimary type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "處理中..." : "更新"}
                        </ButtonPrimary>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStudentsPage; 