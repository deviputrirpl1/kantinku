/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface MenuType {
  id: string | number;
  nama: string;
  harga: number;
  deskripsi?: string;
  stok?: number;
}

interface KartuMenuProps {
  menu?: MenuType;
  item?: MenuType;
}

export default function KartuMenu({ menu, item }: KartuMenuProps) {
  const data = menu || item;
  const [isFavorit, setIsFavorit] = useState(false);

  const stok = data?.stok !== undefined ? data.stok : 10;
  const isHabis = stok === 0;

  useEffect(() => {
    if (data && data.id) {
      try {
        const g = globalThis as unknown as Record<string, any>;
        const stored = g.localStorage ? g.localStorage.getItem("favorit") : null;
        const favoritList: any[] = stored ? JSON.parse(stored) : [];
        const found = favoritList.some((f: any) => String(f.id) === String(data.id));
        setIsFavorit(found);
      } catch {
        // Abaikan
      }
    }
  }, [data]);

  const toggleFavorit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!data) return;

    try {
      const g = globalThis as unknown as Record<string, any>;
      const stored = g.localStorage ? g.localStorage.getItem("favorit") : null;
      const favoritList: any[] = stored ? JSON.parse(stored) : [];

      let updatedList = [...favoritList];
      if (isFavorit) {
        updatedList = updatedList.filter((f: any) => String(f.id) !== String(data.id));
      } else {
        updatedList.push({ id: data.id, nama: data.nama, harga: data.harga });
      }

      if (g.localStorage) {
        g.localStorage.setItem("favorit", JSON.stringify(updatedList));
      }
      setIsFavorit(!isFavorit);
    } catch {
      // Abaikan
    }
  };

  if (!data) return null;

  return (
    <div
      className={`group relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
        isHabis
          ? "bg-gray-50 border-gray-200 opacity-60"
          : "bg-white border-gray-100 shadow-sm hover:shadow-xl hover:shadow-red-50 hover:-translate-y-1"
      }`}
    >
      <div>
        <div className="flex justify-between items-start gap-2">
          <div>
            <h2 className={`text-lg font-bold tracking-tight ${isHabis ? "text-gray-400" : "text-gray-900"}`}>
              {data.nama}
            </h2>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  isHabis ? "bg-red-400" : "bg-emerald-500"
                }`}
              />
              <span className="text-xs font-medium text-gray-500">
                Stok: {isHabis ? <strong className="text-red-500 font-semibold">Habis</strong> : stok}
              </span>
            </div>
          </div>

          <button
            onClick={toggleFavorit}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isFavorit
                ? "bg-red-50 text-red-500 shadow-xs"
                : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500"
            }`}
            title={isFavorit ? "Hapus dari Favorit" : "Tambah ke Favorit"}
          >
            <span className="text-base">{isFavorit ? "❤️" : "🤍"}</span>
          </button>
        </div>

        <p className={`text-lg font-black mt-3 ${isHabis ? "text-gray-400" : "text-red-600"}`}>
          Rp {data.harga.toLocaleString("id-ID")}
        </p>

        {data.deskripsi && (
          <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${isHabis ? "text-gray-400" : "text-gray-500"}`}>
            {data.deskripsi}
          </p>
        )}
      </div>

      <div className="mt-5">
        {isHabis ? (
          <div className="w-full text-center bg-gray-200 text-gray-400 py-2.5 rounded-xl text-xs font-bold cursor-not-allowed">
            Stok Habis
          </div>
        ) : (
          <Link
            href={`/menu/${data.id}`}
            className="w-full block text-center bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-red-200 transition-colors"
          >
            Lihat Detail
          </Link>
        )}
      </div>
    </div>
  );
}