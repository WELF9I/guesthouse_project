"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { navbarLinks } from "@/constants";
import NavbarMobile from "./NavbarMobile";
import Image from "next/image";
import { useAuth, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
        <Link href="/" className="cursor-pointer flex gap-2">
          <Image src="/logo.svg" width={30} height={30} alt="logo" />
          <div className="text-xl font-bold">VillaAcapella</div>
        </Link>
        {!isMobile && (
          <>
            <div className="hidden md:flex space-x-4">
              {navbarLinks.map((item) => {
                const isActive =
                  pathname === item.route ||
                  pathname.startsWith(`${item.route}/`);
                const isBookLink = item.label === "Book";
                return (
                  <Link
                    href={item.route}
                    key={item.label}
                    className={`hover:text-gray-400 px-3 py-2 rounded flex items-center space-x-2  ${
                      isActive ? "bg-slate-600" : ""
                    } ${
                      isBookLink && !isSignedIn
                        ? "pointer-events-none  opacity-50"
                        : ""
                    }`}
                  >
                    <Image
                      src={item.imgURL}
                      width={24}
                      height={24}
                      className="max-xl:w-5 max-xl:h-5"
                      alt={`${item.label} icon`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link href="/dashboard" className="cursor-pointer flex gap-2">
                <Button className="hidden md:block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
                  Book now
                </Button>
              </Link>
            )}
          </>
        )}
        {isMobile && <NavbarMobile />}
      </nav>
    </div>
  );
};

export default Navbar;