
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center animate-fade-in">
        <h1 className="text-9xl font-extrabold tracking-tight text-primary">
          404
        </h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been removed, renamed, or doesn&apos;t exist.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg" className="min-w-[150px]">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
