"use client";

import { useEffect, useRef } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// The real number is rendered by default (server HTML, no-JS, crawlers, and
// before the section scrolls into view); `animate` replays a count-up from 0
// once. A missing value (region not known yet) shows a dash instead of "0+".
const format = (value, suffix) => (value ? `${value}${suffix}` : "–");

const Counter = ({ value, animate = true, suffix = "" }) => {
  const countRef = useRef(null);
  const rafRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!animate || !value) {
      hasStartedRef.current = false;
      if (countRef.current) countRef.current.textContent = format(value, suffix);
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (prefersReducedMotion()) {
      if (countRef.current) countRef.current.textContent = format(value, suffix);
      return;
    }

    const duration = 2000;
    const startTime = performance.now();

    const updateCount = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(value * easeOutQuart);
      if (countRef.current) {
        countRef.current.textContent = `${currentValue}${suffix}`;
      }
      if (progress < 1) rafRef.current = requestAnimationFrame(updateCount);
    };

    rafRef.current = requestAnimationFrame(updateCount);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, animate, suffix]);

  return <span ref={countRef}>{format(value, suffix)}</span>;
};

export default Counter;
