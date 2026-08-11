import React from "react";
import { UserPlus, Sparkles, Send } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-spacing-section-gap px-spacing-margin-mobile md:px-spacing-margin-desktop bg-ld-surface-container-lowest">
      <div className="max-w-[var(--spacing-container-max)] mx-auto">
        <AnimateOnScroll className="text-center mb-16">
          <p className="font-label-sm text-label-sm text-ld-primary uppercase tracking-wider mb-4 font-bold">
            Simplicité avant tout
          </p>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-ld-on-background mb-4">
            Comment ça marche ?
          </h2>
          <p className="font-body-lg text-body-lg text-ld-secondary max-w-2xl mx-auto">
            Trois étapes simples pour transformer votre façon de gérer votre entreprise.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-ld-outline-variant/30 z-0"></div>

          {/* Step 1 */}
          <AnimateOnScroll delay="0" className="relative z-10 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-ld-surface-container-low flex items-center justify-center mb-6 shadow-sm border-4 border-white relative group transition-transform duration-300 hover:scale-105">
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-ld-primary text-white font-bold flex items-center justify-center shadow-md">
                1
              </div>
              <UserPlus className="text-ld-primary w-10 h-10 group-hover:text-ld-primary-hover transition-colors" />
            </div>
            <h3 className="font-headline-md text-xl font-bold text-ld-on-background mb-3">
              Inscris-toi
            </h3>
            <p className="font-body-md text-ld-secondary max-w-xs">
              Crée ton compte gratuitement en quelques secondes. Aucune carte bancaire requise.
            </p>
          </AnimateOnScroll>

          {/* Step 2 */}
          <AnimateOnScroll delay="200" className="relative z-10 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-ld-primary flex items-center justify-center mb-6 shadow-md border-4 border-white relative group transition-transform duration-300 hover:scale-105">
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-ld-on-background text-white font-bold flex items-center justify-center shadow-md">
                2
              </div>
              <Sparkles className="text-white w-10 h-10" />
            </div>
            <h3 className="font-headline-md text-xl font-bold text-ld-on-background mb-3">
              Crée ta première facture
            </h3>
            <p className="font-body-md text-ld-secondary max-w-xs">
              Ajoute ton client, tes services et laisse l'application calculer la TVA pour toi.
            </p>
          </AnimateOnScroll>

          {/* Step 3 */}
          <AnimateOnScroll delay="400" className="relative z-10 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-ld-surface-container-low flex items-center justify-center mb-6 shadow-sm border-4 border-white relative group transition-transform duration-300 hover:scale-105">
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-ld-primary text-white font-bold flex items-center justify-center shadow-md">
                3
              </div>
              <Send className="text-ld-primary w-10 h-10 group-hover:text-ld-primary-hover transition-colors ml-1" />
            </div>
            <h3 className="font-headline-md text-xl font-bold text-ld-on-background mb-3">
              Envoie et suis les paiements
            </h3>
            <p className="font-body-md text-ld-secondary max-w-xs">
              Télécharge le PDF ou envoie-le directement, puis surveille tes paiements en attente.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
