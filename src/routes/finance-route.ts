import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import financeSchema from '../schemas/finance-schema';

const prisma = new PrismaClient();

const financeRoute = async (app: FastifyInstance) => {
  app.post('/finance', async (request, reply) => {
    const result = financeSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    try {
      const { estimate_cost, real_cost, description, projectId } = result.data;

      const finance = await prisma.finance.create({
        data: {
          estimate_cost,
          real_cost: real_cost ?? null,
          description: description ?? null,
          projectId,
          updated_at: new Date(),
        },
      });

      return reply.status(201).send(finance);
    } catch (error) {
      console.error('Erro ao criar registro financeiro:', error);
      return reply.status(500).send({ message: 'Erro interno do servidor' });
    }
  });

  app.get('/finance/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
    }

    try {
      const finance = await prisma.finance.findUnique({
        where: { id },
      });

      if (!finance) {
        return reply.status(404).send({ message: 'Registro financeiro não encontrado' });
      }

      return reply.status(200).send(finance);
    } catch (error) {
      console.error('Erro ao buscar registro financeiro:', error);
      return reply.status(500).send({ message: 'Erro interno do servidor' });
    }
  });

  app.put('/finance/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
    }

    const result = financeSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    try {
      const { estimate_cost, real_cost, description, projectId } = result.data;

      const finance = await prisma.finance.update({
        where: { id },
        data: {
          estimate_cost,
          real_cost: real_cost ?? null,
          description: description ?? null,
          projectId,
          updated_at: new Date(),
        },
      });

      return reply.status(200).send(finance);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({ message: 'Registro financeiro não encontrado' });
      }

      console.error('Erro ao atualizar registro financeiro:', error);
      return reply.status(500).send({ message: 'Erro interno do servidor' });
    }
  });

  app.delete('/finance/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
    }

    try {
      await prisma.finance.delete({
        where: { id },
      });

      return reply.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({ message: 'Registro financeiro não encontrado' });
      }

      console.error('Erro ao deletar registro financeiro:', error);
      return reply.status(500).send({ message: 'Erro interno do servidor' });
    }
  });
};

export default financeRoute;
