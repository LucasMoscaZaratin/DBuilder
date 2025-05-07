import { z } from 'zod';

export const projectSupplierSchema = z.object({
  projectId: z.number().int(),
  supplierId: z.number().int(),
});

export const projectSupplierParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});
