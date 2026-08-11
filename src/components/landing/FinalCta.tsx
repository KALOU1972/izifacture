import React from "react";
import { MagneticButton } from "./MagneticButton";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function FinalCta() {
  return (
    <section className="py-24 px-spacing-margin-mobile md:px-spacing-margin-desktop bg-ld-surface-container-lowest overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-ld-primary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-ld-inverse-primary rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-[var(--spacing-container-max)] mx-auto relative z-10">
        <AnimateOnScroll className="bg-ld-primary rounded-[3rem] p-10 md:p-20 text-center shadow-float overflow-hidden relative border border-white/10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          
          <h2 className="font-display-lg text-4xl md:text-5xl text-white font-bold mb-6 max-w-3xl mx-auto leading-tight">
            Rejoins les entrepreneurs qui facturent comme des pros
          </h2>
          <p className="font-body-lg text-ld-inverse-primary text-xl mb-10 max-w-2xl mx-auto">
            Passez à la vitesse supérieure. Créez votre compte en moins d'une minute et envoyez votre première facture aujourd'hui.
          </p>
          
          <MagneticButton href="/register" className="bg-white text-ld-primary font-bold text-lg px-8 py-4 rounded-full hover:bg-gray-50 transition-colors shadow-soft inline-block">
            Commencer gratuitement
          </MagneticButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
