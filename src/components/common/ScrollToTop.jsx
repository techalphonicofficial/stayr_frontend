"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    // Force scroll to top instantly, overriding smooth scroll behavior
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    
    // Fallback for older browsers
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, []);

  return null;
}
