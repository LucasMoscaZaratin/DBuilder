import { z } from 'zod';

const profileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  document_id: z.string(),
  rg: z.string().optional(),
  ie: z.string().optional(),
  state_registration: z.string().optional(),
  birth_date: z.coerce.date().optional(),
  gender: z.string().optional(),
  marital_status: z.string().optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  fantasy_name: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string(),
  address_number: z.string(),
  complement: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip_code: z.string(),
  country: z.string(),
  phone_number: z.string(),
  notes: z.string().optional(),
  role: z.enum(['ADMIN', 'GERENTE', 'CLIENTE', 'FUNCIONARIO', 'ENGENHEIRO']),
});
export default profileSchema;
