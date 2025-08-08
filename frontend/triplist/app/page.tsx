import InfoCards from "@/components/HomePage/InfoCards";
import { Button } from "@/components/ui/button";
import { Plane, Cloud, Users, CheckSquare } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Plan your trip.{" "}
              <span className="text-primary">Pack smarter.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Never forget essential items again. Create intelligent packing lists tailored to your destination, 
              weather conditions, and travel duration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/plan" className="gap-2">
                  <Plane className="h-4 w-4" />
                  Start Planning
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container px-4 py-16">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            <div className="bg-card rounded-lg p-6 border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Weather-Aware</h3>
              <p className="text-muted-foreground">
                Automatically adapts your packing list based on your destination&apos;s weather forecast.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborative</h3>
              <p className="text-muted-foreground">
                Share your lists with travel companions and coordinate group items effortlessly.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Lists</h3>
              <p className="text-muted-foreground">
                AI-powered suggestions ensure you never miss crucial items for your specific trip type.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
