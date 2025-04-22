export interface DISCProfile {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface ProfileResult {
  name: string;
  dominantType: string;
  profile: DISCProfile;
}

export interface DISCDescription {
  title: string;
  characteristics: string[];
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}