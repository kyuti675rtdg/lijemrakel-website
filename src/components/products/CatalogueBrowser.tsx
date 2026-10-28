'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, RotateCcw, PackageSearch, ChevronsRight } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/data/productCategories';
import { ProductCard } from './ProductCard';
import { usePublicCms } from '@/lib/usePublicCms';

const SPECIES_FILTERS = ['All Species', 'Cattle', 'Poultry', 'Sheep', 'Goats'];

export function CatalogueBrowser() {
  const { products: catalogueProducts } = usePublicCms();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('All Species');

  const filteredProducts = useMemo(() => {
    return catalogueProducts.filter((product) => {
      if (
        selectedCategory !== 'all' &&
        product.categorySlug !== selectedCategory
      ) {
        return false;
      }

      if (selectedSpecies !== 'All Species') {
        const matchesSpecies = product.intendedSpecies.some((sp) =>
          sp.toLowerCase().includes(selectedSpecies.toLowerCase())
        );
        if (!matchesSpecies) return false;
      }

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const haystacks = [
          product.name,
          product.categoryName,
          product.subcategory || '',
          product.activeIngredientOrComposition,
          product.approvedIndicationsSummary,
          ...product.intendedSpecies,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystacks.includes(q)) return false;
      }

      return true;
    });
  }, [catalogueProducts, searchQuery, selectedCategory, selectedSpecies]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSpecies('All Species');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedSpecies !== 'All Species';

  return (
    <div className="space-y-10">
      {/* Clean Search & Category Filter Bar */}
      <div className="bg-[#F7F7F3] rounded-[24px] p-6 sm:p-8 space-y-6">
        {/* Top Row: Search Input & Species Pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search
              className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, ingredient, or species..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-brand-border bg-white text-sm text-brand-navy placeholder:text-brand-muted focus:outline-none focus:border-brand-navy"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SPECIES_FILTERS.map((species) => (
              <button
                key={species}
                type="button"
                onClick={() => setSelectedSpecies(species)}
                className={`px-3.5 py-2 rounded-full text-xs font-heading font-bold transition-colors ${
                  selectedSpecies === species
                    ? 'bg-brand-orange text-brand-navy'
                    : 'bg-white text-brand-body hover:bg-brand-navy hover:text-white'
                }`}
              >
                {species}
              </button>
            ))}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-brand-navy bg-white border border-brand-border hover:bg-brand-orange transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-brand-border/80">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-full text-xs font-heading font-bold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#0B0E29] text-white'
                : 'bg-white text-brand-navy hover:bg-brand-orange'
            }`}
          >
            All Products ({catalogueProducts.length})
          </button>

          {PRODUCT_CATEGORIES.map((cat) => {
            const count = catalogueProducts.filter(
              (p) => p.categorySlug === cat.slug
            ).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2.5 rounded-full text-xs font-heading font-bold transition-colors ${
                  isSelected
                    ? 'bg-[#0B0E29] text-white'
                    : 'bg-white text-brand-navy hover:bg-brand-orange'
                }`}
              >
                {cat.shortName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="text-xs sm:text-sm font-semibold text-brand-muted">
          Showing <strong className="text-brand-navy">{filteredProducts.length}</strong> products
        </div>
        {selectedCategory !== 'all' && (
          <Link
            href={`/products/${selectedCategory}`}
            className="inline-flex items-center gap-1 text-xs font-heading font-bold text-brand-navy hover:text-brand-orange"
          >
            <span>View Category Overview</span>
            <ChevronsRight className="w-3.5 h-3.5 text-brand-orange" />
          </Link>
        )}
      </div>

      {/* Product Grid or Clean Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#F7F7F3] rounded-[24px] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-white text-brand-navy flex items-center justify-center mx-auto">
            <PackageSearch className="w-6 h-6 text-brand-orange" />
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-navy">
            No matching products found
          </h3>
          <p className="text-xs sm:text-sm text-brand-muted">
            Try resetting your filters or contact our team for specific product inquiries.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B0E29] text-white text-xs font-heading font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
