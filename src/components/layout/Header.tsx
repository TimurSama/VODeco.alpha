'use client';

import { useState, useEffect } from 'react';
import { Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import Sidebar from './Sidebar';

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Swipe from left edge to open menu (like Telegram)
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Swipe from left edge (within 20px) to right opens menu
      if (touchStartX < 20 && deltaX > 50 && Math.abs(deltaY) < Math.abs(deltaX)) {
        if (!sidebarOpen) setSidebarOpen(true);
      }
      
      touchStartX = 0;
      touchStartY = 0;
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sidebarOpen]);

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Burger Menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 neo-button rounded-xl active:scale-95 transition-all"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-cyan-glow" />
          </button>

          {/* Logo - Centered */}
          <Link href="/dashboard" className="flex items-center justify-center flex-1 lg:flex-none">
            <Logo />
          </Link>

          {/* Right Side - Search and Language */}
          <div className="flex items-center gap-2">
            <button
              className="p-2.5 neo-button rounded-xl active:scale-95 transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-cyan-glow" />
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </motion.header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
