import React from "react";
import { Check } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function Pricing() {
  return (
    <section id="pricing" className="py-spacing-section-gap px-spacing-margin-mobile md:px-spacing-margin-desktop bg-ld-surface-alt border-t border-ld-outline-variant/10">
      <div className="max-w-[var(--spacing-container-max)] mx-auto">
        <AnimateOnScroll className="text-center mb-16">
          <p className="font-label-sm text-label-sm text-ld-primary uppercase tracking-wider mb-4 font-bold">
            Tarifs transparents
          </p>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-ld-on-background mb-4">
            Un tarif adapté à votre croissance
          </h2>
          <p className="font-body-lg text-body-lg text-ld-secondary max-w-2xl mx-auto">
            Commencez gratuitement, passez à la vitesse supérieure quand vous êtes prêt. Sans engagement.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {/* Free Plan */}
          <AnimateOnScroll delay="0">
            <div className="bg-ld-surface-container-lowest rounded-3xl p-8 shadow-soft border border-ld-outline-variant/20 h-full flex flex-col">
              <h3 className="font-headline-md text-2xl font-bold text-ld-on-background mb-2">Gratuit</h3>
              <p className="font-body-md text-ld-secondary mb-6">Pour les freelances qui démarrent.</p>
              <div className="mb-8">
                <span className="font-headline-lg text-4xl font-bold text-ld-on-background">0 FCFA</span>
                <span className="font-body-md text-ld-secondary"> /mois</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-ld-primary-fixed flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-ld-primary" />
                  </div>
                  <span className="font-body-md text-ld-on-background">5 factures par mois</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-ld-primary-fixed flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-ld-primary" />
                  </div>
                  <span className="font-body-md text-ld-on-background">1 utilisateur</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-ld-primary-fixed flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-ld-primary" />
                  </div>
                  <span className="font-body-md text-ld-on-background">Gestion des clients de base</span>
                </li>
              </ul>
              <MagneticButton href="/signup" className="w-full bg-ld-surface text-ld-primary font-bold py-3 rounded-xl border border-ld-primary/20 hover:bg-ld-primary-fixed transition-colors text-center block">
                Commencer gratuitement
              </MagneticButton>
            </div>
          </AnimateOnScroll>

          {/* Pro Plan */}
          <AnimateOnScroll delay="100" className="md:-mt-8 md:mb-8 relative z-10">
            <div className="bg-ld-primary rounded-3xl p-8 shadow-float h-full flex flex-col text-ld-on-primary border-2 border-ld-inverse-primary/50 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Le plus populaire
              </div>
              <h3 className="font-headline-md text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="font-body-md text-ld-inverse-primary mb-6">Pour les entrepreneurs établis.</p>
              <div className="mb-8">
                <span className="font-headline-lg text-4xl font-bold text-white">5 000 FCFA</span>
                <span className="font-body-md text-ld-inverse-primary"> /mois</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-body-md text-white font-medium">Factures illimitées</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-body-md text-white font-medium">1 utilisateur principal</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-body-md text-white font-medium">Calcul automatique TVA 18%</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-body-md text-white font-medium">Suivi des paiements</span>
                </li>
              </ul>
              <MagneticButton href="/signup" className="w-full bg-white text-ld-primary font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-soft text-center block">
                Passer en Pro
              </MagneticButton>
            </div>
          </AnimateOnScroll>

          {/* Business Plan */}
          <AnimateOnScroll delay="200">
            <div className="bg-ld-surface-container-lowest rounded-3xl p-8 shadow-soft border border-ld-outline-variant/20 h-full flex flex-col">
              <h3 className="font-headline-md text-2xl font-bold text-ld-on-background mb-2">Business</h3>
              <p className="font-body-md text-ld-secondary mb-6">Pour les agences et PME.</p>
              <div className="mb-8">
                <span className="font-headline-lg text-4xl font-bold text-ld-on-background">15 000 FCFA</span>
                <span className="font-body-md text-ld-secondary"> /mois</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-ld-primary-fixed flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-ld-primary" />
                  </div>
                  <span className="font-body-md text-ld-on-background">Tout inclus dans Pro</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-ld-primary-fixed flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-ld-primary" />
                  </div>
                  <span className="font-body-md text-ld-on-background font-bold">Multi-utilisateurs (jusqu'à 5)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-ld-primary-fixed flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-ld-primary" />
                  </div>
                  <span className="font-body-md text-ld-on-background">Support prioritaire</span>
                </li>
              </ul>
              <MagneticButton href="/signup" className="w-full bg-ld-surface text-ld-primary font-bold py-3 rounded-xl border border-ld-primary/20 hover:bg-ld-primary-fixed transition-colors text-center block">
                Contacter l'équipe
              </MagneticButton>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
