import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  contact: z.string().min(1, 'Contato é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  zip_code: z.string().min(5, 'CEP é obrigatório'),
  country: z.string().min(1, 'País é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ é obrigatório'),
});

export default supplierSchema;
