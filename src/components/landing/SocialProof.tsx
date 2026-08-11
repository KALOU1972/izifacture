import React from "react";

export function SocialProof() {
  return (
    <section className="py-12 border-t border-b border-ld-outline-variant/10 bg-ld-surface-container-low/50">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-spacing-margin-mobile md:px-spacing-margin-desktop text-center">
        <p className="font-label-sm text-label-sm text-ld-outline uppercase tracking-wider mb-8">
          Ils nous font confiance
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="font-headline-md text-headline-md text-ld-secondary font-bold hover:text-ld-primary transition-colors cursor-pointer">
            freshworks
          </span>
          <span className="font-headline-md text-headline-md text-ld-secondary font-bold hover:text-ld-primary transition-colors cursor-pointer">
            Outreach
          </span>
          <span className="font-headline-md text-headline-md text-ld-secondary font-bold hover:text-ld-primary transition-colors cursor-pointer">
            pipedrive
          </span>
          <span className="font-headline-md text-headline-md text-ld-secondary font-bold hover:text-ld-primary transition-colors cursor-pointer">
            Marketo
          </span>
          <span className="font-headline-md text-headline-md text-ld-secondary font-bold hover:text-ld-primary transition-colors cursor-pointer">
            aws
          </span>
        </div>
      </div>
    </section>
  );
}
