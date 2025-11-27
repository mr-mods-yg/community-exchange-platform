import Navbar from "@/components/custom/navbar";

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>
      {children}
    </div>
  );
}
