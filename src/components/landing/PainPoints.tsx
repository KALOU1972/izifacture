import React from "react";
import { Frown, Calculator, EyeOff } from "lucide-react";

export function PainPoints() {
  return (
    <section id="features" className="py-spacing-section-gap px-spacing-margin-mobile md:px-spacing-margin-desktop bg-ld-surface">
      <div className="max-w-[var(--spacing-container-max)] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-ld-on-background mb-4">
            La facturation ne devrait pas être un casse-tête
          </h2>
          <p className="font-body-lg text-body-lg text-ld-secondary">
            Vos problèmes actuels ont des solutions simples.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-gutter">
          {/* Card 1 */}
          <div className="bg-ld-surface-container-lowest rounded-2xl p-8 shadow-soft border border-ld-outline-variant/10 hover:-translate-y-2 hover:shadow-float transition-all duration-300 group cursor-default">
            <div className="w-12 h-12 rounded-full bg-ld-error-container/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-ld-error-container transition-all duration-300">
              <Frown className="text-ld-error w-6 h-6" />
            </div>
            <h3 className="font-headline-md text-headline-md text-ld-on-background mb-3">
              Manque de professionnalisme
            </h3>
            <p className="font-body-md text-body-md text-ld-secondary">
              Des factures Word mal formatées qui nuisent à l'image de votre entreprise.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-ld-surface-container-lowest rounded-2xl p-8 shadow-soft border border-ld-outline-variant/10 hover:-translate-y-2 hover:shadow-float transition-all duration-300 group cursor-default">
            <div className="w-12 h-12 rounded-full bg-ld-error-container/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-ld-error-container transition-all duration-300">
              <Calculator className="text-ld-error w-6 h-6" />
            </div>
            <h3 className="font-headline-md text-headline-md text-ld-on-background mb-3">
              Calculs manuels
            </h3>
            <p className="font-body-md text-body-md text-ld-secondary">
              Erreurs de TVA et pertes de temps sur des calculs répétitifs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-ld-surface-container-lowest rounded-2xl p-8 shadow-soft border border-ld-outline-variant/10 hover:-translate-y-2 hover:shadow-float transition-all duration-300 group cursor-default">
            <div className="w-12 h-12 rounded-full bg-ld-error-container/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-ld-error-container transition-all duration-300">
              <EyeOff className="text-ld-error w-6 h-6" />
            </div>
            <h3 className="font-headline-md text-headline-md text-ld-on-background mb-3">
              Paiements non suivis
            </h3>
            <p className="font-body-md text-body-md text-ld-secondary">
              Difficulté à savoir qui a payé quoi et relances fastidieuses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
