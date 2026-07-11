import { z } from 'zod';

const phoneRe = /^[+()\-\s\d]{10,20}$/;

export const leadSchema = z.object({
  name: z.string().min(2, 'Укажите имя'),
  phone: z
    .string()
    .min(10, 'Укажите телефон')
    .regex(phoneRe, 'Проверьте номер телефона'),
  email: z
    .string()
    .email('Проверьте адрес почты')
    .optional()
    .or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  sport: z.string().min(1, 'Выберите вид спорта'),
  quantity: z.string().min(1, 'Укажите количество'),
  comment: z.string().max(1000).optional().or(z.literal('')),
  logo: z.string().nullable().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо согласие на обработку данных' }),
  }),
  // контекст (не показывается пользователю)
  landing: z.string().optional(),
  studio: z.unknown().optional(),
  utm: z.record(z.string()).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
