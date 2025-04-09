import React from 'react';
import { UserIcon, UserGroupIcon, CalendarIcon } from "@heroicons/react/24/outline";

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: any;
}

const accountNavItems: NavItem[] = [
  {
    id: "account",
    name: "帳戶",
    href: "/account",
    icon: UserIcon,
  },
  {
    id: "account-students",
    name: "同學資料",
    href: "/account-students",
    icon: UserGroupIcon,
  },
  {
    id: "account-lessons",
    name: "上課資料",
    href: "/account-lessons",
    icon: CalendarIcon,
  },
  {
    id: "account-bookings",
    name: "預約管理",
    href: "/account-bookings",
    icon: CalendarIcon,
  },
];

const Nav: React.FC = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="text-xl font-bold text-gray-800">
                Piano Shop
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {accountNavItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  <item.icon className="h-5 w-5 mr-1" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav; 