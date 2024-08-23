'use client'

import Image from "next/image"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { navbarLinks } from "@/constants"
import { usePathname } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

const NavbarMobile = () => {
    const pathname = usePathname();
    const { isSignedIn } = useAuth();

    return (
        <section className="w-full max-w-[264px]">
            <Sheet>
                <SheetTrigger className="ml-[190px] mt-2">
                    <Image
                        src="/hamburger.svg"
                        width={30}
                        height={30}
                        alt="menu"
                        className="cursor-pointer"
                    />
                </SheetTrigger>

                <SheetContent side="left" className="border-none bg-slate-100">
                    <Link href="/" className="cursor-pointer flex gap-5 pb-5">
                        <Image src='/logo.svg' width={30} height={30} alt='logo'/>
                        <div className="text-26 font-bold text-black mt-1">VillaAcapella</div>
                    </Link>
                    <div className="mobilenav-sheet">
                        <SheetClose asChild>
                            <nav className="flex h-full flex-col gap-6 pt-16 text-black">
                                {navbarLinks.map((item) => {
                                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                                    const isBookLink = item.label === "Book";
                                    return (
                                        <SheetClose key={item.route} asChild>
                                            <Link 
                                                href={item.route} 
                                                className={cn('mobilenav-sheet_close w-full', {
                                                    'bg-gray-600': isActive,
                                                    'pointer-events-none opacity-50': isBookLink && !isSignedIn
                                                })}
                                            >
                                                <div className="relative size-6">
                                                    <Image
                                                        src={item.imgURL}
                                                        alt={item.label}
                                                        width={20}
                                                        height={20}
                                                        className={cn({'brightness-[3] invert-0': isActive})}
                                                    />
                                                </div>
                                                <p className={cn('text-16 font-semibold text-black-2', {'text-white': isActive})}>
                                                    {item.label}
                                                </p>
                                            </Link>
                                        </SheetClose>
                                    );
                                })}
                            </nav>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default NavbarMobile