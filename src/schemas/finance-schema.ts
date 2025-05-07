import { z } from 'zod';

const financeSchema = z.object({
  id: z.number().int(),
  estimate_cost: z.number(),
  real_cost: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
  projectId: z.number().int(),
});

export default financeSchema;
