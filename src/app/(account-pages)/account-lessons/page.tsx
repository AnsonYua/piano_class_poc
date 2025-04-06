"use client";

import React, { FC, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Select from "@/shared/Select";
import Link from "next/link";

export interface AccountLessonsPageProps {}

const AccountLessonsPage = () => {
  // Sample data - replace with actual data from your API
  const [selectedStudent, setSelectedStudent] = useState("student1");
  
  const students = [
    { id: "student1", name: "同學 1" },
    { id: "student2", name: "同學 2" },
    { id: "student3", name: "同學 3" },
  ];
  
  // Sample lesson records with student IDs
  const allLessonRecords = [
    { id: 1, studentId: "student1", date: "2023-10-01", time: "14:00", teacher: "王老師", notes: "基礎練習" },
    { id: 2, studentId: "student1", date: "2023-10-08", time: "14:00", teacher: "王老師", notes: "進階練習" },
    { id: 3, studentId: "student1", date: "2023-10-15", time: "14:00", teacher: "李老師", notes: "考試準備" },
    { id: 4, studentId: "student1", date: "2023-10-22", time: "14:00", teacher: "王老師", notes: "考試" },
    { id: 5, studentId: "student1", date: "2023-10-29", time: "14:00", teacher: "李老師", notes: "考試檢討" },
    { id: 6, studentId: "student2", date: "2023-10-02", time: "15:00", teacher: "張老師", notes: "基礎練習" },
    { id: 7, studentId: "student2", date: "2023-10-09", time: "15:00", teacher: "張老師", notes: "進階練習" },
    { id: 8, studentId: "student2", date: "2023-10-16", time: "15:00", teacher: "王老師", notes: "考試準備" },
    { id: 9, studentId: "student2", date: "2023-10-23", time: "15:00", teacher: "張老師", notes: "考試" },
    { id: 10, studentId: "student2", date: "2023-10-30", time: "15:00", teacher: "王老師", notes: "考試檢討" },
    { id: 11, studentId: "student3", date: "2023-10-03", time: "16:00", teacher: "李老師", notes: "基礎練習" },
    { id: 12, studentId: "student3", date: "2023-10-10", time: "16:00", teacher: "李老師", notes: "進階練習" },
    { id: 13, studentId: "student3", date: "2023-10-17", time: "16:00", teacher: "張老師", notes: "考試準備" },
    { id: 14, studentId: "student3", date: "2023-10-24", time: "16:00", teacher: "李老師", notes: "考試" },
    { id: 15, studentId: "student3", date: "2023-10-31", time: "16:00", teacher: "張老師", notes: "考試檢討" },
  ];
  
  // Filter lesson records based on selected student
  const lessonRecords = allLessonRecords.filter(record => record.studentId === selectedStudent);

  return (
    <div className="nc-AccountLessonsPage min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold text-center mb-6">上課資料</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-8"></div>
          
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                同學列表
                </h3>
                <Link href="/account-lessons/add">
                  <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    + 新增課程
                  </button>
                </Link>
              </div>
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
            
            {/* Right Column - Lesson Records */}
            <div className="md:col-span-9">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                課程記錄
              </h3>
              {lessonRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">日期</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">時間</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">老師</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">備註</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessonRecords.map((record) => (
                        <tr key={record.id} className="border-b border-neutral-100 dark:border-neutral-700">
                          <td className="py-3 px-4">{record.date}</td>
                          <td className="py-3 px-4">{record.time}</td>
                          <td className="py-3 px-4">{record.teacher}</td>
                          <td className="py-3 px-4">{record.notes}</td>
                          <td className="py-3 px-4">
                            <Link href={`/account-lessons/edit/${record.id}`}>
                              <button className="text-primary-600 dark:text-primary-400 hover:underline">
                                編輯
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  沒有課程記錄
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile View - Lesson Records (shown below dropdown) */}
          <div className="md:hidden">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              課程記錄
            </h3>
            {lessonRecords.length > 0 ? (
              <div className="space-y-4">
                {lessonRecords.map((record) => (
                  <div key={record.id} className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{record.date}</span>
                      <span>{record.time}</span>
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                      老師: {record.teacher}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                      備註: {record.notes}
                    </div>
                    <div className="text-right">
                      <Link href={`/account-lessons/edit/${record.id}`}>
                        <button className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
                          編輯
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                沒有課程記錄
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLessonsPage; 