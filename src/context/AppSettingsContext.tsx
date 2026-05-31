import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@settings/highPerformanceMode';

type AppSettingsContextValue = {
  highPerformanceMode: boolean;
  setHighPerformanceMode: (value: boolean) => void;
  frameSkip: number;
};

const AppSettingsContext = createContext<AppSettingsContextValue>({
  highPerformanceMode: false,
  setHighPerformanceMode: () => {},
  frameSkip: 8,
});

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [highPerformanceMode, setHighPerformanceModeState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value === 'true') setHighPerformanceModeState(true);
    });
  }, []);

  const setHighPerformanceMode = useCallback((value: boolean) => {
    setHighPerformanceModeState(value);
    AsyncStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  return (
    <AppSettingsContext.Provider
      value={{
        highPerformanceMode,
        setHighPerformanceMode,
        frameSkip: highPerformanceMode ? 5 : 8,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppSettingsContext);
}
