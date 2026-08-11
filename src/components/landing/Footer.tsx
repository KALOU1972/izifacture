import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-spacing-stack-lg bg-ld-primary-container border-t border-ld-outline-variant/10 text-ld-on-primary">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-spacing-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-spacing-gutter font-body-md text-body-md">
        
        <div className="col-span-1 md:col-span-1">
          <span className="font-display-lg text-headline-md text-white block mb-4">
            iziFacture
          </span>
          <p className="text-ld-on-primary-container font-label-sm text-label-sm mb-4">
            © 2024 iziFacture. Fait avec fierté en Afrique.
          </p>
        </div>
        
        <div>
          <h4 className="font-label-md text-label-md font-semibold mb-4 text-white">Produit</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#features" className="text-ld-on-primary-container hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                Fonctionnalités
              </Link>
            </li>
            <li>
              <Link href="#pricing" className="text-ld-on-primary-container hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                Tarifs
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-label-md text-label-md font-semibold mb-4 text-white">Ressources</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-ld-on-primary-container hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                Témoignages
              </Link>
            </li>
            <li>
              <Link href="#" className="text-ld-on-primary-container hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                Blog
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-label-md text-label-md font-semibold mb-4 text-white">Aide</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-ld-on-primary-container hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                Support
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
