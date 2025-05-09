import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import loginSchema from '../schemas/login-schema';

const prisma = new PrismaClient();

const loginRoute = async (app: FastifyInstance) => {
  app.post('/login', async (request, reply) => {
    const parseResult = loginSchema.safeParse(request.body);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0];
      return reply.status(400).send({ message: firstError.message });
    }

    const { email, password } = parseResult.data;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(401).send({ message: 'Credenciais inválidas.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return reply.status(401).send({ message: 'Credenciais inválidas.' });
      }

      return reply.status(200).send({ message: 'Login realizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return reply.status(500).send({ message: 'Erro interno ao realizar login.' });
    }
  });
};

export default loginRoute;
