/**
 * Validation schemas using Zod
 * Centralized validation for forms and API inputs
 */

import { z } from 'zod';

// User validation
export const userRoleSchema = z.enum([
  'activist',
  'researcher',
  'engineer',
  'investor',
  'company',
  'ngo',
  'government',
  'institution',
]);

// Post validation
export const postSchema = z.object({
  content: z.string().min(1, 'Содержание не может быть пустым').max(10000, 'Слишком длинное содержание'),
  type: z.enum(['post', 'news', 'research', 'achievement', 'project_card']).default('post'),
  tags: z.array(z.string()).max(10, 'Максимум 10 тегов').optional(),
  attachments: z.array(z.object({
    url: z.string().url('Некорректный URL'),
    type: z.enum(['image', 'video', 'file', 'link']),
    title: z.string().optional(),
  })).max(10, 'Максимум 10 вложений').optional(),
});

// Comment validation
export const commentSchema = z.object({
  content: z.string().min(1, 'Комментарий не может быть пустым').max(2000, 'Слишком длинный комментарий'),
  parentId: z.string().optional(),
});

// Mission submission validation
export const missionSubmissionSchema = z.object({
  content: z.string().min(10, 'Описание должно быть не менее 10 символов').max(5000, 'Слишком длинное описание'),
  attachments: z.array(z.string().url('Некорректный URL')).max(5, 'Максимум 5 вложений').optional(),
});

// Social share validation
export const socialShareSchema = z.object({
  platform: z.enum(['twitter', 'facebook', 'telegram', 'linkedin', 'instagram', 'vk']),
  postUrl: z.string().url('Некорректный URL поста'),
  newsPostId: z.string().optional(),
  // Свободный объект метаданных с строковыми ключами
  metadata: z.record(z.string(), z.any()).optional(),
});

// Partner application validation
export const partnerApplicationSchema = z.object({
  organizationName: z.string().min(2, 'Название организации должно быть не менее 2 символов').max(200),
  contactName: z.string().min(2, 'Имя должно быть не менее 2 символов').max(100),
  email: z.string().email('Некорректный email'),
  phone: z.string().optional(),
  organizationType: z.string().min(1, 'Тип организации обязателен'),
  description: z.string().min(20, 'Описание должно быть не менее 20 символов').max(2000),
  website: z.string().url('Некорректный URL').optional(),
});

// Investor inquiry validation
export const investorInquirySchema = z.object({
  name: z.string().min(2, 'Имя должно быть не менее 2 символов').max(100),
  email: z.string().email('Некорректный email'),
  organization: z.string().optional(),
  investmentAmount: z.string().optional(),
  message: z.string().min(10, 'Сообщение должно быть не менее 10 символов').max(2000),
});

// Token purchase validation
export const tokenPurchaseSchema = z.object({
  name: z.string().min(2, 'Имя должно быть не менее 2 символов').max(100),
  email: z.string().email('Некорректный email'),
  amount: z.string().regex(/^\d+(\.\d{1,18})?$/, 'Некорректная сумма'),
  currency: z.enum(['USD', 'EUR', 'USDT', 'USDC']).default('USD'),
  message: z.string().max(1000, 'Сообщение слишком длинное').optional(),
});

// News submission validation
export const newsSubmissionSchema = z.object({
  title: z.string().min(5, 'Заголовок должен быть не менее 5 символов').max(200),
  content: z.string().min(20, 'Содержание должно быть не менее 20 символов').max(5000),
  sourceUrl: z.string().url('Некорректный URL источника'),
  category: z.enum(['water', 'ecology', 'research', 'technology', 'policy', 'climate']),
  imageUrl: z.string().url('Некорректный URL изображения').optional(),
  tags: z.array(z.string()).max(10, 'Максимум 10 тегов').optional(),
});

// Staking validation
export const stakingSchema = z.object({
  projectId: z.string().min(1, 'ID проекта обязателен'),
  amount: z.string().regex(/^\d+(\.\d{1,18})?$/, 'Некорректная сумма'),
  duration: z.number().int().min(1).max(48, 'Максимальный срок стейкинга 48 месяцев'),
});

// Helper function to format validation errors
export function formatValidationError(error: z.ZodError<any>): string {
  return error.issues.map((issue) => issue.message).join(', ');
}
