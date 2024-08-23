"use client"
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  const showNavbar = pathname !== "admin/admin-dashboard";

  return (
    <div>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "pt-16" : ""}>
        <Hero />
      </div>
    </div>
  );
}