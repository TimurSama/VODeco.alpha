'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function SettingsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    news: true,
  });

  const settingsSections = [
    {
      title: t('settings.profile'),
      icon: User,
      items: [
        { label: t('settings.editProfile'), action: () => {} },
        { label: t('settings.changePassword'), action: () => {} },
        { label: t('settings.deleteAccount'), action: () => {}, danger: true },
      ],
    },
    {
      title: t('settings.notifications'),
      icon: Bell,
      items: [
        {
          label: t('settings.emailNotifications'),
          type: 'toggle',
          value: notifications.email,
          onChange: (val: boolean) => setNotifications({ ...notifications, email: val }),
        },
        {
          label: t('settings.pushNotifications'),
          type: 'toggle',
          value: notifications.push,
          onChange: (val: boolean) => setNotifications({ ...notifications, push: val }),
        },
        {
          label: t('settings.newsUpdates'),
          type: 'toggle',
          value: notifications.news,
          onChange: (val: boolean) => setNotifications({ ...notifications, news: val }),
        },
      ],
    },
    {
      title: t('settings.privacy'),
      icon: Shield,
      items: [
        { label: t('settings.privacySettings'), action: () => {} },
        { label: t('settings.dataExport'), action: () => {} },
        { label: t('settings.blockedUsers'), action: () => {} },
      ],
    },
    {
      title: t('settings.language'),
      icon: Globe,
      items: [
        { label: t('settings.selectLanguage'), action: () => {} },
        { label: t('settings.region'), action: () => {} },
      ],
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
          {t('menu.settings')}
        </motion.h1>

        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="glass-card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-6 h-6 text-neon-cyan" />
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`flex items-center justify-between p-4 glass rounded-lg ${
                        item.danger ? 'hover:bg-red-500/10' : 'hover:bg-white/10'
                      } transition-colors`}
                    >
                      <span className={item.danger ? 'text-red-400' : ''}>
                        {item.label}
                      </span>
                      {item.type === 'toggle' ? (
                        <button
                          onClick={() => item.onChange?.(!item.value)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            item.value ? 'bg-neon-cyan' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      ) : (
                        <button onClick={item.action}>
                          <ArrowRight className="w-5 h-5 text-white/60" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
