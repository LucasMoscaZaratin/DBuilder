import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import TeamSchema from '../schemas/team-schema';

const prisma = new PrismaClient();
const teamRoute = async (app: FastifyInstance) => {
  app.post('/teams', async (request, reply) => {
    const result = TeamSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }
    try {
      const data = result.data;

      const team = await prisma.team.create({
        data: {
          ...data,
          created_at: new Date(),
        },
      });

      if (!team) {
        return reply.status(400).send({ message: 'Erro ao criar equipe' });
      }
      return reply.status(201).send({ message: 'Equipe criada com sucesso!', team });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao criar equipe', error });
    }
  });
  app.get('/teams/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
    }
    try {
      const team = await prisma.team.findUnique({
        where: { id },
      });

      if (!team) {
        return reply.status(404).send({ message: 'Equipe não encontrada' });
      }
      return reply.status(200).send({ team });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao buscar equipe', error });
    }
  });
  app.delete('/teams/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
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
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao deletar equipe', error });
    }
  });
};
export default teamRoute;
