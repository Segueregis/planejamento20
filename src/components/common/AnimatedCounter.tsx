
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  className,
  formatter = (val) => val.toString()
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Cancel any ongoing animation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    previousValue.current = displayValue;
    startTimeRef.current = null;
    
    // Start new animation
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Calculate current value with easing
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const currentValue = Math.floor(
        previousValue.current + (value - previousValue.current) * easeOutQuart
      );
      
      setDisplayValue(currentValue);
      
      if (percentage < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, duration]);
  
  const formattedValue = formatter(displayValue);
  
  return (
    <span className={cn("font-medium", className)}>
      {formattedValue}
    </span>
  );
};

export default AnimatedCounter;
