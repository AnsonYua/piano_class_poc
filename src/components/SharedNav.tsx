"use client";

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Route } from "@/routers/types";

export interface NavItem {
  id: string;
  name: string;
  href: Route<string>;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }>;
}

interface SharedNavProps {
  items: NavItem[];
  className?: string;
}

export function SharedNav({ items, className = "" }: SharedNavProps) {
  const pathname = usePathname();
  
  return (
    <div className="container">
      <div className={`flex justify-center space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar ${className}`}>
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`block py-4 md:py-4 border-b-2 flex-shrink-0 capitalize ${
                isActive
                  ? "border-primary-500 font-medium"
                  : "border-transparent"
              }`}
            >
              <div className="flex items-center">
                {item.icon && <item.icon className="h-5 w-5 mr-1" />}
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 