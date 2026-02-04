'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, UserCheck, UserX } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function FriendsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');

  // Mock friends
  const friends = [
    { id: '1', username: 'water_guardian', name: 'Water Guardian', avatar: null },
    { id: '2', username: 'eco_warrior', name: 'Eco Warrior', avatar: null },
  ];

  const requests = [
    { id: '3', username: 'new_user', name: 'New User', avatar: null },
  ];

  const tabs = [
    { id: 'friends', label: t('friends.tabs.friends'), icon: UserCheck },
    { id: 'requests', label: t('friends.tabs.requests'), icon: UserPlus },
    { id: 'search', label: t('friends.tabs.search'), icon: Search },
  ];

  return (
    <div className="min-h-screen bg-bg-primary p-4">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 gradient-text"
        >
          {t('menu.friends')}
        </motion.h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-neon-cyan text-white'
                    : 'glass hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'friends' && (
          <div className="grid md:grid-cols-2 gap-4">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-xl font-bold">
                    {friend.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{friend.name}</h3>
                    <p className="text-sm text-white/60">@{friend.username}</p>
                  </div>
                  <button className="p-2 glass rounded-lg hover:bg-white/10">
                    <UserX className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                      {request.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{request.name}</h3>
                      <p className="text-sm text-white/60">@{request.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-neon-green text-white rounded-lg font-semibold">
                      {t('friends.accept')}
                    </button>
                    <button className="px-4 py-2 glass rounded-lg hover:bg-white/10">
                      {t('friends.decline')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder={t('friends.searchPlaceholder')}
                className="flex-1 bg-transparent outline-none text-white"
              />
            </div>
            <p className="text-white/60 text-center py-8">{t('friends.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
