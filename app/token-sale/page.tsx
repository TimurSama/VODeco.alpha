'use client';

import { useEffect, useState } from 'react';
import { Coins, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

export default function TokenSalePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    walletAddress: '',
    preferredNetwork: 'TON',
    amount: '',
    currency: 'VOD',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    trackEvent('token_sale_view');
  }, []);

  const isValidEmail = (value: string) => value.includes('@') && value.includes('.');

  const submit = async () => {
    trackEvent('token_sale_submit_click', {
      network: form.preferredNetwork,
      currency: form.currency,
    });
    if (!form.name || !form.email || !form.amount) {
      setError('Заполните обязательные поля.');
      trackEvent('token_sale_validation_error', { reason: 'required_fields' });
      return;
    }
    if (!isValidEmail(form.email)) {
      setError('Укажите корректный email.');
      trackEvent('token_sale_validation_error', { reason: 'invalid_email' });
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/token-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to submit');
      setSuccess(true);
      trackEvent('token_purchase_request', {
        network: form.preferredNetwork,
        currency: form.currency,
      });
      setForm({
        name: '',
        email: '',
        walletAddress: '',
        preferredNetwork: 'TON',
        amount: '',
        currency: 'VOD',
        message: '',
      });
    } catch (e: any) {
      setError(e?.message || 'Ошибка отправки формы');
      trackEvent('token_sale_submit_error');
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
            <div className="w-12 h-12 rounded-xl bg-cyan-glow/20 flex items-center justify-center">
              <Coins className="w-6 h-6 text-cyan-glow" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Покупка VOD credits</h1>
              <p className="text-slate-400 text-sm">
                Предзапрос на покупку для участия в миссиях и проектах.
              </p>
            </div>
          </div>
          <div className="text-sm text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            VOD credits — внутренняя валюта MVP. WTR эмитируется после верификации IoT‑данных.
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
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Сеть</label>
              <select
                value={form.preferredNetwork}
                onChange={(e) => onChange('preferredNetwork', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white bg-transparent"
              >
                <option value="TON">TON</option>
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Кошелёк (необязательно)</label>
              <input
                value={form.walletAddress}
                onChange={(e) => onChange('walletAddress', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="Адрес кошелька"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Сумма</label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.amount}
                onChange={(e) => onChange('amount', e.target.value)}
                required
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="Например, 1000"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Валюта</label>
              <select
                value={form.currency}
                onChange={(e) => onChange('currency', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white bg-transparent"
              >
                <option value="VOD">VOD credits</option>
                <option value="USD">USD (эквивалент)</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-400 uppercase">Комментарий</label>
            <textarea
              value={form.message}
              onChange={(e) => onChange('message', e.target.value)}
              className="w-full mt-2 px-3 py-2 glass rounded-lg text-white min-h-[120px]"
              placeholder="Уточнения, сроки, предпочтения"
            />
          </div>

          {error && <div className="text-rose-300 text-sm mb-2">{error}</div>}
          {success && <div className="text-emerald-300 text-sm mb-2">Запрос отправлен.</div>}

          <button
            onClick={submit}
            disabled={loading || !form.name || !form.email || !form.amount}
            className="px-4 py-2 bg-cyan-glow text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Отправка…' : 'Отправить запрос'}
          </button>
        </div>
      </div>
    </div>
  );
}

