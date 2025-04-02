import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { MobileSearch } from "@/components/mobile-search";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-[#38bdf8]">Kokunime</h1>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex relative w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search Anime Here..." className="pl-10 rounded-full text-white" />
          </div>
          <div className="md:hidden">
            <MobileSearch />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
