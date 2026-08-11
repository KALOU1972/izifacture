"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

interface MagneticButtonProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export function MagneticButton({ children, href, className = "" }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Link
      href={href}
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block magnetic-btn ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${position.x === 0 && position.y === 0 ? 1 : 1.05})`,
      }}
    >
      {children}
    </Link>
  );
}
