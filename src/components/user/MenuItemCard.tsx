'use client';

import Image from 'next/image';
import { Plus, Sparkles } from 'lucide-react';

import type { MenuItem } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface MenuItemCardProps {
  item: MenuItem;
}

const getDietaryIcon = (type?: string) => {
  switch (type) {
    case 'veg':
      return <div className="w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center"><div className="w-2 h-2 bg-green-600 rounded-full"></div></div>;
    case 'non-veg':
      return <div className="w-4 h-4 border-2 border-red-600 rounded-sm flex items-center justify-center"><div className="w-2 h-2 bg-red-600 rounded-full"></div></div>;
    case 'vegan':
      return <span className="text-green-600">🌱</span>;
    default:
      return null;
  }
};

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full overflow-hidden">
             <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
             />
             {item.isPopular && (
               <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-white">
                 <Sparkles className="h-3 w-3 mr-1" />
                 Bestseller
               </Badge>
             )}
             <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full p-1">
               {getDietaryIcon(item.dietaryType)}
             </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline">{item.name}</CardTitle>
        <CardDescription className="mt-1 text-sm line-clamp-2">{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-lg font-bold text-primary">₹{item.price.toFixed(2)}</p>
        <Button onClick={handleAddToCart} size="icon">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add to cart</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
