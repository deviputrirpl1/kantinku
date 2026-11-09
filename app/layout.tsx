import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "KantinKu - Kantin Digital",
  description: "Pesan makanan kantin dengan mudah dan cepat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-gray-800 antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}