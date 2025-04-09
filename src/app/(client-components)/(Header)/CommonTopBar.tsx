import React from "react";
import Logo from "@/shared/Logo";

interface CommonTopBarProps {
  title: string;
  className?: string;
}

const CommonTopBar: React.FC<CommonTopBarProps> = ({ title, className = "" }) => {
  return (
    <div className={`nc-CommonTopBar relative z-10 md:hidden ${className}`}>
      <div className="px-4 h-20 relative flex justify-between items-center">
        <Logo className="w-24" />
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommonTopBar; 