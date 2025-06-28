import { useState, useEffect } from 'react';

// Enhanced Animation Hook
export const useAnimatedCounter = (end, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [end, duration, delay]);
  
  return count;
};