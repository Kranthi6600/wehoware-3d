"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface StartupContextType {
  isStartupComplete: boolean;
  setIsStartupComplete: (value: boolean) => void;
}

const StartupContext = createContext<StartupContextType | undefined>(undefined);

export function StartupProvider({ children }: { children: ReactNode }) {
  const [isStartupComplete, _setIsStartupComplete] = useState(false);

  const setIsStartupComplete = (value: boolean) => {
    _setIsStartupComplete(value);
  };

  return (
    <StartupContext.Provider value={{ isStartupComplete, setIsStartupComplete }}>
      {children}
    </StartupContext.Provider>
  );
}

export function useStartup() {
  const context = useContext(StartupContext);
  if (context === undefined) {
    throw new Error("useStartup must be used within a StartupProvider");
  }
  return context;
}
