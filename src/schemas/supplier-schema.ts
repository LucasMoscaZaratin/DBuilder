import { z } from 'zod';

const supplierSchema = z.object({
  id: z.number().int(), // id é um inteiro autoincrementado
  name: z.string().min(1, 'Nome é obrigatório'),
  contact: z.string().optional(),
  email: z.string().email('E-mail inválido').nullable(),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zip_code: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  cnpj: z.string().optional().nullable(),
  document_id: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date(),
});

export default supplierSchema;
