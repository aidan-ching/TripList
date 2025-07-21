import InfoCards from "@/components/HomePage/InfoCards";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen flex flex-col items-center gap-5">
      <div className="text-6xl font-semibold">Plan your trip. Pack smarter</div>
      <div>Smart Packing, weather aware, collaborative</div>
      <Button variant="outline" className="cursor-pointer">
        <Link href="/plan">Get started</Link>
      </Button>
      <InfoCards />
    </div>
  );
}
