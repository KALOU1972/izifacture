import React from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-4 md:px-12 overflow-hidden flex-grow flex flex-col justify-center">
      {/* Floating Decorative Elements */}
      <img
        alt="Floating cash left"
        className="absolute top-20 left-10 w-48 opacity-40 float-animation -z-10 hidden md:block"
        src="/images/landing/cash_1.png"
      />
      <img
        alt="Floating cash right"
        className="absolute bottom-40 right-10 w-64 opacity-60 float-animation-delayed -z-10 hidden lg:block"
        src="/images/landing/cash_2.png"
      />

      <div className="max-w-[var(--spacing-container-max)] mx-auto text-center relative z-10 w-full mt-10">
        <h1 className="font-display-lg text-4xl md:text-display-lg text-ld-primary max-w-4xl mx-auto mb-6">
          Dites adieu aux factures sur Word et Excel
        </h1>
        <p className="font-body-lg text-body-lg text-ld-secondary max-w-2xl mx-auto mb-10">
          La solution de facturation moderne pour les entrepreneurs africains.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <MagneticButton
            href="/register"
            className="bg-ld-primary text-ld-on-primary font-label-md text-sm px-6 py-3 rounded-full hover:bg-ld-primary-hover shadow-float w-full sm:w-auto flex justify-center items-center gap-2 group"
          >
            <span>Commencer gratuitement</span>
          </MagneticButton>

          <Link
            href="#demo"
            className="bg-ld-surface text-ld-primary font-label-md text-sm px-6 py-3 rounded-full border border-ld-primary/20 hover:bg-ld-primary-fixed hover:border-ld-primary/50 transition-all duration-300 w-full sm:w-auto flex justify-center items-center gap-2 group shadow-sm hover:shadow-soft"
          >
            <Play className="w-5 h-5 text-ld-primary group-hover:scale-110 transition-transform" />
            <span>Voir la démo</span>
          </Link>
        </div>

        {/* Dashboard Mockup Area */}
        <div className="relative mx-auto max-w-5xl rounded-[2rem] shadow-float bg-white border border-ld-outline-variant/20 p-2 md:p-4 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-ld-primary-fixed/20 to-transparent pointer-events-none rounded-[2rem]"></div>
          <img
            className="w-full h-auto rounded-xl md:rounded-2xl shadow-sm transform group-hover:scale-[1.01] transition-transform duration-500"
            alt="iziFacture Dashboard Mockup"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAun0Yq1Bv4zmOkV3Ek8AMrMvsbOSzUIBQ6t2DM4ogVMiG97VBtGI0Podin0YJ8wKhQtmWpEFcFrIzJMoZeb1HKxVD7jKK9Kg_BpMm8W-WXEhrCnbxDrTGmW5WRB6TS-hsFnfdl-iaSNeVcl9RIg53h1We1MuP541WUGZ3Mqu1EE1YBpHSrSxraH_Ziw3PR5CmfwF6-9LkumgwSQbfeRWElMFA79cOUWefiFJkH4zY3nHB_QWdW8xVX"
          />
        </div>
      </div>
    </section>
  );
}
