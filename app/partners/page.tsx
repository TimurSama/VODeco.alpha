'use client';

import { useEffect, useState } from 'react';
import { Handshake } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

export default function PartnersPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    website: '',
    country: '',
    partnershipType: '',
    projectFocus: '',
    budgetRange: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    trackEvent('partner_application_view');
  }, []);

  const isValidEmail = (value: string) => value.includes('@') && value.includes('.');

  const submit = async () => {
    trackEvent('partner_application_submit_click', { partnershipType: form.partnershipType || 'unknown' });
    if (!form.name || !form.email || !form.organization || !form.partnershipType) {
      setError('Заполните обязательные поля.');
      trackEvent('partner_application_validation_error', { reason: 'required_fields' });
      return;
    }
    if (!isValidEmail(form.email)) {
      setError('Укажите корректный email.');
      trackEvent('partner_application_validation_error', { reason: 'invalid_email' });
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to submit');
      setSuccess(true);
      trackEvent('partner_application_submit', { partnershipType: form.partnershipType });
      setForm({
        name: '',
        email: '',
        organization: '',
        role: '',
        website: '',
        country: '',
        partnershipType: '',
        projectFocus: '',
        budgetRange: '',
        message: '',
      });
    } catch (e: any) {
      setError(e?.message || 'Ошибка отправки формы');
      trackEvent('partner_application_submit_error');
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
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Handshake className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Партнёрские заявки</h1>
              <p className="text-slate-400 text-sm">
                НКО, компании, научные центры, государственные структуры и экопроекты.
              </p>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            Опишите направление сотрудничества, мы свяжемся в ближайшие дни.
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
                placeholder="you@company.org"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Организация</label>
              <input
                value={form.organization}
                onChange={(e) => onChange('organization', e.target.value)}
                required
                autoComplete="organization"
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="Название организации"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Роль</label>
              <input
                value={form.role}
                onChange={(e) => onChange('role', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="Должность / роль"
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
              <label className="text-xs text-slate-400 uppercase">Тип партнёрства</label>
              <select
                value={form.partnershipType}
                onChange={(e) => onChange('partnershipType', e.target.value)}
                required
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white bg-transparent"
              >
                <option value="">Выберите</option>
                <option value="data">Данные и исследования</option>
                <option value="infrastructure">Инфраструктура / IoT</option>
                <option value="education">Образование и просвещение</option>
                <option value="grant">Гранты / фонды</option>
                <option value="government">Гос‑программы</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Фокус проекта</label>
              <input
                value={form.projectFocus}
                onChange={(e) => onChange('projectFocus', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="Кратко о направлении"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase">Бюджет / ресурсы</label>
              <input
                value={form.budgetRange}
                onChange={(e) => onChange('budgetRange', e.target.value)}
                className="w-full mt-2 px-3 py-2 glass rounded-lg text-white"
                placeholder="Диапазон или формат"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-400 uppercase">Сообщение</label>
            <textarea
              value={form.message}
              onChange={(e) => onChange('message', e.target.value)}
              className="w-full mt-2 px-3 py-2 glass rounded-lg text-white min-h-[120px]"
              placeholder="Кратко опишите идею и ожидания"
            />
          </div>

          {error && <div className="text-rose-300 text-sm mb-2">{error}</div>}
          {success && <div className="text-emerald-300 text-sm mb-2">Заявка отправлена.</div>}

          <button
            onClick={submit}
            disabled={loading || !form.name || !form.email || !form.organization || !form.partnershipType}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Отправка…' : 'Отправить заявку'}
          </button>
        </div>
      </div>
    </div>
  );
}

