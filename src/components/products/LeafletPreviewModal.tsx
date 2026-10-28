'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  X,
  ShieldAlert,
  ThermometerSnowflake,
  CheckCircle2,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { ProductItem } from '@/types';

interface LeafletPreviewModalProps {
  product: ProductItem;
}

export function LeafletPreviewModal({ product }: LeafletPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="rounded-lg bg-brand-neutral border border-brand-border p-5 space-y-3.5">
      <div className="flex items-center gap-2.5 text-brand-navy font-heading font-bold text-sm">
        <FileText className="w-5 h-5 text-brand-goldDark shrink-0" />
        <span>Approved Product Leaflet &amp; Technical Dossier</span>
      </div>
      <p className="text-xs text-brand-body leading-relaxed">
        Official manufacturer summary of product characteristics (SmPC), approved Ethiopian package leaflet, and Certificate of Analysis (CoA) are supplied upon verification of specific registered batch availability.
      </p>

      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand-navy hover:bg-brand-navyLight text-white text-xs font-heading font-semibold transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-brand-gold" />
          <span>Preview Standardized Leaflet Template</span>
        </button>

        <Link
          href={`/contact?product=${product.slug}&type=product-inquiry`}
          className="inline-flex items-center gap-1 text-xs font-heading font-bold text-brand-navy hover:text-brand-orange"
        >
          <span>Request Official Dossier</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
        </Link>
      </div>

      {/* Accessible Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="leaflet-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/80 backdrop-blur-sm overflow-y-auto"
        >
          <div className="bg-white rounded-lg border-2 border-brand-gold max-w-2xl w-full shadow-corporateHover overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between border-b border-brand-gold/40">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold block">
                  TECHNICAL LEAFLET TEMPLATE • {product.id}
                </span>
                <h3
                  id="leaflet-modal-title"
                  className="font-heading text-lg font-bold text-white"
                >
                  {product.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close leaflet preview modal"
                className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-brand-body">
              <div className="p-3.5 rounded bg-brand-goldLight border-l-4 border-brand-orange flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div className="text-xs text-brand-navy">
                  <strong>Regulatory Verification Notice:</strong> This preview shows the standardized technical data structure required before a downloadable manufacturer PDF leaflet is published. Commercial labels follow the exact Ethiopian registered dossier.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded bg-brand-neutral border border-brand-border">
                <div>
                  <span className="font-bold text-brand-navy block text-xs uppercase">
                    1. Active Composition
                  </span>
                  <span className="mt-0.5 block">
                    {product.activeIngredientOrComposition}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-brand-navy block text-xs uppercase">
                    2. Dosage Form &amp; Pack Size
                  </span>
                  <span className="mt-0.5 block">
                    {product.dosageForm} • {product.packSize}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-brand-navy block text-xs uppercase">
                    3. Authorized Target Species
                  </span>
                  <span className="mt-0.5 block font-semibold">
                    {product.intendedSpecies.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-brand-navy block text-xs uppercase">
                    4. Classification
                  </span>
                  <span className="mt-0.5 block">{product.classification}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-heading font-bold text-brand-navy text-xs uppercase tracking-wider">
                    5. Approved Indications &amp; Directions for Use
                  </h4>
                  <p className="mt-1 leading-relaxed">
                    {product.approvedIndicationsSummary}
                  </p>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-brand-navy text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span>6. Storage &amp; Cold-Chain Instructions</span>
                    {product.coldChainRequired && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-orange text-brand-navy text-[10px] font-bold">
                        <ThermometerSnowflake className="w-3 h-3" />
                        Cold-Chain
                      </span>
                    )}
                  </h4>
                  <p className="mt-1 leading-relaxed">{product.storageConditions}</p>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-brand-navy text-xs uppercase tracking-wider">
                    7. Withdrawal Period
                  </h4>
                  <p className="mt-1 leading-relaxed">
                    {product.withdrawalPeriodNote}
                  </p>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-brand-navy text-xs uppercase tracking-wider">
                    8. Veterinary Stewardship &amp; Precautions
                  </h4>
                  <p className="mt-1 leading-relaxed">{product.stewardshipWarning}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-border flex items-center gap-2 text-xs text-brand-muted">
                <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                <span>
                  Reviewed under the technical direction of Dr Etsubdink Negash (General &amp; Technical Manager).
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-brand-neutral px-6 py-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-brand-border bg-white text-brand-navy text-xs font-heading font-semibold hover:bg-brand-neutral"
              >
                <Printer className="w-3.5 h-3.5 text-brand-goldDark" />
                <span>Print Specification Sheet</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded border border-brand-border bg-white text-brand-body text-xs font-heading font-semibold"
                >
                  Close
                </button>
                <Link
                  href={`/contact?product=${product.slug}&type=product-inquiry`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-brand-orange text-brand-navy text-xs font-heading font-bold"
                >
                  <span>Request Verified Batch Leaflet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
