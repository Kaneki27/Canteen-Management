
'use client';

import type { Category, DietaryType, MenuItem } from '@/lib/types';
import { MenuItemCard } from '@/components/user/MenuItemCard';
import { LazyMenuItemCard } from '@/components/user/LazyMenuItemCard';
import { MenuFilters } from '@/components/user/MenuFilters';
import { motion } from 'framer-motion';
import { useMenuItems } from '@/hooks/useMenuItems';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import CategoryDialog for better code splitting
const CategoryDialog = dynamic(() => import('@/components/user/CategoryDialog').then(mod => ({ default: mod.CategoryDialog })), {
  ssr: false
});

export default function MenuPage() {
  const { items: menuItems, loading } = useMenuItems();
  const categories: Category[] = ['Main Course', 'Sides', 'Beverages', 'Desserts'];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<DietaryType | 'all'>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under100' | '100-200' | 'above200'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'newest'>('popular');
  const [quickFilter, setQuickFilter] = useState<'all' | 'under100' | 'bestsellers' | 'new'>('all');

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' || 
           selectedDietary !== 'all' || 
           priceRange !== 'all' || 
           quickFilter !== 'all';
  }, [searchQuery, selectedDietary, priceRange, quickFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDietary('all');
    setPriceRange('all');
    setQuickFilter('all');
    setSortBy('popular');
  };

  // Handle quick filter changes
  const handleQuickFilterChange = (filter: 'all' | 'under100' | 'bestsellers' | 'new') => {
    setQuickFilter(filter);
    // Reset other filters when quick filter is applied
    if (filter !== 'all') {
      setSelectedDietary('all');
      setPriceRange('all');
    }
    // Set price range for under100
    if (filter === 'under100') {
      setPriceRange('under100');
    }
  };

  // Filter and sort menu items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...menuItems];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply dietary filter
    if (selectedDietary !== 'all') {
      filtered = filtered.filter(item => item.dietaryType === selectedDietary);
    }

    // Apply price range filter
    if (priceRange === 'under100') {
      filtered = filtered.filter(item => item.price < 100);
    } else if (priceRange === '100-200') {
      filtered = filtered.filter(item => item.price >= 100 && item.price <= 200);
    } else if (priceRange === 'above200') {
      filtered = filtered.filter(item => item.price > 200);
    }

    // Apply quick filters
    if (quickFilter === 'bestsellers') {
      filtered = filtered.filter(item => item.isPopular);
    } else if (quickFilter === 'new') {
      filtered = filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 12);
    }

    // Apply sorting
    if (sortBy === 'popular') {
      filtered = filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else if (sortBy === 'price-low') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered = filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return filtered;
  }, [menuItems, searchQuery, selectedDietary, priceRange, sortBy, quickFilter]);

  return (
    <div className="container py-12">
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 bg-grid-slate-50 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"></div>
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-extrabold tracking-tighter font-headline sm:text-6xl lg:text-7xl">Our Menu</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            Fresh, delicious, and made-to-order just for you.
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-12">
        <MenuFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDietary={selectedDietary}
          onDietaryChange={setSelectedDietary}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          quickFilter={quickFilter}
          onQuickFilterChange={handleQuickFilterChange}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {loading ? (
        <div className="text-center">
            <p>Loading menu...</p>
        </div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No items found matching your filters.</p>
          <Button onClick={clearFilters} className="mt-4">Clear Filters</Button>
        </div>
      ) : (
        <div className="space-y-16">
          {categories.map((category) => {
            const items = filteredAndSortedItems.filter((item) => item.category === category);
            if (items.length === 0) return null;

            return (
              <section key={category}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-4xl font-bold font-headline tracking-tight">
                    {category} <span className="text-muted-foreground text-2xl">({items.length})</span>
                  </h2>
                  {items.length > 8 && (
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedCategory(category)}
                    >
                      See All {items.length}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {items.slice(0, 8).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <LazyMenuItemCard item={item} index={index} />
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {selectedCategory && (
        <CategoryDialog
          isOpen={true}
          onClose={() => setSelectedCategory(null)}
          category={selectedCategory}
          items={filteredAndSortedItems.filter((item) => item.category === selectedCategory)}
        />
      )}
    </div>
  );
}
