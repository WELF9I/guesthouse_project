"use client";
import { FaHome, FaBed, FaSignOutAlt, FaBars, FaCog } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';

interface MenuBarProps {
  onLogout: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onLogout }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (path:any) => pathname === path;

  const MenuItems = () => (
    <>
      <Link 
        href="/admin/admin-dashboard" 
        className={`flex items-center px-4 py-2 text-gray-700 ${isActive('/admin/admin-dashboard') ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'}`}
      >
        <FaHome className="mr-2" />
        Dashboard
      </Link>
      <Link 
        href="/admin/admin-dashboard/cabins" 
        className={`flex items-center px-4 py-2 text-gray-700 ${isActive('/admin/admin-dashboard/cabins') ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'}`}
      >
        <FaBed className="mr-2" />
        Cabins
      </Link>

      <Link 
      href="/admin/admin-dashboard/admin-settings"
      className={`flex items-center px-4 py-2 text-gray-700 ${isActive('/admin/admin-dashboard/admin-settings') ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'}`}
    >
      <FaCog className="mr-2" />
      Settings
    </Link>

    <button 
        onClick={onLogout}
        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <FaSignOutAlt className="mr-2" />
        Logout
      </button>
    </>
  );

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Sidebar for larger screens */}
      <div className="hidden sm:flex flex-col w-64 bg-white shadow-md min-h-screen">
        <h2 className="text-2xl font-semibold text-center p-4">Admin</h2>
        <nav className="mt-4">
          <MenuItems />
        </nav>
      </div>

      {/* Sheet component for smaller screens */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
            <button className="p-4 text-gray-700 hover:text-gray-900">
              <FaBars className="text-2xl" />
            </button>
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-center">Admin</h2>
            </div>
            <nav className="mt-4 flex-grow">
              <MenuItems />
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
export default MenuBar;