import React from "react";
import { Star } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function Testimonials() {
  return (
    <section className="py-spacing-section-gap px-spacing-margin-mobile md:px-spacing-margin-desktop bg-ld-surface border-t border-ld-outline-variant/10">
      <div className="max-w-[var(--spacing-container-max)] mx-auto">
        <AnimateOnScroll className="text-center mb-16">
          <p className="font-label-sm text-label-sm text-ld-primary uppercase tracking-wider mb-4 font-bold">
            Témoignages
          </p>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-ld-on-background mb-4">
            Ils nous font confiance
          </h2>
          <p className="font-body-lg text-body-lg text-ld-secondary max-w-2xl mx-auto">
            Découvrez comment iziFacture aide les entrepreneurs africains à développer leur activité.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <AnimateOnScroll delay="0">
            <div className="bg-ld-surface-container-lowest rounded-3xl p-8 shadow-soft border border-ld-outline-variant/20 h-full flex flex-col">
              <div className="flex text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="font-body-lg text-lg text-ld-on-background mb-8 flex-grow">
                "Avant, je passais des heures à faire mes factures sur Excel. Avec iziFacture, ça me prend littéralement 2 minutes. La gestion de la TVA est un vrai soulagement pour ma comptabilité."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-ld-primary-fixed flex items-center justify-center text-ld-primary font-bold text-lg">
                  A
                </div>
                <div>
                  <h4 className="font-headline-md font-bold text-ld-on-background">Amadou S.</h4>
                  <p className="font-body-md text-sm text-ld-secondary">Agence Web, Sénégal</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Testimonial 2 */}
          <AnimateOnScroll delay="100">
            <div className="bg-ld-primary rounded-3xl p-8 shadow-float h-full flex flex-col text-ld-on-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>
              <div className="flex text-amber-400 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="font-body-lg text-lg mb-8 flex-grow relative z-10">
                "Le suivi des paiements a sauvé ma trésorerie. Je sais exactement quels clients relancer. L'interface est super propre et très professionnelle quand j'envoie le PDF."
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                  K
                </div>
                <div>
                  <h4 className="font-headline-md font-bold text-white">Koffi K.</h4>
                  <p className="font-body-md text-sm text-ld-inverse-primary">Consultant IT, Côte d'Ivoire</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Testimonial 3 */}
          <AnimateOnScroll delay="200">
            <div className="bg-ld-surface-container-lowest rounded-3xl p-8 shadow-soft border border-ld-outline-variant/20 h-full flex flex-col">
              <div className="flex text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="font-body-lg text-lg text-ld-on-background mb-8 flex-grow">
                "Une application vraiment pensée pour nos réalités. C'est simple, rapide et ça donne une image très pro à ma jeune startup face aux gros clients."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-ld-primary-fixed flex items-center justify-center text-ld-primary font-bold text-lg">
                  M
                </div>
                <div>
                  <h4 className="font-headline-md font-bold text-ld-on-background">Marie N.</h4>
                  <p className="font-body-md text-sm text-ld-secondary">Design Studio, Cameroun</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
