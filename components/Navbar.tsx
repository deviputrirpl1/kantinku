/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function NavContent() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const g = globalThis as unknown as Record<string, any>;
        const stored = g.localStorage?.getItem("keranjang");
        const list: any[] = stored ? JSON.parse(stored) : [];
        const total = list.reduce((acc, item) => acc + (item.jumlah || 1), 0);
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    updateCount();
    const interval = setInterval(updateCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const navs = [
    { name: "Beranda", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Favorit", href: "/favorit" },
    { name: `Keranjang (${cartCount})`, href: "/keranjang" },
    { name: "Riwayat", href: "/riwayat" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="bg-gradient-to-tr from-red-600 to-rose-500 text-white p-2 rounded-xl text-lg font-black shadow-md shadow-red-200">
          🍱
        </span>
        <span className="text-xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent tracking-tight">
          KantinKu
        </span>
      </Link>

      <nav className="flex items-center gap-1 sm:gap-2">
        {navs.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? "bg-red-50 text-red-600 shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <Suspense fallback={<div className="h-16 max-w-6xl mx-auto px-4 flex items-center">Memuat...</div>}>
        <NavContent />
      </Suspense>
    </header>
  );
}