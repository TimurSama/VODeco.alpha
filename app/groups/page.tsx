'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function GroupsPage() {
  const { t } = useLanguage();

  // Mock groups
  const groups = [
    {
      id: '1',
      name: 'Water Quality Researchers',
      description: 'Group for water quality research and discussions',
      members: 42,
    },
    {
      id: '2',
      name: 'Central Asia Water Initiative',
      description: 'Regional water resource management',
      members: 128,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold gradient-text"
          >
            {t('menu.groups')}
          </motion.h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-neon-cyan text-white rounded-lg font-semibold hover:bg-neon-cyan/80 transition-colors">
            <Plus className="w-5 h-5" />
            <span>{t('groups.create')}</span>
          </button>
        </div>

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

        {/* Groups List */}
        <div className="grid md:grid-cols-2 gap-4">
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                  <p className="text-sm text-white/70 mb-3">{group.description}</p>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Users className="w-4 h-4" />
                    <span>{group.members} {t('groups.members')}</span>
                  </div>
                </div>
              </div>
              <button className="w-full px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors">
                {t('groups.join')}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
