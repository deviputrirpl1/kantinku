import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full text-red-600 text-xs font-bold tracking-wide">
        🔥 Kantin Digital Modern & Cepat
      </div>

      <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
        Selamat Datang di{" "}
        <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
          KantinKu!
        </span>
      </h1>

      <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
        Pesan makanan dan minuman favoritmu di kantin sekolah dengan mudah, cepat, dan tanpa mengantre.
      </p>

      <div className="pt-4">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold px-8 py-4 rounded-2xl text-base shadow-xl shadow-red-200 hover:shadow-red-300 transition-all hover:-translate-y-0.5"
        >
          <span>Pesan Makanan Sekarang</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}