"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Route } from "@/routers/types";

export interface LoginFormProps {
  title: string;
  apiEndpoint: string;
  tokenKey: string;
  redirectPath: Route;
  forgotPasswordPath: Route;
  signupPath: Route;
  showSignupLink?: boolean;
}

const LoginForm: FC<LoginFormProps> = ({
  title,
  apiEndpoint,
  tokenKey,
  redirectPath,
  forgotPasswordPath,
  signupPath,
  showSignupLink = true,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorMessage && errorRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [errorMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactNumber: "852"+email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(data.message || '登入失敗，請重試');
      }

      localStorage.setItem(tokenKey, data.token);
      router.push(redirectPath);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error instanceof Error ? error.message : "登入失敗，請重試");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`nc-PageLogin`}>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-5 hidden md:flex items-center text-3xl leading-[115%] md:text-3xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          {title}
        </h2>
        <div className="my-2 flex md:hidden items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          <br/>
        </div>
        <div className="max-w-md mx-auto space-y-6">
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit} autoComplete="off">
            <input type="text" style={{ display: 'none' }} autoComplete="off" />
            
            {errorMessage && (
              <div 
                ref={errorRef}
                className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-center"
              >
                {errorMessage}
              </div>
            )}
            
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                電話號碼
              </span>
              <Input
                type="tel"
                name={`phone-${Date.now()}`}
                placeholder="請輸入聯絡電話"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="tel"
                disabled={isLoading}
              />
            </label>
            
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                密碼
                <Link href={forgotPasswordPath} className="text-sm underline font-medium">
                  忘記密碼
                </Link>
              </span>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name={`password-${Date.now()}`}
                  placeholder="請輸入密碼"
                  className="mt-1 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
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
            <ButtonPrimary type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  處理中...
                </div>
              ) : "確定"}
            </ButtonPrimary>
          </form>

          {showSignupLink && (
            <span className="block text-center text-neutral-700 dark:text-neutral-300">
              沒有帳號? {` `}
              <Link href={signupPath} className="font-semibold underline">
                創建帳戶
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 