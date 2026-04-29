import { useState, useCallback, useEffect } from 'react';

export interface DayContent {
  dayNumber: number;
  title: string;
  description: string;
  image?: string;
}

export interface EducationalTour {
  tourTitle: string;
  tourDescription: string;
  subject: string;
  institution: string;
  days: DayContent[];
}

const STORAGE_KEY = 'educational_tour_data';
const LOGIN_KEY = 'user_logged_in';

export function useEducationalTour() {
  const [tourData, setTourData] = useState<EducationalTour>({
    tourTitle: "My Educational Tour",
    tourDescription: "",
    subject: "",
    institution: "",
    days: Array.from({ length: 7 }, (_, i) => ({
      dayNumber: i + 1,
      title: `Day ${i + 1}`,
      description: "",
      image: "",
    })),
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load tour from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const loggedIn = localStorage.getItem(LOGIN_KEY);
    
    if (saved) {
      try {
        setTourData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load tour:', e);
      }
    }
    
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
    
    setIsLoaded(true);
  }, []);

  // Save tour to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tourData));
    }
  }, [tourData, isLoaded]);

  const login = useCallback((password: string): boolean => {
    // Simple password check - change this to your password
    if (password === "admin123") {
      setIsLoggedIn(true);
      localStorage.setItem(LOGIN_KEY, 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.setItem(LOGIN_KEY, 'false');
  }, []);

  const updateTourInfo = useCallback((updates: Partial<Omit<EducationalTour, 'days'>>) => {
    setTourData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateDay = useCallback(
    (dayNumber: number, updates: Partial<DayContent>) => {
      setTourData((prev) => ({
        ...prev,
        days: prev.days.map((day) =>
          day.dayNumber === dayNumber ? { ...day, ...updates } : day
        ),
      }));
    },
    []
  );

  const getDay = useCallback(
    (dayNumber: number) => {
      return tourData.days.find((d) => d.dayNumber === dayNumber);
    },
    [tourData.days]
  );

  return {
    tourData,
    isLoaded,
    isLoggedIn,
    login,
    logout,
    updateTourInfo,
    updateDay,
    getDay,
  };
}
