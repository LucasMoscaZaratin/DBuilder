import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { projectSupplierSchema, projectSupplierParamSchema } from '../schemas/projectSupplier-schema';

const prisma = new PrismaClient();

const projectSupplierRoute = async (app: FastifyInstance) => {
  app.post('/project-supplier', async (request, reply) => {
    const result = projectSupplierSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
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
      console.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  app.get('/project-supplier/:id', async (request, reply) => {
    const result = projectSupplierParamSchema.safeParse(request.params);

    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    const id = Number(result.data.id);

    const projectSupplier = await prisma.projectsupplier.findUnique({
      where: { id },
    });

    if (!projectSupplier) {
      return reply.status(404).send({ message: 'Project Supplier not found' });
    }

    return reply.status(200).send(projectSupplier);
  });
};

export default projectSupplierRoute;
