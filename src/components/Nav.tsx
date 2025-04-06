import { Route } from "@/routers/types";
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

export default accountNavItems; 