'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MenuItemCard } from './MenuItemCard';
import type { MenuItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { ScrollArea } from '../ui/scroll-area';

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  items: MenuItem[];
}

export function CategoryDialog({ isOpen, onClose, category, items }: CategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1400px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold font-headline tracking-tight">{category}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MenuItemCard item={item} />
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}