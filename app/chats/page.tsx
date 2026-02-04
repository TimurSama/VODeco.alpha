'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Search, Send } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function ChatsPage() {
  const { t } = useLanguage();

  // Mock chats
  const chats = [
    {
      id: '1',
      name: 'Water Quality Discussion',
      lastMessage: 'Great progress on the project!',
      timestamp: '2h ago',
      unread: 2,
    },
    {
      id: '2',
      name: 'John Doe',
      lastMessage: 'Thanks for the update',
      timestamp: '5h ago',
      unread: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary p-4">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 gradient-text"
        >
          {t('menu.chats')}
        </motion.h1>

        {/* Search */}
        <div className="glass-card mb-6">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder={t('common.search')}
              className="flex-1 bg-transparent outline-none text-white"
            />
          </div>
        </div>

        {/* Chats List */}
        <div className="space-y-2">
          {chats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{chat.name}</h3>
                    <span className="text-xs text-white/60">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-white/70">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-6 h-6 rounded-full bg-neon-pink flex items-center justify-center text-xs font-bold">
                    {chat.unread}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
