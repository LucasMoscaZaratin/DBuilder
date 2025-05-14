import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import TeamSchema from '../schemas/team-schema';

const prisma = new PrismaClient();

const teamRoute = async (app: FastifyInstance) => {
  // Criar equipe
  app.post('/teams', async (request, reply) => {
    const result = TeamSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    try {
      const data = result.data;

      const team = await prisma.team.create({
        data: {
          function: data.function,
          projectId: data.projectId,
          role: data.role,
          created_at: new Date(),
          teamMembers: {
            connect: data.teamMembers.map((id: number) => ({ id })),
          },
        },
        include: {
          teamMembers: true, // Opcional: retorna os perfis junto com a equipe
        },
      });

      return reply.status(201).send({ message: 'Equipe criada com sucesso!', team });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao criar equipe:', error.message);
        return reply.status(500).send({ message: 'Erro ao criar equipe', error: error.message });
      } else {
        console.error('Erro desconhecido ao criar equipe:', error);
        return reply.status(500).send({ message: 'Erro interno ao criar equipe' });
      }
    }
  });

  // Buscar equipe por ID
  app.get('/teams/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    // Validando o ID
    if (isNaN(id) || id <= 0) {
      return reply.status(400).send({ message: 'ID inválido. Deve ser um número positivo.' });
    }

    try {
      const team = await prisma.team.findUnique({
        where: { id },
      });

      if (!team) {
        return reply.status(404).send({ message: 'Equipe não encontrada' });
      }
      return reply.status(200).send({ team });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar equipe:', error.message);
        return reply.status(500).send({ message: 'Erro ao buscar equipe', error: error.message });
      } else {
        console.error('Erro desconhecido ao buscar equipe:', error);
        return reply.status(500).send({ message: 'Erro interno ao buscar equipe' });
      }
    }
  });

  // Deletar equipe
  app.delete('/teams/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    // Validando o ID
    if (isNaN(id) || id <= 0) {
      return reply.status(400).send({ message: 'ID inválido. Deve ser um número positivo.' });
    }

    try {
      const team = await prisma.team.update({
        where: { id },
        data: { role: 'INACTIVE' },
      });

      if (!team) {
        return reply.status(404).send({ message: 'Equipe não encontrada' });
      }
      return reply.status(200).send({ message: 'Equipe deletada com sucesso!' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao deletar equipe:', error.message);
        return reply.status(500).send({ message: 'Erro ao deletar equipe', error: error.message });
      } else {
        console.error('Erro desconhecido ao deletar equipe:', error);
        return reply.status(500).send({ message: 'Erro interno ao deletar equipe' });
      }
    }
  });
};

export default teamRoute;
