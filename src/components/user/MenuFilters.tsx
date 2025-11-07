'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { DietaryType } from '@/lib/types';

interface MenuFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDietary: DietaryType | 'all';
  onDietaryChange: (dietary: DietaryType | 'all') => void;
  priceRange: 'all' | 'under100' | '100-200' | 'above200';
  onPriceRangeChange: (range: 'all' | 'under100' | '100-200' | 'above200') => void;
  sortBy: 'popular' | 'price-low' | 'price-high' | 'newest';
  onSortChange: (sort: 'popular' | 'price-low' | 'price-high' | 'newest') => void;
  quickFilter: 'all' | 'under100' | 'bestsellers' | 'new';
  onQuickFilterChange: (filter: 'all' | 'under100' | 'bestsellers' | 'new') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function MenuFilters({
  searchQuery,
  onSearchChange,
  selectedDietary,
  onDietaryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  quickFilter,
  onQuickFilterChange,
  onClearFilters,
  hasActiveFilters,
}: MenuFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for dishes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={quickFilter === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onQuickFilterChange('all')}
        >
          All Items
        </Badge>
        <Badge
          variant={quickFilter === 'under100' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onQuickFilterChange('under100')}
        >
          Under ₹100
        </Badge>
        <Badge
          variant={quickFilter === 'bestsellers' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onQuickFilterChange('bestsellers')}
        >
          Bestsellers
        </Badge>
        <Badge
          variant={quickFilter === 'new' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onQuickFilterChange('new')}
        >
          New Items
        </Badge>
        {hasActiveFilters && (
          <Badge
            variant="destructive"
            className="cursor-pointer"
            onClick={onClearFilters}
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Badge>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full sm:w-auto"
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
      </Button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
          {/* Dietary Preference */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Dietary Preference</label>
            <Select value={selectedDietary} onValueChange={onDietaryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="veg">🟢 Vegetarian</SelectItem>
                <SelectItem value="non-veg">🔴 Non-Vegetarian</SelectItem>
                <SelectItem value="vegan">🌱 Vegan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range</label>
            <Select value={priceRange} onValueChange={onPriceRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under100">Under ₹100</SelectItem>
                <SelectItem value="100-200">₹100 - ₹200</SelectItem>
                <SelectItem value="above200">Above ₹200</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Popular" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

