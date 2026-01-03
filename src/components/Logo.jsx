import React from "react";
import { useTheme } from "../context/ThemeContext";

const Logo = ({ className = "h-10", forceLight = false }) => {
  const { theme } = useTheme();

  // If forceLight is true, always show light logo (for dark backgrounds)
  // Otherwise, switch based on theme
  const getFilterClass = () => {
    if (forceLight) {
      return "brightness-0 invert";
    }
    return theme === "dark" ? "brightness-0 invert" : "brightness-0";
  };

  return (
    <img
      src="/assets/logo.png"
      alt="Bridged Platforms"
      className={`${className} ${getFilterClass()} transition-all duration-300`}
    />
  );
};

export default Logo;
