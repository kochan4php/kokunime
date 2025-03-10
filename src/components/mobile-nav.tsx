"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";

const routes = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Anime List",
    path: "/anime-list",
  },
  {
    name: "Genres",
    path: "/genres",
  },
  {
    name: "Seasons",
    path: "/seasons",
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const isMobile = useClientMediaQuery("(max-width: 576px)");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" className="hover:bg-transparent" variant="ghost">
          <Menu color="white" size={50} />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={`${isMobile ? "bottom" : "left"}`} className="bg-slate-900 border-r-slate-800">
        <SheetHeader>
          <SheetTitle className="text-left text-[#38bdf8]">Kokunime</SheetTitle>
        </SheetHeader>
        <Separator className="my-4 bg-slate-700" />
        <nav className="flex flex-col gap-4">
          {routes.map((route) => (
            <Button
              key={route.path}
              variant="link"
              className="justify-start px-2 hover:bg-slate-800/50 text-white"
              asChild
            >
              <Link href={route.path} onClick={() => setOpen(false)} className="hover:text-[#38bdf8] transition-colors">
                {route.name}
              </Link>
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
