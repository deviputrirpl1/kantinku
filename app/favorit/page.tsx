/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import MenuCard from "@/components/KartuMenu";

export default function FavoritPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoritList, setFavoritList] = useState<any[]>([]);

  useEffect(() => {
    async function loadFavorit() {
      try {
        setLoading(true);
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Gagal mengambil data.");
        const allMenu = await res.json();

        const g = globalThis as unknown as Record<string, any>;
        const stored = g.localStorage ? g.localStorage.getItem("favorit") : null;
        const favIds: any[] = stored ? JSON.parse(stored) : [];
        const favIdSet = new Set(favIds.map((f: any) => String(f.id)));

        const filtered = (allMenu as any[]).filter((m: any) => favIdSet.has(String(m.id)));
        setFavoritList(filtered);
      } catch {
        setError("Gagal memuat menu favorit.");
      } finally {
        setLoading(false);
      }
    }
    loadFavorit();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Memuat...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-medium">{error}</div>;
  if (favoritList.length === 0) return <div className="text-center py-20 text-gray-500 font-medium">Belum ada menu favorit.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Menu Favorit Anda</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favoritList.map((m: any) => (
          <MenuCard key={m.id} menu={m} />
        ))}
      </div>
    </div>
  );
}