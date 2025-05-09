import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { projectSupplierSchema, projectSupplierParamSchema } from '../schemas/projectSupplier-schema';

const prisma = new PrismaClient();

const projectSupplierRoute = async (app: FastifyInstance) => {
  app.post('/project-supplier', async (request, reply) => {
    const result = projectSupplierSchema.safeParse(request.body);

    if (!result.success) {
      const errorMessage = result.error.errors[0].message;
      return reply.status(400).send({ message: errorMessage });
    }

    try {
      const { projectId, supplierId } = result.data;

      const projectSupplier = await prisma.projectsupplier.create({
        data: {
          projectId,
          supplierId,
        },
      });

      return reply.status(201).send(projectSupplier);
    } catch (error) {
      console.error('Erro ao criar relação projeto-fornecedor:', error);
      return reply.status(500).send({ message: 'Erro interno ao criar relação projeto-fornecedor.' });
    }
  });

  app.get('/project-supplier/:id', async (request, reply) => {
    const result = projectSupplierParamSchema.safeParse(request.params);

    if (!result.success) {
      const errorMessage = result.error.errors[0].message;
      return reply.status(400).send({ message: errorMessage });
    }

    const id = Number(result.data.id);

    try {
      const projectSupplier = await prisma.projectsupplier.findUnique({
        where: { id },
      });

      if (!projectSupplier) {
        return reply.status(404).send({ message: 'Relação projeto-fornecedor não encontrada.' });
      }

      return reply.status(200).send(projectSupplier);
    } catch (error) {
      console.error('Erro ao buscar relação projeto-fornecedor:', error);
      return reply.status(500).send({ message: 'Erro interno ao buscar relação projeto-fornecedor.' });
    }
  });
};

export default projectSupplierRoute;
