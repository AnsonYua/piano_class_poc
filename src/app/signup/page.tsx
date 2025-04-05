"use client";

import React, { FC, useState } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Route } from "@/routers/types";

export interface PageSignUpProps {}

interface Student {
  studentName: string;
  studentAge: number;
}

const PageSignUp: FC<PageSignUpProps> = ({}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [students, setStudents] = useState<Student[]>([{ studentName: "", studentAge: 0 }]);
  const router = useRouter();

  const addStudent = () => {
    setStudents([...students, { studentName: "", studentAge: 0 }]);
  };

  const handleStudentChange = (index: number, field: keyof Student, value: string | number) => {
    const newStudents = [...students];
    newStudents[index] = {
      ...newStudents[index],
      [field]: value
    };
    setStudents(newStudents);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("密碼與確認密碼不符");
      return;
    }

    if (!fullName) {
      alert("請填寫稱呼");
      return;
    }

    if (students.length === 0) {
      alert("至少需要輸入一位學生資料");
      return;
    }

    // Basic student validation
    students.forEach((student, index) => {
      if (!student.studentName) {
        alert(`請填寫第 ${index + 1} 位學生的稱呼`);
        return;
      }
      if (isNaN(student.studentAge) || student.studentAge <= 0) {
        alert(`請填寫有效的年齡（數字）給第 ${index + 1} 位學生`);
        return;
      }

    });
    localStorage.setItem("auth_token", "demo_token");
    router.push("/" as Route);
  };

  return (
    <div className="nc-PageSignUp min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
                  {
        <h2 className="my-5 hidden md:flex items-center text-3xl leading-[115%] md:text-3xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          創建帳戶
        </h2>}
      
          <div className="space-y-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* 帳戶資料 Section */}
              <section className="space-y-6">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">帳戶資料</h3>
                <div className="space-y-4">
                  <label className="block">
                    <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">稱呼</span>
                    <Input
                      type="text"
                      placeholder="請輸入您的稱呼"
                      className="w-full"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">聯絡號碼</span>
                    <Input
                      type="tel"
                      placeholder="請輸入電話號碼"
                      className="w-full"
                      value={email}
                      autoComplete="new-phone"
                      name="random-phone-field"
                      pattern="[5698][0-9]{7}"
                      maxLength={8}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, "");
                        setEmail(onlyNumbers);
                      }}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">帳戶密碼</span>
                    <Input
                      type="password"
                      placeholder="請輸入密碼"
                      className="w-full"
                      value={password}
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">再次確認密碼</span>
                    <Input
                      type="password"
                      placeholder="再次輸入密碼"
                      className="w-full"
                      value={confirmPassword}
                      autoComplete="new-password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </label>
                </div>
              </section>

              {/* 學生資料 Section */}
              <section className="space-y-6">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">學生資料</h3>
                <div className="space-y-4">
                  {students.map((student, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-neutral-700 p-6 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">學生 {index + 1}</h4>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newStudents = students.filter((_, i) => i !== index);
                              setStudents(newStudents);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            移除
                          </button>
                        )}
                      </div>
                      <label className="block">
                        <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">學生稱呼</span>
                        <Input
                          type="text"
                          placeholder="請輸入學生稱呼"
                          className="w-full"
                          value={student.studentName}
                          onChange={(e) => handleStudentChange(index, "studentName", e.target.value)}
                        />
                      </label>
                      <label className="block">
                        <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">學生年齡</span>
                        <Input
                          type="number"
                          placeholder="請輸入學生年齡"
                          className="w-full"
                          value={student.studentAge}
                          onChange={(e) => handleStudentChange(index, "studentAge", parseInt(e.target.value))}
                        />
                      </label>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStudent}
                    className="w-full py-3 px-4 border border-gray-300 dark:border-neutral-600 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    + 新增學生
                  </button>
                </div>
              </section>

              <ButtonPrimary type="submit" className="w-full py-3 text-base">
                提交
              </ButtonPrimary>
            </form>

            <div className="text-center">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                已有帳號?{" "}
                <Link href={"/login" as Route} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  登入
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp