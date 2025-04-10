import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import Avatar from "@/shared/Avatar";
import SwitchDarkMode2 from "@/shared/SwitchDarkMode2";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserTypeUtils } from "@/utils/UserTypeUtils";

interface Props {
  className?: string;
}

export default function AvatarDropdown({ className = "" }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, userType, setUserType, logout } = useAuth();

  useEffect(() => {
    // Determine user type based on URL path using the utility class
    const currentUserType = UserTypeUtils.getUserTypeFromPathname(pathname);
    setUserType(currentUserType);
  }, [pathname, setUserType]);

  const handleLogout = () => {
    // Use the utility class to handle logout if userType is not null
    if (userType) {
      UserTypeUtils.handleLogout(userType, router);
    }
    
    // Call the logout function from context to update auth state
    logout();
  };

  if (!userProfile) {
    return null;
  }

  return (
    <>
      <Popover className={`AvatarDropdown relative flex ${className}`}>
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`self-center w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center`}
            >
              <Avatar sizeClass="w-8 h-8 sm:w-9 sm:h-9" />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 top-full -right-10 sm:right-0 sm:px-0">
                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 py-7 px-6">
                    <div className="flex items-center space-x-3">
                      <Avatar sizeClass="w-12 h-12" />

                      <div className="flex-grow">
                        <h4 className="font-semibold">{userProfile.user.name}</h4>
                      </div>
                    </div>

                    <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                    <div
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        close();
                      }}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15 12H3.62"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">{"登出"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
}
