import Navbar from "@/components/custom/navbar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-black text-white">
      <Navbar/>
      {children}
    </div>
  );
}
