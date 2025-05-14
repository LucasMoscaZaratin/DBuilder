// schemas/project-schema.ts
import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, { message: 'Nome do projeto é obrigatório.' }),
  description: z.string().min(1, { message: 'Descrição do projeto é obrigatória.' }),
  budget: z.number().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  completion_percentage: z.number().min(0).max(100).optional(),
});
