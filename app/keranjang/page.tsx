/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function KeranjangPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [keranjang, setKeranjang] = useState<any[]>([]);
  const [namaPemesanan, setNamaPemesanan] = useState("");
  const [tipePengambilan, setTipePengambilan] = useState("AMBIL");
  const [kodePromo, setKodePromo] = useState("");
  const [diskon, setDiskon] = useState(0);
  const [infoDiskon, setInfoDiskon] = useState("");
  const [strukData, setStrukData] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    muatKeranjang();
  }, []);

  const muatKeranjang = () => {
    try {
      const g = globalThis as unknown as Record<string, any>;
      const stored = g.localStorage ? g.localStorage.getItem("keranjang") : null;
      const data = stored ? JSON.parse(stored) : [];
      setKeranjang(data);
    } catch {
      setKeranjang([]);
    }
  };

  const updateJumlah = (id: any, delta: number) => {
    try {
      const updated = keranjang.map((item: any) => {
        if (String(item.id) === String(id)) {
          const newQty = (item.jumlah || item.qty || 1) + delta;
          return { ...item, jumlah: newQty > 0 ? newQty : 1, qty: newQty > 0 ? newQty : 1 };
        }
        return item;
      });
      setKeranjang(updated);
      const g = globalThis as unknown as Record<string, any>;
      if (g.localStorage) {
        g.localStorage.setItem("keranjang", JSON.stringify(updated));
      }
    } catch {
      // Abaikan
    }
  };

  const hapusItem = (id: any) => {
    try {
      const updated = keranjang.filter((item: any) => String(item.id) !== String(id));
      setKeranjang(updated);
      const g = globalThis as unknown as Record<string, any>;
      if (g.localStorage) {
        g.localStorage.setItem("keranjang", JSON.stringify(updated));
      }
    } catch {
      // Abaikan
    }
  };

  const subtotal = keranjang.reduce((acc, item) => {
    const harga = item.harga || item.price || 0;
    const jumlah = item.jumlah || item.qty || 1;
    return acc + harga * jumlah;
  }, 0);

  const applyPromo = () => {
    if (kodePromo.toUpperCase() === "KANTINKU50") {
      const potongan = subtotal * 0.5;
      setDiskon(potongan);
      setInfoDiskon("Diskon 50% Berhasil Digunakan!");
    } else if (kodePromo.toUpperCase() === "HEMAT10") {
      const potongan = 10000;
      setDiskon(potongan > subtotal ? subtotal : potongan);
      setInfoDiskon("Potongan Rp 10.000 Berhasil Digunakan!");
    } else {
      setDiskon(0);
      setInfoDiskon("Kode promo tidak valid!");
    }
  };

  const totalHarga = subtotal - diskon > 0 ? subtotal - diskon : 0;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (keranjang.length === 0) return;

    const transaksiBaru = {
      id: "TRX-" + Date.now(),
      waktu: new Date().toLocaleString("id-ID"),
      nama: namaPemesanan || "Pelanggan KantinKu",
      pengambilan: tipePengambilan,
      items: [...keranjang],
      subtotal: subtotal,
      diskon: diskon,
      total: totalHarga,
    };

    try {
      const g = globalThis as unknown as Record<string, any>;
      if (g.localStorage) {
        const storedRiwayat = g.localStorage.getItem("riwayat");
        const riwayatList = storedRiwayat ? JSON.parse(storedRiwayat) : [];
        riwayatList.unshift(transaksiBaru);
        g.localStorage.setItem("riwayat", JSON.stringify(riwayatList));

        g.localStorage.removeItem("keranjang");
      }
    } catch {
      // Abaikan
    }

    setStrukData(transaksiBaru);
    setKeranjang([]);
  };

  const handleBeliLagi = () => {
    try {
      const g = globalThis as unknown as Record<string, any>;
      if (g.localStorage) {
        g.localStorage.removeItem("keranjang");
      }
      if (g.location) {
        g.location.href = "/menu";
      }
    } catch {
      // Abaikan
    }
    setStrukData(null);
    setKeranjang([]);
  };

  if (!isMounted) {
    return <div className="text-center py-20 text-gray-400">Memuat keranjang...</div>;
  }

  if (strukData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-100 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-red-600"></div>
          
          <div className="text-center space-y-2">
            <span className="text-3xl">🎉</span>
            <h1 className="text-2xl font-black text-gray-900">Pesanan Berhasil!</h1>
            <p className="text-xs font-bold text-red-600 bg-red-50 inline-block px-3 py-1 rounded-full">
              KantinKu - Bukti Pembayaran
            </p>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Waktu Transaksi</span>
              <span className="font-bold text-gray-800">{strukData.waktu}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Nama Pemesan</span>
              <span className="font-bold text-gray-800">{strukData.nama}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Pengambilan</span>
              <span className="font-bold text-gray-800">{strukData.pengambilan}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item Pesanan</p>
            {strukData.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-gray-900">{item.nama || item.name}</p>
                  <p className="text-gray-400">x{item.jumlah || item.qty || 1}</p>
                </div>
                <span className="font-bold text-gray-900">
                  Rp {((item.harga || item.price || 0) * (item.jumlah || item.qty || 1)).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {strukData.subtotal.toLocaleString("id-ID")}</span>
            </div>
            {strukData.diskon > 0 && (
              <div className="flex justify-between text-red-600 font-bold">
                <span>Diskon Promo</span>
                <span>- Rp {strukData.diskon.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-sm font-black text-gray-900">Total Bayar</span>
              <span className="text-xl font-black text-red-600">Rp {strukData.total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBeliLagi}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-2xl text-xs font-bold transition-all text-center cursor-pointer"
            >
              Beli Lagi
            </button>
            <Link
              href="/riwayat"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl text-xs font-bold transition-all text-center shadow-md shadow-red-200"
            >
              Cek Riwayat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Keranjang Belanja</h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">Periksa kembali pesananmu sebelum melanjutkan pembayaran.</p>
      </div>

      {keranjang.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-4 shadow-xl shadow-gray-100">
          <p className="text-base font-bold text-gray-800">Keranjang kamu masih kosong</p>
          <p className="text-xs text-gray-400">Yuk, pilih menu favoritmu di katalog sekarang!</p>
          <Link href="/menu" className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-red-200">
            Lihat Katalog Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {keranjang.map((item: any) => {
              const qty = item.jumlah || item.qty || 1;
              const harga = item.harga || item.price || 0;
              return (
                <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-gray-900">{item.nama || item.name}</h3>
                    <p className="text-xs font-bold text-red-600">Rp {harga.toLocaleString("id-ID")}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateJumlah(item.id, -1)}
                        className="px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-gray-800">{qty}</span>
                      <button
                        onClick={() => updateJumlah(item.id, 1)}
                        className="px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => hapusItem(item.id)}
                      className="text-gray-400 hover:text-red-600 text-sm p-1 transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-100 space-y-6 h-fit">
            <h2 className="text-base font-black text-gray-900">Ringkasan Pesanan</h2>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Nama Pemesan</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama kamu..."
                  value={namaPemesanan}
                  onChange={(e: any) => setNamaPemesanan(e.target.value)}
                  className="w-full px-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Tipe Pengambilan</label>
                <select
                  value={tipePengambilan}
                  onChange={(e: any) => setTipePengambilan(e.target.value)}
                  className="w-full px-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-bold text-gray-700 cursor-pointer"
                >
                  <option value="AMBIL">Ambil di Kantin</option>
                  <option value="DELIVERY">Antar ke Meja / Kelas</option>
                </select>
              </div>

              {/* Bagian Kode Promo / Diskon */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-700">Kode Promo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cth: KANTINKU50"
                    value={kodePromo}
                    onChange={(e: any) => setKodePromo(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 uppercase"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Gunakan
                  </button>
                </div>
                {infoDiskon && (
                  <p className={`text-[10px] font-bold ${diskon > 0 ? "text-green-600" : "text-red-500"}`}>
                    {infoDiskon}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                {diskon > 0 && (
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Diskon</span>
                    <span>- Rp {diskon.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm font-black text-gray-900">Total Harga</span>
                  <span className="text-base font-black text-red-600">Rp {totalHarga.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl text-xs font-bold transition-all shadow-md shadow-red-200 cursor-pointer"
              >
                Bayar Sekarang
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}