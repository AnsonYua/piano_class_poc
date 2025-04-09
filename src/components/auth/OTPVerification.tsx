import React, { FC, useState, useEffect } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";

interface OTPVerificationProps {
  userType: 'student' | 'teacher' | 'shop-owner';
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResendOTP: () => Promise<void>;
}

const OTPVerification: FC<OTPVerificationProps> = ({ userType, email, onVerify, onResendOTP }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

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
      setErrorMessage("請輸入完整的驗證碼");
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await onVerify(otpString);
    } catch (error) {
      setErrorMessage("驗證失敗，請重試");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsResending(true);
    setErrorMessage(null);

    try {
      await onResendOTP();
      setTimer(60);
      setCanResend(false);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("發送失敗，請重試");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="nc-PageVerifyOTP bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-8">
            驗證手機號碼
          </h2>
          <div className="space-y-8">
            <div className="text-center text-neutral-600 dark:text-neutral-400">
              我們已發送驗證碼至您的手機號碼
            </div>
            
            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-center">
                {errorMessage}
              </div>
            )}
            
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
                  disabled={isLoading || isResending}
                />
              ))}
            </div>
            <ButtonPrimary 
              onClick={handleVerifyOTP} 
              className="w-full py-3 text-base"
              disabled={isLoading || isResending}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  處理中...
                </div>
              ) : "驗證"}
            </ButtonPrimary>
            <div className="text-center">
              <button
                onClick={handleResendOTP}
                className={`text-sm ${
                  canResend
                    ? "text-blue-600 dark:text-blue-400 hover:underline"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
                disabled={!canResend || isLoading || isResending}
              >
                {isResending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    處理中...
                  </span>
                ) : canResend ? "重新發送驗證碼" : `重新發送 (${timer}秒)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 