import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import loginSchema from '../schemas/login-schema';

const prisma = new PrismaClient();

const loginRoute = async (app: FastifyInstance) => {
  app.post('/register', async (request, reply) => {
    const result = loginSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    const { email, password } = result.data;

    const existUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existUser) {
      return reply.status(400).send({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return reply.send({ message: 'Usuário cadastrado com sucesso!', user });
  });

  // Rota para login
  app.post('/login', async (request, reply) => {
    const result = loginSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(400).send({ message: 'Credenciais inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(400).send({ message: 'Credenciais inválidas' });
    }

    return reply.send({ message: 'Login realizado com sucesso!', user });
  });
};

export default loginRoute;
