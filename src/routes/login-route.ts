import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; // Carregar variáveis de ambiente
import loginSchema from '../schemas/login-schema';

// Carregar variáveis do arquivo .env
dotenv.config();

const prisma = new PrismaClient();

const loginRoute = async (app: FastifyInstance) => {
  app.post('/register', async (request, reply) => {
    const parseResult = loginSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ message: parseResult.error.errors[0].message });
    }

    const { email, password } = parseResult.data;

    try {
      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return reply.status(409).send({ message: 'Usuário já existe com este e-mail.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return reply.status(201).send({ message: 'Usuário criado com sucesso!', user });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao criar usuário', error });
    }
  });
  app.post('/login', async (request, reply) => {
    const parseResult = loginSchema.safeParse(request.body);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0];
      return reply.status(400).send({ message: firstError.message });
    }

    const { email, password } = parseResult.data;

    try {
      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({ where: { email } });

      // Garantir que o usuário existe e tem a propriedade `id`
      if (!user) {
        return reply.status(401).send({ message: 'Credenciais inválidas.' });
      }

      // Comparar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return reply.status(401).send({ message: 'Credenciais inválidas.' });
      }

      // Gerar o token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email }, // Agora temos certeza de que `user` tem um `id`
        process.env.JWT_SECRET!, // A chave secreta é carregada a partir das variáveis de ambiente
        { expiresIn: '1h' }
      );

      return reply.status(200).send({
        message: 'Login realizado com sucesso!',
        token,
      });
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return reply.status(500).send({ message: 'Erro interno ao realizar login.' });
    }
  });
};

export default loginRoute;
