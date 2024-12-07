import { useEffect, useRef } from "react";

const Counter = ({ value, animate = true, suffix = "" }) => {
  const countRef = useRef(null);
  const currentValueRef = useRef(0);
  const rafRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    console.log("Counter props:", { value, animate, suffix }); // Debug prop values
    console.log("Counter refs:", {
      hasStarted: hasStartedRef.current,
      currentValue: currentValueRef.current,
    }); // Debug ref values

    // Reset if animation prop changes to false
    if (!animate) {
      console.log("Animation disabled, resetting counter");
      hasStartedRef.current = false;
      currentValueRef.current = 0;
      if (countRef.current) {
        countRef.current.textContent = `0${suffix}`;
      }
      return;
    }

    // Only start animation if animate is true and hasn't started yet
    if (!hasStartedRef.current && animate) {
      console.log("Starting animation"); // Debug animation start
      hasStartedRef.current = true;

      const duration = 2000;
      const startTime = Date.now();
      const startValue = 0;
      const endValue = value;

      console.log("Animation values:", { startValue, endValue, duration }); // Debug animation values

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(
          startValue + (endValue - startValue) * easeOutQuart
        );

        console.log("Animation frame:", { progress, currentValue }); // Debug each frame

        if (countRef.current) {
          countRef.current.textContent = `${currentValue}${suffix}`;
        }

        currentValueRef.current = currentValue;

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(updateCount);
        } else {
          console.log("Animation completed"); // Debug animation completion
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
