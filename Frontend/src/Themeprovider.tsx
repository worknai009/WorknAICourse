import { useEffect } from "react";
import { ThemeContext } from "./context";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Force dark mode to true
  const isDarkMode = true;

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  // toggleTheme becomes a no-op
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
