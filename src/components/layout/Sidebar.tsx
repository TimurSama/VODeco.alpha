'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, User, Wallet, LayoutDashboard, Newspaper, Briefcase, MessageCircle, Users, UserPlus, Settings, Globe, BookOpen, Target, Map } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { useSwipe } from '@/hooks/useSwipe';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (isOpen) onClose();
    },
  });

  const menuGroups = [
    {
      title: t('menu.main'),
      items: [
        { icon: LayoutDashboard, label: t('menu.dashboard'), href: '/dashboard' },
        { icon: Globe, label: t('menu.overview'), href: '/overview' },
        { icon: BookOpen, label: t('menu.whitepaper'), href: '/whitepaper' },
        { icon: Map, label: 'Roadmap', href: '/roadmap' },
      ],
    },
    {
      title: t('menu.profile'),
      items: [
        { icon: User, label: t('menu.profile'), href: '/profile' },
        { icon: Wallet, label: t('menu.wallet'), href: '/wallet' },
      ],
    },
    {
      title: t('menu.content'),
      items: [
        { icon: Newspaper, label: t('menu.news'), href: '/news' },
        { icon: Briefcase, label: t('menu.projects'), href: '/projects' },
        { icon: Target, label: 'Missions', href: '/missions' },
        { icon: BookOpen, label: 'Library', href: '/library' },
      ],
    },
    {
      title: t('menu.social'),
      items: [
        { icon: MessageCircle, label: t('menu.chats'), href: '/chats' },
        { icon: Users, label: t('menu.friends'), href: '/friends' },
        { icon: UserPlus, label: t('menu.groups'), href: '/groups' },
      ],
    },
    {
      title: t('menu.settings'),
      items: [
        { icon: Settings, label: t('menu.settings'), href: '/settings' },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={onClose}
            />
            <motion.aside
              {...swipeHandlers}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-ocean-mid border-r border-white/10 z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-black text-cyan-glow uppercase tracking-wider">
                  {t('menu.main')}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 neo-button rounded-xl active:scale-95 transition-all"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {menuGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-2">
                    <h3 className="text-xs text-slate-500 uppercase tracking-widest font-bold px-2 mb-2">
                      {group.title}
                    </h3>
                    {group.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link
                          key={itemIndex}
                          href={item.href}
                          onClick={onClose}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                            ${isActive 
                              ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30' 
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }
                            active:scale-95
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-semibold">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-white/10">
                <div className="text-xs text-slate-500 text-center">
                  <p className="font-semibold">VODeco MVP</p>
                  <p className="text-[10px] mt-1">v0.1.0</p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
