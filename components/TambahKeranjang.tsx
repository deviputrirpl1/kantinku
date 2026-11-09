/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

export default function TambahKeranjang({ item }: { item: any }) {
  const [isMounted, setIsMounted] = useState(false);
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const kurang = () => {
    if (jumlah > 1) setJumlah(jumlah - 1);
  };

  const tambah = () => {
    setJumlah(jumlah + 1);
  };

  const tambahKeKeranjang = () => {
    if (!item) return;

    try {
      const g = globalThis as unknown as Record<string, any>;
      const stored = g.localStorage ? g.localStorage.getItem("keranjang") : null;
      const keranjangList: any[] = stored ? JSON.parse(stored) : [];

      const index = keranjangList.findIndex((k: any) => String(k.id) === String(item.id));

      if (index !== -1) {
        keranjangList[index].jumlah = (keranjangList[index].jumlah || 1) + jumlah;
      } else {
        keranjangList.push({
          id: item.id,
          nama: item.nama,
          harga: item.harga,
          jumlah: jumlah,
        });
      }

      if (g.localStorage) {
        g.localStorage.setItem("keranjang", JSON.stringify(keranjangList));
      }

      setPesan("Berhasil dimasukkan ke keranjang!");
      setTimeout(() => setPesan(""), 3000);
    } catch {
      setPesan("Gagal memasukkan ke keranjang.");
    }
  };

  if (!isMounted) {
    return <div className="h-10"></div>;
  }

  return (
    <div className="space-y-3 w-full sm:w-auto">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
          <button
            onClick={kurang}
            className="px-3.5 py-2 text-gray-600 hover:bg-gray-200 font-bold transition-colors"
          >
            -
          </button>
          <span className="px-4 text-sm font-bold text-gray-800">{jumlah}</span>
          <button
            onClick={tambah}
            className="px-3.5 py-2 text-gray-600 hover:bg-gray-200 font-bold transition-colors"
          >
            +
          </button>
        </div>

        <button
          onClick={tambahKeKeranjang}
          className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-6 py-3 rounded-2xl text-xs font-extrabold shadow-md shadow-red-200 transition-all hover:-translate-y-0.5"
        >
          + Keranjang
        </button>
      </div>

      {pesan && (
        <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2 rounded-xl text-center">
          {pesan}
        </p>
      )}
    </div>
  );
}