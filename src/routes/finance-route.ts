import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import financeSchema from '../schemas/finance-schema';

const prisma = new PrismaClient();

const financeRoute = async (app: FastifyInstance) => {
  app.post('/finace', async (request, reply) => {
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
      console.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
  app.get('/fince/:id', async (request, reply) => {
    const result = financeSchema.safeParse(request.params);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }
    const id = Number(result.data.id);
    const projectFinance = await prisma.finance.findMany({
      where: { id: id },
    });
    if (!projectFinance) {
      return reply.status(404).send({ message: 'Finance not found' });
    } else {
      return reply.status(200).send(projectFinance);
    }
  });
  app.put('/finance/:id', async (request, reply) => {
    const result = financeSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    const id = Number((request.params as { id: string }).id);
    if (!id || isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
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
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
  app.delete('/finance/:id', async (request, reply) => {
    const result = financeSchema.safeParse(request.params);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }
    const id = Number(result.data.id);
    try {
      await prisma.finance.delete({
        where: { id },
      });
      return reply.status(204).send();
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
};

export default financeRoute;
