
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Smartphone, ScanLine, ShoppingBasket, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { motion, useInView } from 'framer-motion';
import { useMenuItems } from '@/hooks/useMenuItems';
import { LiveTokenBoard } from '@/components/user/LiveTokenBoard';

export default function Home() {
  const { items: menuItems, loading } = useMenuItems();
  const featuredItems = menuItems.slice(0, 4);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { offsetWidth, offsetHeight } = heroElement;
      const xPos = (clientX / offsetWidth) * 100;
      const yPos = (clientY / offsetHeight) * 100;
      heroElement.style.setProperty('--spotlight-x', `${xPos}%`);
      heroElement.style.setProperty('--spotlight-y', `${yPos}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  function AnimatedCard({ children, index }: { children: React.ReactNode, index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 max-w-screen-2xl items-center">
          <Logo isLink={false} />
          <nav className="ml-auto flex items-center gap-4 sm:gap-6">
            <Button asChild variant="ghost">
              <Link href="/menu">Menu</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Admin Panel</Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Live Token Board */}
      <LiveTokenBoard />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative overflow-hidden group"
          style={
            {
              '--spotlight-x': '50%',
              '--spotlight-y': '50%',
            } as React.CSSProperties
          }
        >
          <div className="absolute inset-0 bg-grid-slate-50 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(600px circle at var(--spotlight-x) var(--spotlight-y), rgba(236, 72, 153, 0.06), transparent 40%)'
            }}
          />
          <div className="container relative py-20 md:py-32 lg:py-40 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="mb-6 font-semibold border-primary/50 text-primary">Fast, Fresh &amp; Flavorful</Badge>
              <h1 className="text-4xl font-extrabold tracking-tighter font-headline sm:text-5xl md:text-6xl lg:text-7xl">
                The Future of Canteen Ordering
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl">
                ServeSmart revolutionizes your dining experience with seamless mobile ordering, QR-based payments, and real-time order tracking. Say goodbye to long queues.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/menu">Explore Menu <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-muted/40">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold font-headline">Simple Steps to Deliciousness</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ordering your favorite meal has never been easier. Just three simple steps.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: ShoppingBasket, title: "1. Browse & Select", description: "Explore our diverse menu and add your favorite dishes to the cart." },
                { icon: ScanLine, title: "2. Pay with QR", description: "Checkout securely and instantly by scanning a QR code with any UPI app." },
                { icon: Smartphone, title: "3. Pick Up Your Order", description: "Get a notification when your order is ready for a quick and easy pickup." },
              ].map((step, index) => (
                <AnimatedCard key={step.title} index={index}>
                  <Card className="text-center border-none shadow-lg bg-card h-full transition-transform duration-300 hover:-translate-y-2">
                    <CardHeader>
                      <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                        <step.icon className="h-10 w-10 text-primary" />
                      </div>
                      <CardTitle>{step.title}</CardTitle>
                      <CardDescription>
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Items Section */}
        <section className="py-24">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold font-headline">Featured Dishes</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Handpicked selections that our customers love the most.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                <p className="col-span-full text-center">Loading featured items...</p>
              ) : featuredItems.map((item, index) => (
                <AnimatedCard key={item.id} index={index}>
                  <Card className="group flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    <CardHeader className="p-0">
                      <div className="aspect-[3/2] relative w-full overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <CardTitle className="text-lg font-headline">{item.name}</CardTitle>
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between items-center">
                      <p className="text-lg font-bold text-primary">₹{item.price.toFixed(2)}</p>
                      <Button asChild variant="secondary">
                        <Link href="/menu">Order</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-muted/40">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold font-headline">What People Are Saying</h2>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: `"The ordering process is so smooth! I love that I can just grab my food without waiting in line. The classic burger is a must-try!"`,
                  avatar: "https://i.pravatar.cc/150?img=1",
                  fallback: "A",
                  name: "Alex Johnson",
                  role: "Regular Customer"
                },
                {
                  quote: `"ServeSmart has completely changed my lunch break. It's fast, efficient, and the food is always fresh and delicious. Highly recommended!"`,
                  avatar: "https://i.pravatar.cc/150?img=5",
                  fallback: "M",
                  name: "Maria Garcia",
                  role: "Happy Customer"
                },
                {
                  quote: `"As an admin, the dashboard is incredibly intuitive. Managing the menu and tracking orders is a breeze. A fantastic system all around."`,
                  avatar: "https://i.pravatar.cc/150?img=8",
                  fallback: "D",
                  name: "David Chen",
                  role: "Canteen Manager"
                }
              ].map((testimonial, index) => (
                <AnimatedCard key={testimonial.name} index={index}>
                  <Card className="bg-card h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
                    <CardHeader className="gap-4">
                      <Quote className="h-8 w-8 text-primary" />
                      <CardDescription className="italic">{testimonial.quote}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.fallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted border-t">
        <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Logo isLink={false} />
            <p className="text-muted-foreground text-sm">The smart, modern solution for canteen management.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/menu" className="text-sm text-muted-foreground hover:text-primary transition-colors">Menu</Link></li>
              <li><Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Admin Login</Link></li>
              <li><Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li><a href="mailto:support@servesmart.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">support@servesmart.com</a></li>
              <li><span className="text-sm text-muted-foreground">+91 12345 67890</span></li>
            </ul>
          </div>
        </div>
        <div className="container py-4 text-center text-sm text-muted-foreground border-t">
          <p>&copy; {new Date().getFullYear()} ServeSmart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
