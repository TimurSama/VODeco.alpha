'use client';

import { useEffect, useState } from 'react';
import { Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

export default function InvestorsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    fund: '',
    role: '',
    website: '',
    country: '',
    ticketSize: '',
    stageFocus: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    trackEvent('investor_inquiry_view');
  }, []);

  const isValidEmail = (value: string) => value.includes('@') && value.includes('.');

  const submit = async () => {
    trackEvent('investor_inquiry_submit_click', { stageFocus: form.stageFocus || 'unknown' });
    if (!form.name || !form.email) {
      setError('Заполните обязательные поля.');
      trackEvent('investor_inquiry_validation_error', { reason: 'required_fields' });
      return;
    }
    if (!isValidEmail(form.email)) {
      setError('Укажите корректный email.');
      trackEvent('investor_inquiry_validation_error', { reason: 'invalid_email' });
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/investors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to submit');
      setSuccess(true);
      trackEvent('investor_inquiry_submit', { stageFocus: form.stageFocus });
      setForm({
        name: '',
        email: '',
        fund: '',
        role: '',
        website: '',
        country: '',
        ticketSize: '',
        stageFocus: '',
        message: '',
      });
    } catch (e: any) {
      setError(e?.message || 'Ошибка отправки формы');
      trackEvent('investor_inquiry_submit_error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gold-glow/20 flex items-center justify-center">
              <Banknote className="w-6 h-6 text-gold-glow" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Инвесторам</h1>
              <p className="text-slate-400 text-sm">
                Инфраструктура, data‑mint, W_m3‑индекс и мультисекторные экосистемы.
              </p>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            Заполните форму — пришлём материалы и назначим созвон.
          </div>
        </motion.div>

        <div className="glass-card p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-slate-400 uppercase">Имя</label>
              <input
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                required
                autoComplete="name"
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="Ваше имя"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => onChange('email', e.target.value)}
                required
                autoComplete="email"
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="you@fund.com"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Фонд / компания</label>
              <input
                value={form.fund}
                onChange={(e) => onChange('fund', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="Название фонда"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Роль</label>
              <input
                value={form.role}
                onChange={(e) => onChange('role', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="Позиция"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Сайт</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => onChange('website', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Страна</label>
              <input
                value={form.country}
                onChange={(e) => onChange('country', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="Страна"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-slate-400 uppercase">Ticket size</label>
              <input
                value={form.ticketSize}
                onChange={(e) => onChange('ticketSize', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="Диапазон, например $50k–$250k"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Фокус стадии</label>
              <select
                value={form.stageFocus}
                onChange={(e) => onChange('stageFocus', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white bg-transparent"
              >
                <option value="">Выберите</option>
                <option value="pre-seed">Pre‑seed / концепт</option>
                <option value="seed">Seed / MVP</option>
                <option value="growth">Growth</option>
                <option value="strategic">Стратегический партнёр</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-400 uppercase">Комментарий</label>
            <textarea
              value={form.message}
              onChange={(e) => onChange('message', e.target.value)}
              className="w-full mt-2 px-3 py-2 glass rounded-lg text-white min-h-[120px]"
              placeholder="Интересы, требования, формат взаимодействия"
            />
          </div>

          {error && <div className="text-rose-300 text-sm mb-2">{error}</div>}
          {success && <div className="text-emerald-300 text-sm mb-2">Заявка отправлена.</div>}

          <button
            onClick={submit}
            disabled={loading || !form.name || !form.email}
            className="px-4 py-2 bg-gold-glow text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Отправка…' : 'Отправить заявку'}
          </button>
        </div>
      </div>
    </div>
  );
}

