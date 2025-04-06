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
      <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
          {/* HEADING */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-full flex justify-end">
              <Link href="/account-students/add" className="flex items-center text-primary-600 dark:text-primary-400 hover:underline text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                新增同學
              </Link>
            </div>
            <h2 className="text-3xl font-semibold text-center w-full">同學資料</h2>
            
          </div>
          
          {/* Mobile View - Dropdown Selector */}
          <div className="md:hidden mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              選擇同學
            </label>
            <Select 
              className="w-full" 
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </Select>
          </div>
          
          {/* Desktop/Tablet View - Two Column Layout */}
          <div className="hidden md:grid md:grid-cols-12 gap-6">
            {/* Left Column - Student List */}
            <div className="md:col-span-3">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                同學列表
              </h3>
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <button
                      className={`flex-grow text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedStudent === student.id
                          ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium"
                          : "hover:bg-gray-100 dark:hover:bg-neutral-700"
                      }`}
                      onClick={() => setSelectedStudent(student.id)}
                    >
                      {student.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Column - Student Information Form */}
            <div className="md:col-span-9">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                同學資料
              </h3>
              
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
          
          {/* Mobile View - Student Information Form */}
          <div className="md:hidden">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              同學資料
            </h3>
            
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
  );
};

export default AccountStudentsPage; 