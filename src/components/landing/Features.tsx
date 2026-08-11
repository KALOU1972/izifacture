import React from "react";
import { FileText, Percent, PieChart, Users } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function Features() {
  return (
    <section id="features" className="py-spacing-section-gap px-spacing-margin-mobile md:px-spacing-margin-desktop bg-ld-surface border-t border-ld-outline-variant/10">
      <div className="max-w-[var(--spacing-container-max)] mx-auto">
        <AnimateOnScroll className="text-center mb-16">
          <p className="font-label-sm text-label-sm text-ld-primary uppercase tracking-wider mb-4 font-bold">
            Fonctionnalités
          </p>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-ld-on-background mb-4">
            Tout ce dont vous avez besoin pour facturer
          </h2>
          <p className="font-body-lg text-body-lg text-ld-secondary max-w-2xl mx-auto">
            Gagnez du temps et soyez payé plus rapidement grâce à des outils conçus spécifiquement pour les réalités locales.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <AnimateOnScroll delay="0">
            <div className="bg-ld-surface-container-lowest rounded-2xl p-8 shadow-soft border border-ld-outline-variant/20 hover:-translate-y-2 hover:shadow-float transition-all duration-300 group h-full">
              <div className="w-12 h-12 rounded-xl bg-ld-primary-fixed flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-ld-primary transition-all duration-300">
                <FileText className="text-ld-primary w-6 h-6 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-headline-md text-xl font-bold text-ld-on-background mb-3">
                Factures pro en 2 clics
              </h3>
              <p className="font-body-md text-ld-secondary">
                Créez et envoyez des factures élégantes à votre image en quelques secondes. Finis les modèles Word fastidieux.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Feature 2 */}
          <AnimateOnScroll delay="100">
            <div className="bg-ld-surface-container-lowest rounded-2xl p-8 shadow-soft border border-ld-outline-variant/20 hover:-translate-y-2 hover:shadow-float transition-all duration-300 group h-full">
              <div className="w-12 h-12 rounded-xl bg-ld-primary-fixed flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-ld-primary transition-all duration-300">
                <Percent className="text-ld-primary w-6 h-6 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-headline-md text-xl font-bold text-ld-on-background mb-3">
                TVA 18% automatique
              </h3>
              <p className="font-body-md text-ld-secondary">
                Ne vous cassez plus la tête avec les calculs. La TVA s'applique automatiquement sur vos montants HT.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Feature 3 */}
          <AnimateOnScroll delay="200">
            <div className="bg-ld-surface-container-lowest rounded-2xl p-8 shadow-soft border border-ld-outline-variant/20 hover:-translate-y-2 hover:shadow-float transition-all duration-300 group h-full">
              <div className="w-12 h-12 rounded-xl bg-ld-primary-fixed flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-ld-primary transition-all duration-300">
                <PieChart className="text-ld-primary w-6 h-6 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-headline-md text-xl font-bold text-ld-on-background mb-3">
                Suivi en temps réel
              </h3>
              <p className="font-body-md text-ld-secondary">
                Sachez toujours qui a payé et qui vous doit de l'argent grâce à un tableau de bord clair et intuitif.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Feature 4 */}
          <AnimateOnScroll delay="300">
            <div className="bg-ld-surface-container-lowest rounded-2xl p-8 shadow-soft border border-ld-outline-variant/20 hover:-translate-y-2 hover:shadow-float transition-all duration-300 group h-full">
              <div className="w-12 h-12 rounded-xl bg-ld-primary-fixed flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-ld-primary transition-all duration-300">
                <Users className="text-ld-primary w-6 h-6 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-headline-md text-xl font-bold text-ld-on-background mb-3">
                Gestion clients intégrée
              </h3>
              <p className="font-body-md text-ld-secondary">
                Sauvegardez les informations de vos clients pour facturer encore plus vite la prochaine fois.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
