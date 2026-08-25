'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Search, List, PlusCircle, Home } from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
  { href: '/', label: '首页', icon: Home },
  { href: '/browse', label: '数据浏览', icon: List },
  { href: '/search', label: '数据查询', icon: Search },
  { href: '/add', label: '录入数据', icon: PlusCircle },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-plant-green-700 font-bold text-lg">
            <Leaf className="w-6 h-6" />
            <span className="hidden sm:inline">自生植物数据库</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-plant-green-100 text-plant-green-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-plant-green-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
