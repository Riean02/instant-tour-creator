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

  // Load tour from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
      try {
        setTourData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load tour:', e);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // Save tour to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tourData));
    }
  }, [tourData, isLoaded]);

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
    updateTourInfo,
    updateDay,
    getDay,
  };
}
