/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function RiwayatPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [riwayatList, setRiwayatList] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    try {
      const g = globalThis as unknown as Record<string, any>;
      const stored = g.localStorage?.getItem("riwayat");
      const parsed = stored ? JSON.parse(stored) : [];
      setRiwayatList(Array.isArray(parsed) ? parsed : []);
    } catch {
      setRiwayatList([]);
    }
  }, []);

  const hapusRiwayat = () => {
    const g = globalThis as unknown as Record<string, any>;
    if (g.confirm && g.confirm("Apakah Anda yakin ingin menghapus semua riwayat pesanan?")) {
      try {
        g.localStorage?.removeItem("riwayat");
        setRiwayatList([]);
      } catch {
        // Abaikan
      }
    }
  };

  if (!isMounted) {
    return <div className="text-center py-20 text-gray-400">Memuat riwayat...</div>;
  }

  if (riwayatList.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="text-5xl">📋</div>
        <h1 className="text-xl font-bold text-gray-800">Belum Ada Riwayat Pesanan</h1>
        <p className="text-gray-500 text-xs">Pesanan yang kamu checkout akan tercatat otomatis di sini.</p>
        <div>
          <Link href="/menu" className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-200">
            Mulai Belanja Sekarang
          </Link>
        </div>
      </div>
    );
  }

  const totalBelanjaSemua = riwayatList.reduce((acc, pesanan) => acc + (pesanan.total || 0), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Riwayat Pesanan</h1>
          <p className="text-xs text-gray-500">Daftar transaksi yang pernah kamu buat</p>
        </div>
        <button
          onClick={hapusRiwayat}
          className="bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors"
        >
          🗑️ Hapus Riwayat
        </button>
      </div>

      {/* Card Ringkasan Total */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 rounded-2xl text-white shadow-md shadow-orange-100 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-amber-100 uppercase tracking-wider">Ringkasan Transaksi</p>
          <p className="text-lg font-bold">{riwayatList.length} Pesanan Berhasil</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-amber-100">Total Pengeluaran</p>
          <p className="text-xl font-black">Rp {totalBelanjaSemua.toLocaleString("id-ID")}</p>
        </div>
      </div>

      {/* List Struk Pesanan */}
      <div className="space-y-4">
        {riwayatList.map((pesanan: any, idx: number) => (
          <div key={pesanan.id || idx} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-orange-100 text-orange-700 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                  #{idx + 1}
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {pesanan.namaPemesan ? pesanan.namaPemesan : "Pemesan"}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">
                🕒 {pesanan.waktu}
              </span>
            </div>

            {/* List Items */}
            <div className="space-y-2">
              {pesanan.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">
                    {item.nama} <strong className="text-orange-600">x{item.jumlah || 1}</strong>
                  </span>
                  <span className="text-gray-900 font-semibold">
                    Rp {((item.harga || 0) * (item.jumlah || 1)).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Total */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pembayaran</span>
              <span className="text-base font-black text-orange-600">
                Rp {(pesanan.total || 0).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}