import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code, Share2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Code className="w-8 h-8 text-primary" />
          <h1 className="font-headline">CodeStudio</h1>
        </Link>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </header>
      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium mb-4">
              Now in Open Alpha!
            </div>
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
              Share, Discover, and Discuss Code
            </h2>
            <p className="mt-6 text-lg text-foreground/80 max-w-2xl mx-auto">
              CodeStudio is the modern social platform for developers. Share your best code snippets, discover elegant solutions, and join a community passionate about quality code.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="font-bold">
                <Link href="/auth/signin">Get Started for Free</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="font-bold">
                <Link href="/feed">
                  <Share2 className="mr-2 h-5 w-5" />
                  Explore Snippets
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-foreground/60">
        <p>&copy; {new Date().getFullYear()} CodeStudio. All rights reserved.</p>
      </footer>
    </div>
  );
}
