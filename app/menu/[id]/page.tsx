/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, Suspense } from "react";
import { menu as daftarMenu } from "@/data/menu";
import TambahKeranjang from "@/components/TambahKeranjang";

function DetailMenuContent() {
  const params = useParams();
  const id = params?.id;

  const [item] = useState<any>(() => {
    return daftarMenu.find((m: any) => String(m.id) === String(id)) || null;
  });

  const [isFavorit, setIsFavorit] = useState<boolean>(() => {
    try {
      const g = globalThis as unknown as Record<string, any>;
      const stored = g.localStorage ? g.localStorage.getItem("favorit") : null;
      const favoritList: any[] = stored ? JSON.parse(stored) : [];
      return favoritList.some((f: any) => String(f.id) === String(id));
    } catch {
      return false;
    }
  });

  const toggleFavorit = () => {
    if (!item) return;
    try {
      const g = globalThis as unknown as Record<string, any>;
      const stored = g.localStorage ? g.localStorage.getItem("favorit") : null;
      const favoritList: any[] = stored ? JSON.parse(stored) : [];

      let updatedList = [...favoritList];
      if (isFavorit) {
        updatedList = updatedList.filter((f: any) => String(f.id) !== String(item.id));
      } else {
        updatedList.push({ id: item.id, nama: item.nama, harga: item.harga });
      }

      if (g.localStorage) {
        g.localStorage.setItem("favorit", JSON.stringify(updatedList));
      }
      setIsFavorit(!isFavorit);
    } catch {
      // Abaikan
    }
  };

  if (!item) return <div className="text-center py-20 text-red-500 font-medium">Menu tidak ditemukan.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link href="/menu" className="text-blue-600 text-sm font-medium hover:underline">
        &larr; Kembali ke Menu
      </Link>

      <div className="bg-white border rounded-lg p-6 shadow-sm space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{item.nama}</h1>
        <p className="text-xl font-semibold text-blue-600">
          Rp {(item.harga || item.price || 0).toLocaleString("id-ID")}
        </p>

        <p className="text-gray-600 text-sm leading-relaxed">
          {item.deskripsi || item.description || "Tidak ada deskripsi tersedia untuk menu ini."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t">
          <TambahKeranjang item={item} />
          <button
            onClick={toggleFavorit}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              isFavorit
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {isFavorit ? "Hapus dari Favorit" : "+ Tambah ke Favorit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DetailMenuPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Memuat...</div>}>
      <DetailMenuContent />
    </Suspense>
  );
}