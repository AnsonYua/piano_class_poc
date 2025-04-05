"use client";

import React, { FC, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { Route } from "@/routers/types";

export interface PageVerifyOTPProps {}

const PageVerifyOTP: FC<PageVerifyOTPProps> = ({}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      alert("請輸入完整的驗證碼");
      return;
    }

    try {
      // Dummy API call
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          otp: otpString,
        }),
      });

      if (response.ok) {
        localStorage.setItem("auth_token", "demo_token");
        router.push("/" as Route);
      } else {
        alert("驗證碼錯誤，請重試");
      }
    } catch (error) {
      alert("驗證失敗，請重試");
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      // Dummy API call
      await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      setTimer(60);
      setCanResend(false);
      alert("驗證碼已重新發送");
    } catch (error) {
      alert("發送失敗，請重試");
    }
  };

  return (
    <div className="nc-PageVerifyOTP min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-8">
            驗證手機號碼
          </h2>
          <div className="space-y-8">
            <div className="text-center text-neutral-600 dark:text-neutral-400">
              我們已發送驗證碼至 {phone}
            </div>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  name={`otp-${index}`}
                  className="w-12 h-12 text-center text-2xl"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
            <ButtonPrimary onClick={handleVerifyOTP} className="w-full py-3 text-base">
              驗證
            </ButtonPrimary>
            <div className="text-center">
              <button
                onClick={handleResendOTP}
                className={`text-sm ${
                  canResend
                    ? "text-blue-600 dark:text-blue-400 hover:underline"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
                disabled={!canResend}
              >
                {canResend ? "重新發送驗證碼" : `重新發送 (${timer}秒)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageVerifyOTP; 