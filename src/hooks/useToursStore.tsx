import { useState, useCallback, useEffect } from 'react';

export interface DayContent {
  dayNumber: number;
  title: string;
  description: string;
  image?: string;
  images?: string[];
}

export interface EducationalTour {
  tourTitle: string;
  tourDescription: string;
  subject: string;
  institution: string;
  days: DayContent[];
}

const STORAGE_KEY = 'educational_tour_data';

function normalizeDay(day: DayContent): DayContent {
  const images = day.images?.length ? day.images : day.image ? [day.image] : [];

  return {
    ...day,
    images,
    image: images[0] || "",
  };
}

function normalizeTourData(data: EducationalTour): EducationalTour {
  return {
    ...data,
    days: data.days.map(normalizeDay),
  };
}

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
      images: [],
    })),
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tour from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
      try {
        setTourData(normalizeTourData(JSON.parse(saved)));
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
          day.dayNumber === dayNumber
            ? normalizeDay({
                ...day,
                ...updates,
                images: updates.images ?? day.images,
                image: updates.images ? updates.images[0] || "" : updates.image ?? day.image ?? "",
              })
            : day
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
