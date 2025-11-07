'use client';

import Link from 'next/link';
import { ShoppingCart, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/shared/Logo';
import { CartSidebar } from './CartSidebar';
import { useCart } from '@/hooks/use-cart';

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/">
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/menu">
                Menu
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/admin">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge
                      variant="default"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <CartSidebar />
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  );
}
