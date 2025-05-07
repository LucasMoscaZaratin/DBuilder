import { z } from 'zod';

export const projectStatusEnum = z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']); // ajuste conforme os valores reais

export const projectSchema = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string(),
  initial_date: z.coerce.date(),
  final_date: z.coerce.date().nullable().optional(),
  budget: z.number().nullable(),
  status: projectStatusEnum.default('PLANNED'),
  completion_percentage: z.number().min(0).max(100).default(0),
  created_at: z.coerce.date().default(new Date()),
  updated_at: z.coerce.date(),
});
