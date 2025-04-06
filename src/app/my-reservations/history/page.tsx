'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Route } from '@/routers/types';

interface ClassHistory {
  id: string;
  studentName: string;
  date: string;
  location: string;
  duration: string;
  teacher: string;
  notes: string;
}

const ClassHistoryPage = () => {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  
  const students = [
    { id: '1', name: '王小明' },
    { id: '2', name: '李小華' },
    { id: '3', name: '張大偉' },
  ];

  const classHistory: ClassHistory[] = [
    {
      id: '1',
      studentName: '王小明',
      date: '2024-03-15',
      location: '台北市信義區',
      duration: '60分鐘',
      teacher: '陳老師',
      notes: '完成基礎指法練習',
    },
    {
      id: '2',
      studentName: '王小明',
      date: '2024-03-08',
      location: '台北市信義區',
      duration: '60分鐘',
      teacher: '陳老師',
      notes: '學習新曲目',
    },
    {
      id: '3',
      studentName: '李小華',
      date: '2024-03-10',
      location: '台北市信義區',
      duration: '60分鐘',
      teacher: '林老師',
      notes: '加強節奏訓練',
    },
  ];

  const filteredHistory = selectedStudent
    ? classHistory.filter(history => history.studentName === students.find(s => s.id === selectedStudent)?.name)
    : classHistory;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-5xl mx-auto py-0 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-center mb-4">上課紀錄</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Student List Column */}
              <div className="md:col-span-3">
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">學生列表</h3>
                  <div className="md:hidden mb-3">
                    <select
                      value={selectedStudent || ''}
                      onChange={(e) => setSelectedStudent(e.target.value || null)}
                      className="w-full p-2 border border-gray-300 dark:border-neutral-600 rounded-md"
                    >
                      <option value="">所有學生</option>
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

              {/* Class History Column */}
              <div className="md:col-span-9">
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">上課紀錄</h3>
                  <div className="space-y-3">
                    {filteredHistory.map((history) => (
                      <div
                        key={history.id}
                        className="border-b border-neutral-200 dark:border-neutral-700 pb-3 last:border-b-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{history.date}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{history.location}</p>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{history.duration}</span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">老師：{history.teacher}</p>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{history.notes}</p>
                        </div>
                      </div>
                    ))}
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

export default ClassHistoryPage; 