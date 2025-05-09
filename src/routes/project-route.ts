import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { projectSchema } from '../schemas/project-schema';

const prisma = new PrismaClient();

const projectRoute = async (app: FastifyInstance) => {
  // Criar projeto
  app.post('/projects', async (request, reply) => {
    const result = projectSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    try {
      const { name, description, budget } = result.data;
      const now = new Date();

      const project = await prisma.project.create({
        data: {
          name,
          description,
          initial_date: now,
          final_date: null,
          budget: budget ?? 0,
          status: 'PLANNED',
          completion_percentage: 0,
          created_at: now,
          updated_at: now,
        },
      });

      return reply.status(201).send({ message: 'Projeto criado com sucesso!', project });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao criar projeto', error });
    }
  });

  // Listar projetos
  app.get('/projects', async (_request, reply) => {
    try {
      const projects = await prisma.project.findMany({
        select: { id: true },
        where: { NOT: { status: 'CANCELLED' } },
      });

      return reply.status(200).send({ projects });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao buscar projetos', error });
    }
  });

  // Buscar projeto por ID
  app.get('/projects/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const projectId = Number(id);

    if (Number.isNaN(projectId) || projectId <= 0) {
      return reply.status(400).send({ message: 'ID inválido. Deve ser um número positivo.' });
    }

    try {
      const project = await prisma.project.findUnique({ where: { id: projectId } });

      if (!project) {
        return reply.status(404).send({ message: 'Projeto não encontrado.' });
      }

      return reply.status(200).send({ project });
    } catch (error) {
      console.error('Erro ao buscar projeto:', error);
      return reply.status(500).send({ message: 'Erro interno ao buscar o projeto.' });
    }
  });

  app.put('/projects/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const projectId = Number(id);

    if (Number.isNaN(projectId) || projectId <= 0) {
      return reply.status(400).send({ message: 'ID inválido. Deve ser um número positivo.' });
    }

    const result = projectSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    try {
      const data = request.body as Record<string, any>;
      const now = new Date();

      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          ...(typeof data === 'object' && data !== null ? data : {}),
          status: data.status,
          updated_at: now,
        },
      });

      return reply.status(200).send({ message: 'Projeto atualizado com sucesso!', project });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao atualizar projeto', error });
    }
  });
};

export default projectRoute;
