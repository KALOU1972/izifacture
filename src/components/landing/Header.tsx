"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, Menu, X, ArrowRight } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 pt-spacing-stack-md px-spacing-margin-mobile md:px-spacing-margin-desktop transition-all duration-300 ${
        isScrolled ? "pt-2" : ""
      }`}
    >
      <div className="max-w-[var(--spacing-container-max)] mx-auto bg-ld-surface/80 backdrop-blur-md dark:bg-ld-surface-container-lowest/80 shadow-sm rounded-full px-8 h-16 flex justify-between items-center border border-ld-outline-variant/20">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-ld-primary/10 p-2 rounded-xl group-hover:bg-ld-primary/20 transition-colors">
            <Wallet className="text-ld-primary w-6 h-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="font-display-lg text-headline-md text-ld-primary dark:text-ld-inverse-primary tracking-tight">
            iziFacture
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 font-label-md text-sm">
          <Link href="#features" className="text-ld-secondary hover:text-ld-primary transition-colors hover:-translate-y-1 duration-200">
            Fonctionnalités
          </Link>
          <Link href="#solutions" className="text-ld-secondary hover:text-ld-primary transition-colors hover:-translate-y-1 duration-200">
            Solutions
          </Link>
          <Link href="#pricing" className="text-ld-secondary hover:text-ld-primary transition-colors hover:-translate-y-1 duration-200">
            Tarifs
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="font-label-md text-sm text-ld-on-surface hover:text-ld-primary transition-colors">
            Se connecter
          </Link>
          <MagneticButton
            href="/register"
            className="bg-ld-primary text-ld-on-primary font-label-md text-sm px-5 py-2.5 rounded-full hover:bg-ld-primary-hover shadow-soft hover:shadow-float flex items-center gap-2 group"
          >
            <span>Commencer gratuitement</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-ld-on-surface hover:bg-ld-primary/10 rounded-full transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-20 left-4 right-4 bg-ld-surface-container-lowest border border-ld-outline-variant/20 rounded-2xl shadow-float transition-all duration-300 origin-top overflow-hidden ${
          mobileMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-4 gap-4">
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-ld-on-surface hover:bg-ld-primary/5 rounded-xl font-label-md transition-colors">
            Fonctionnalités
          </Link>
          <Link href="#solutions" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-ld-on-surface hover:bg-ld-primary/5 rounded-xl font-label-md transition-colors">
            Solutions
          </Link>
          <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-ld-on-surface hover:bg-ld-primary/5 rounded-xl font-label-md transition-colors">
            Tarifs
          </Link>
          <div className="h-px bg-ld-outline-variant/20 my-2" />
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-ld-on-surface hover:bg-ld-primary/5 rounded-xl font-label-md transition-colors text-center">
            Se connecter
          </Link>
          <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-ld-primary text-ld-on-primary rounded-xl font-label-md transition-colors text-center shadow-soft">
            Commencer gratuitement
          </Link>
        </div>
      </div>
    </header>
  );
}
