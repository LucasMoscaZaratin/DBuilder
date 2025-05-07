import { z } from 'zod';

const profileSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  document_id: z.string().min(14).max(18),
  rg: z.string().min(9).max(12).optional().nullable(),
  ie: z.string().min(9).max(14).optional().nullable(),
  state_registration: z.string().optional().nullable(),
  birth_date: z.date().optional().nullable(),
  gender: z.string().optional().nullable(),
  marital_status: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(), // Corrigido de 'accoupation' para 'occupation'
  company: z.string().optional().nullable(),
  fantasy_name: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  address: z.string().min(1, 'Endereço é obrigatório'),
  address_number: z.string().min(1, 'Número do endereço é obrigatório'),
  complement: z.string().optional().nullable(),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(1, 'Estado é obrigatório'),
  zip_code: z.string().min(1, 'CEP é obrigatório'),
  country: z.string().min(1, 'País é obrigatório'),
  phone_number: z.string().min(1, 'Telefone é obrigatório'),
  notes: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  role: z.string().min(1, 'Cargo é obrigatório'),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date(),
});

export default profileSchema;
