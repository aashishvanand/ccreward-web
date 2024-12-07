import { useEffect, useRef } from "react";

const Counter = ({ value, animate = true, suffix = "" }) => {
  const countRef = useRef(null);
  const currentValueRef = useRef(0);
  const rafRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Reset if animation prop changes to false
    if (!animate) {
      hasStartedRef.current = false;
      currentValueRef.current = 0;
      if (countRef.current) {
        countRef.current.textContent = `0${suffix}`;
      }
      return;
    }

    // Only start animation if animate is true and hasn't started yet
    if (!hasStartedRef.current && animate) {
      hasStartedRef.current = true;

      const duration = 2000;
      const startTime = Date.now();
      const startValue = 0;
      const endValue = value;

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(
          startValue + (endValue - startValue) * easeOutQuart
        );

        if (countRef.current) {
          countRef.current.textContent = `${currentValue}${suffix}`;
        }

        currentValueRef.current = currentValue;

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(updateCount);
        }
      };

      rafRef.current = requestAnimationFrame(updateCount);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, animate, suffix]);

  return <span ref={countRef}>0{suffix}</span>;
};

export default Counter;
