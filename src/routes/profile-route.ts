import { PrismaClient, profile_role } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import profileSchema from '../schemas/profile-schema';

const prisma = new PrismaClient();

const profileRoute = async (app: FastifyInstance) => {
  app.post('/profile', async (request, reply) => {
    const result = profileSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    try {
      const data = result.data;

      // Verificando se o 'role' é válido antes de criar o perfil
      if (!Object.values(profile_role).includes(data.role as profile_role)) {
        return reply.status(400).send({ message: 'Role inválido' });
      }

      const profile = await prisma.profile.create({
        data: {
          ...data,
          role: data.role as profile_role,
          updated_at: new Date(),
        },
      });

      return reply.status(201).send(profile);
    } catch (err) {
      console.error('Erro ao criar perfil:', err);
      return reply.status(500).send({ message: 'Erro ao criar o perfil' });
    }
  });

  app.get('/profile', async (request, reply) => {
    const { name } = request.query as { name?: string };

    if (!name) {
      return reply.status(400).send({ message: 'Nome é obrigatório na query' });
    }

    try {
      const profile = await prisma.profile.findFirst({
        where: { name },
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
        },
      });

      if (!profile) {
        return reply.status(404).send({ message: 'Perfil não encontrado' });
      }

      return reply.send(profile);
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
      return reply.status(500).send({ message: 'Erro ao buscar o perfil' });
    }
  });

  app.get('/profile/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
    }

    try {
      const profile = await prisma.profile.findUnique({
        where: { id },
      });

      if (!profile) {
        return reply.status(404).send({ message: 'Perfil não encontrado' });
      }

      return reply.send(profile);
    } catch (err) {
      console.error('Erro ao buscar perfil por ID:', err);
      return reply.status(500).send({ message: 'Erro ao buscar perfil' });
    }
  });

  app.put('/profile/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
    }

    const result = profileSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    try {
      const data = result.data;

      // Verificando se o 'role' é válido antes de atualizar o perfil
      if (!Object.values(profile_role).includes(data.role as profile_role)) {
        return reply.status(400).send({ message: 'Role inválido' });
      }

      const profile = await prisma.profile.update({
        where: { id },
        data: {
          ...data,
          role: data.role as profile_role,
        },
      });

      return reply.status(200).send(profile);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({ message: 'Perfil não encontrado' });
      }

      console.error('Erro ao atualizar perfil:', error);
      return reply.status(500).send({ message: 'Erro ao atualizar perfil' });
    }
  });

  // Método para "deletar" o perfil, alterando is_active para false
  app.delete('/profile/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
    }

    try {
      // Atualizando o campo is_active para false
      const profile = await prisma.profile.update({
        where: { id },
        data: {
          is_active: false, // Desativa o perfil
        },
      });

      return reply.status(200).send({
        message: 'Perfil desativado com sucesso.',
        profile,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({ message: 'Perfil não encontrado' });
      }

      console.error('Erro ao desativar perfil:', error);
      return reply.status(500).send({ message: 'Erro ao desativar perfil' });
    }
  });
};

export default profileRoute;
