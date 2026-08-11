"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: "0" | "100" | "200" | "300" | "400" | "500";
}

export function AnimateOnScroll({ children, className = "", delay = "0" }: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const delayClass = delay !== "0" ? `delay-${delay}` : "";

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? `animate-on-scroll ${delayClass}` : "opacity-0"}`}
      style={isVisible ? {} : { opacity: 0, transform: 'translateY(40px)' }}
    >
      {children}
    </div>
  );
}
