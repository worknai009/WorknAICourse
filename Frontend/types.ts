
export type CourseStatus = 'Live' | 'Recorded';

export interface Course {
  id: string;
  name: string;
  language: string;
  status: CourseStatus;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  isEarlyBird: boolean;
  isLimitedTime: boolean;
  description: string;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}
