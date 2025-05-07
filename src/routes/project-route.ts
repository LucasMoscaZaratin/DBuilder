import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { projectSchema, projectStatusEnum } from '../schemas/project-schema';

const prisma = new PrismaClient();

const projectRoute = async (app: FastifyInstance) => {
  app.post('/projects', async (request, reply) => {
    const result = projectSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    const { name, description, budget } = result.data;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        initial_date: new Date(),
        final_date: null,
        budget: budget ?? 0,
        status: 'PLANNED',
        completion_percentage: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return reply.send({ message: 'Projeto criado com sucesso!', project });
  });
  app.get('/projects', async (request, reply) => {
    const projects = await prisma.project.findMany({
      where: {
        NOT: {
          status: 'CANCELLED',
        },
      },
    });
    if (!projects) {
      return reply.status(404).send({ message: 'Nenhum projeto encontrado' });
    }
    return reply.status(200).send({ projects });
  });

  app.get('/projects/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });
    if (!project) {
      return reply.status(404).send({ message: 'Projeto não encontrado' });
    }
    return reply.status(200).send({ project });
  });
};

export default projectRoute;
