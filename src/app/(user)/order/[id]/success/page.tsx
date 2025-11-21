import { CheckCircle, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
  return (
    <div className="container flex items-center justify-center py-24">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="items-center">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-3xl font-headline">Order Placed Successfully!</CardTitle>
          <CardDescription className="text-lg">Thank you for your purchase.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your order ID is:</p>
          <div className="mt-2 p-3 bg-secondary rounded-md">
            <p className="text-lg font-mono font-bold text-primary tracking-wider break-all">{decodeURIComponent(params.id)}</p>
          </div>
          <p className="mt-4 text-muted-foreground">You can use this ID for pickup or any future inquiries.</p>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <p className="flex items-center gap-2 text-muted-foreground"><PartyPopper className="h-5 w-5" />Enjoy your meal!</p>
          <Button asChild size="lg" className="w-full">
            <Link href="/menu">Continue</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
