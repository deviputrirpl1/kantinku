/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { menu as daftarMenu } from "@/data/menu";

export default function MenuPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [pencarian, setPencarian] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urutkan, setUrutkan] = useState("default");
  const [favoritIds, setFavoritIds] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
    try {
      const g = globalThis as unknown as Record<string, any>;
      const stored = g.localStorage ? g.localStorage.getItem("favorit") : null;
      const favoritList: any[] = stored ? JSON.parse(stored) : [];
      setFavoritIds(favoritList.map((f: any) => String(f.id)));
    } catch {
      // Abaikan
    }
  }, []);

  const toggleFavorit = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const g = globalThis as unknown as Record<string, any>;
      const stored = g.localStorage ? g.localStorage.getItem("favorit") : null;
      const favoritList: any[] = stored ? JSON.parse(stored) : [];

      const isFav = favoritIds.includes(String(item.id));
      let updatedList = [...favoritList];
      let newFavs = [...favoritIds];

      if (isFav) {
        updatedList = updatedList.filter((f: any) => String(f.id) !== String(item.id));
        newFavs = newFavs.filter((id) => id !== String(item.id));
      } else {
        updatedList.push({ id: item.id, nama: item.nama, harga: item.harga });
        newFavs.push(String(item.id));
      }

      setFavoritIds(newFavs);
      if (g.localStorage) {
        g.localStorage.setItem("favorit", JSON.stringify(updatedList));
      }
    } catch {
      // Abaikan
    }
  };

  const filteredMenu = daftarMenu.filter((item: any) => {
    const namaMenu = item.nama || item.name || "";
    const matchNama = namaMenu.toLowerCase().includes(pencarian.toLowerCase());
    
    const itemKat = item.kategori || item.category || "Semua";
    const matchKat = kategori === "Semua" || itemKat.toLowerCase() === kategori.toLowerCase();
    
    return matchNama && matchKat;
  });

  const sortedMenu = [...filteredMenu].sort((a: any, b: any) => {
    const namaA = (a.nama || a.name || "").toLowerCase();
    const namaB = (b.nama || b.name || "").toLowerCase();
    const hargaA = a.harga || a.price || 0;
    const hargaB = b.harga || b.price || 0;

    if (urutkan === "az") return namaA.localeCompare(namaB);
    if (urutkan === "za") return namaB.localeCompare(namaA);
    if (urutkan === "termurah") return hargaA - hargaB;
    if (urutkan === "termahal") return hargaB - hargaA;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Katalog Menu KantinKu</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Pilih menu favoritmu dan nikmati hidangan terbaik hari ini.</p>
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Cari makanan atau minuman..."
            value={pencarian}
            onChange={(e: any) => setPencarian(e.target.value)}
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          />
        </div>
      </div>

      {/* Baris Filter Kategori & Dropdown Urutkan */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        {/* Dropdown Kategori */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Kategori:</span>
          <select
            value={kategori}
            onChange={(e: any) => setKategori(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-extrabold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-xs cursor-pointer"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Camilan">Camilan</option>
          </select>
        </div>

        {/* Dropdown Urutkan */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Urutkan:</span>
          <select
            value={urutkan}
            onChange={(e: any) => setUrutkan(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-extrabold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-xs cursor-pointer"
          >
            <option value="default">Pilih Urutan</option>
            <option value="az">Nama (A - Z)</option>
            <option value="za">Nama (Z - A)</option>
            <option value="termurah">Harga Termurah</option>
            <option value="termahal">Harga Termahal</option>
          </select>
        </div>
      </div>

      {/* Daftar Menu Grid */}
      {sortedMenu.length === 0 ? (
        <div className="text-center py-20 space-y-3 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-base font-bold text-gray-800">Menu tidak ditemukan</p>
          <p className="text-xs text-gray-400">Coba kata kunci atau kategori lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMenu.map((item: any) => {
            const isHabis = item.stok === 0 || item.stock === 0;
            const isFav = isMounted && favoritIds.includes(String(item.id));

            const cardContent = (
              <>
                {/* Badge Stok & Tombol Favorit */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  {isHabis ? (
                    <span className="bg-gray-200 text-gray-600 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                      Habis
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-600 font-bold text-[10px] px-3 py-1 rounded-full">
                      Stok: {item.stok !== undefined ? item.stok : 10}
                    </span>
                  )}
                  <button
                    onClick={(e) => toggleFavorit(item, e)}
                    className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md text-sm transition-transform active:scale-90 hover:scale-110 cursor-pointer"
                  >
                    {isFav ? "❤️" : "🤍"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="w-full h-40 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl font-black text-gray-300 group-hover:scale-[1.02] transition-transform overflow-hidden">
                    {item.gambar || item.image ? (
                      <img src={item.gambar || item.image} alt={item.nama} className="w-full h-full object-cover" />
                    ) : (
                      <span>🍽️</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-gray-900 group-hover:text-red-600 transition-colors">
                      {item.nama || item.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {item.deskripsi || item.description || "Lezat dan nikmat disajikan hangat."}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-base font-black text-red-600">
                    Rp {(item.harga || item.price || 0).toLocaleString("id-ID")}
                  </span>
                  {isHabis ? (
                    <span className="bg-gray-100 text-gray-400 px-4 py-2 rounded-xl text-xs font-bold cursor-not-allowed">
                      Habis
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-colors">
                      Detail &rarr;
                    </span>
                  )}
                </div>
              </>
            );

            if (isHabis) {
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl border border-gray-100 p-5 shadow-sm opacity-60 flex flex-col justify-between relative overflow-hidden cursor-not-allowed"
                >
                  {cardContent}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={`/menu/${item.id}`}
                className="group bg-white rounded-3xl border border-gray-100 p-5 shadow-lg shadow-gray-100 hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}