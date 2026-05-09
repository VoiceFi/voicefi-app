"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand";

export function StickyHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={headerRef} className="nav-header fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1120px] mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <BrandMark size={36} />
          <span className="font-brand font-medium text-lg tracking-[0.04em]">VoiceFi</span>
        </Link>
        <Button
          asChild
          size="default"
          className="shadow-xl shadow-[var(--primary-glow)] font-semibold tracking-wide"
        >
          <Link href="/onboarding">
            Get started <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </Button>
      </div>
    </header>
  );
}
