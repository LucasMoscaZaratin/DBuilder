import { z } from 'zod';
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }).regex(passwordRegex, {
    message: 'A senha deve conter letras e números',
  }),
});

export default loginSchema;
