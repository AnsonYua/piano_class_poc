import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ButtonPrimary from '../ButtonPrimary';

interface OTPVerificationProps {
  userType: 'teacher' | 'shop-owner';
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResendOTP: () => Promise<void>;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  userType,
  email,
  onVerify,
  onResendOTP,
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onVerify(otp);
      router.push(`/${userType}-admin/signup-success`);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await onResendOTP();
      setResendTimer(60);
      setCanResend(false);
    } catch (error) {
      console.error('Resend OTP error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">驗證您的電子郵件</h2>
      <p className="mb-4">
        我們已向 {email} 發送了驗證碼。請輸入收到的驗證碼。
      </p>
      
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="請輸入驗證碼"
            maxLength={6}
          />
        </div>

        <ButtonPrimary type="submit" disabled={isLoading || otp.length !== 6}>
          {isLoading ? '驗證中...' : '驗證'}
        </ButtonPrimary>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={!canResend}
          className={`text-sm ${
            canResend ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'
          }`}
        >
          {canResend
            ? '重新發送驗證碼'
            : `請等待 ${resendTimer} 秒後重新發送`}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification; 