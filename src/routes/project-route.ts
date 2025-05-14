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
          status: 'PLANNED', // Definindo status padrão como 'PLANNED'
          completion_percentage: 0,
          created_at: now,
          updated_at: now,
        },
      });

      return reply.status(201).send({
        message: 'Projeto criado com sucesso!',
        project: { id: project.id, name: project.name, description: project.description },
      });
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      return reply.status(500).send({ message: 'Erro ao criar projeto', error });
    }
  });

  // Listar projetos
  app.get('/projects', async (_request, reply) => {
    try {
      const projects = await prisma.project.findMany({
        select: { id: true, name: true, description: true },
        where: { NOT: { status: 'CANCELLED' } }, // Excluindo projetos cancelados
      });

      return reply.status(200).send({ projects });
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
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

    const { status, name, description, budget, completion_percentage } = result.data;

    // Validando status antes de atualizar o projeto
    const validStatuses = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return reply.status(400).send({ message: 'Status inválido.' });
    }

    try {
      const now = new Date();
      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          name,
          description,
          budget,
          completion_percentage,
          status,
          updated_at: now,
        },
      });

      return reply.status(200).send({
        message: 'Projeto atualizado com sucesso!',
        project: { id: project.id, name: project.name, description: project.description },
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        if (error.message.includes('P2025')) {
          return reply.status(404).send({ message: 'Projeto não encontrado.' });
        }

        console.error('Erro ao atualizar projeto:', error);
        return reply.status(500).send({ message: 'Erro ao atualizar projeto', error: error.message });
      } else {
        console.error('Erro desconhecido ao atualizar projeto:', error);
        return reply.status(500).send({ message: 'Erro desconhecido ao atualizar projeto' });
      }
    }
  });

  // Deletar projeto (marcar como cancelado)
  app.delete('/projects/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const projectId = Number(id);

    if (Number.isNaN(projectId) || projectId <= 0) {
      return reply.status(400).send({ message: 'ID inválido. Deve ser um número positivo.' });
    }

    try {
      // Atualizando status para 'CANCELLED' em vez de excluir
      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          status: 'CANCELLED',
          updated_at: new Date(),
        },
      });

      return reply.status(200).send({
        message: 'Projeto cancelado com sucesso.',
        project,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        if (error.message.includes('P2025')) {
          return reply.status(404).send({ message: 'Projeto não encontrado.' });
        }

        console.error('Erro ao cancelar projeto:', error);
        return reply.status(500).send({ message: 'Erro ao cancelar projeto', error: error.message });
      } else {
        console.error('Erro desconhecido ao cancelar projeto:', error);
        return reply.status(500).send({ message: 'Erro desconhecido ao cancelar projeto' });
      }
    }
  });
};

export default projectRoute;
