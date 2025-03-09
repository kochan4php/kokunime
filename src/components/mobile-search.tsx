"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search } from "lucide-react";
import { useState } from "react";

export function MobileSearch() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" className="hover:bg-transparent" variant="ghost">
          <Search color="white" size={50} />
          <span className="sr-only">Search</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="bg-slate-900 border-b-slate-800">
        <SheetHeader>
          <SheetTitle className="text-left text-[#38bdf8]">Search Anime</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Anime Here..."
              className="pl-10 bg-slate-900/50 border-slate-700 rounded-md text-white"
              autoFocus
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
