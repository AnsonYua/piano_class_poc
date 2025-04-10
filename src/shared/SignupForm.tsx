"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Route } from "@/routers/types";

export interface SignupFormProps {
  userType: 'student' | 'teacher' | 'shop-owner';
  onSubmit: (data: any) => Promise<string | null | undefined>;
}

interface Student {
  studentName: string;
  studentAge: number;
}

interface FormData {
  contactNumber: string;
  name: string;
  password: string;
  student?: Array<{
    name: string;
    age: string;
  }>;
  shopAddress?: string;
}

const SignupForm: FC<SignupFormProps> = ({ userType, onSubmit }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [students, setStudents] = useState<Student[]>([{ studentName: "", studentAge:6 }]);
  const [shopAddress, setShopAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const errorRef = useRef<HTMLDivElement>(null);

  // Scroll to error message when it changes
  useEffect(() => {
    if (errorMessage && errorRef.current) {
      // Scroll to the top of the page first
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Then scroll to the error message
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [errorMessage]);

  const addStudent = () => {
    setStudents([...students, { studentName: "", studentAge: 6 }]);
  };

  const handleStudentChange = (index: number, field: keyof Student, value: string | number) => {
    const newStudents = [...students];
    newStudents[index] = {
      ...newStudents[index],
      [field]: value
    };
    setStudents(newStudents);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("密碼與確認密碼不符");
      return;
    }

    if (!fullName) {
      showError("請填寫稱呼");
      return;
    }

    if (userType === 'student' && students.length === 0) {
      showError("至少需要輸入一位同學資料");
      return;
    }

    if (userType === 'student') {
      // Basic student validation
      for (let index = 0; index < students.length; index++) {
        const student = students[index];
        if (!student.studentName) {
          showError(`請填寫第 ${index + 1} 位同學的稱呼`);
          return;
        }
        if (isNaN(student.studentAge) || student.studentAge <= 0) {
          showError(`請填寫有效的年齡（數字）給第 ${index + 1} 位同學`);
          return;
        }
      }
    }

    if (userType === 'shop-owner' && !shopAddress) {
      showError("請填寫琴行地址");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData: FormData = {
        contactNumber: `852${email}`,
        name: fullName,
        password: password,
      };

      if (userType === 'student') {
        formData.student = students.map(student => ({
          name: student.studentName,
          age: student.studentAge.toString()
        }));
      }

      if (userType === 'shop-owner') {
        formData.shopAddress = shopAddress;
      }

      const errorMessage = await onSubmit(formData);
      if (errorMessage) {
        setIsLoading(false);
        showError(errorMessage);
      }
    } catch (error) {
      setIsLoading(false);
      showError("註冊失敗，請重試");
    } finally {
    }
  };

  return (
    <div className="space-y-8">
      <form className="space-y-8" onSubmit={handleSubmit}>
        {errorMessage && (
          <div 
            ref={errorRef}
            className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-center"
          >
            {errorMessage}
          </div>
        )}
        
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
                disabled={isLoading}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">聯絡號碼(可收到WhatsApp的號碼)</span>
              <div className="flex">
                <div className="flex items-center px-3 border border-neutral-300 dark:border-neutral-700 rounded-l-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                  +852
                </div>
                <Input
                  type="tel"
                  placeholder="請輸入電話號碼"
                  className="w-full rounded-l-none"
                  value={email}
                  autoComplete="new-phone"
                  name="random-phone-field"
                  pattern="[5698][0-9]{7}"
                  maxLength={8}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    setEmail(onlyNumbers);
                  }}
                  disabled={isLoading}
                />
              </div>
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">帳戶密碼</span>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="請輸入密碼"
                  className="w-full pr-10"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">再次確認密碼</span>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="再次輸入密碼"
                  className="w-full pr-10"
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={toggleConfirmPasswordVisibility}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </label>
          </div>
        </section>

        {/* Shop Owner Data Section */}
        {userType === 'shop-owner' && (
          <section className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">琴行資料</h3>
            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">琴行地址</span>
                <Input
                  type="text"
                  placeholder="請輸入琴行地址"
                  className="w-full"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  disabled={isLoading}
                />
              </label>
            </div>
          </section>
        )}

        {/* Student Data Section */}
        {userType === 'student' && (
          <section className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">同學資料</h3>
            <div className="space-y-4">
              {students.map((student, index) => (
                <div key={index} className="bg-gray-50 dark:bg-neutral-700 p-6 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">同學 {index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newStudents = students.filter((_, i) => i !== index);
                          setStudents(newStudents);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                        disabled={isLoading}
                      >
                        移除
                      </button>
                    )}
                  </div>
                  <label className="block">
                    <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">同學稱呼</span>
                    <Input
                      type="text"
                      placeholder="請輸入同學稱呼"
                      className="w-full"
                      value={student.studentName}
                      onChange={(e) => handleStudentChange(index, "studentName", e.target.value)}
                      disabled={isLoading}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">同學年齡(5歲以上)</span>
                    <Input
                      type="number"
                      placeholder="請輸入同學年齡"
                      className="w-full"
                      value={student.studentAge}
                      onChange={(e) => handleStudentChange(index, "studentAge", parseInt(e.target.value))}
                      disabled={isLoading}
                    />
                  </label>
                </div>
              ))}
              <button
                type="button"
                onClick={addStudent}
                className="w-full py-3 px-4 border border-gray-300 dark:border-neutral-600 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={isLoading}
              >
                + 新增同學
              </button>
            </div>
          </section>
        )}

        <ButtonPrimary type="submit" className="w-full py-3 text-base" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              處理中...
            </div>
          ) : "提交"}
        </ButtonPrimary>
      </form>

      <div className="text-center">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          已有帳號?{" "}
          <Link href={userType === 'student' ? '/login' : userType === 'teacher' ? '/teacher-admin/login' : '/shop-owner-admin/login' as Route} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            登入
          </Link>
        </span>
      </div>
    </div>
  );
};

export default SignupForm; 