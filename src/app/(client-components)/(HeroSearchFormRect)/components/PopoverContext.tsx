"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface PopoverContextType {
  activePopover: string | null;
  setActivePopover: (id: string | null) => void;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export const usePopover = () => {
  const context = useContext(PopoverContext);
  if (context === undefined) {
    throw new Error("usePopover must be used within a PopoverProvider");
  }
  return context;
};

interface PopoverProviderProps {
  children: ReactNode;
}

export const PopoverProvider: React.FC<PopoverProviderProps> = ({ children }) => {
  const [activePopover, setActivePopover] = useState<string | null>(null);

  return (
    <PopoverContext.Provider value={{ activePopover, setActivePopover }}>
      {children}
    </PopoverContext.Provider>
  );
}; 