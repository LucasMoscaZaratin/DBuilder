import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import TaskSchema from '../schemas/task-schema';

const prisma = new PrismaClient();

const taskRoute = async (app: FastifyInstance) => {
  app.post('/tasks', async (request, reply) => {
    const result = TaskSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }
    try {
      const data = result.data;

      const task = await prisma.task.create({
        data: {
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      if (!task) {
        return reply.status(400).send({ message: 'Erro ao criar tarefa' });
      }
      return reply.status(201).send({ message: 'Tarefa criada com sucesso!', task });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao criar tarefa', error });
    }
  });
  app.get('/tasks', async (_request, reply) => {
    try {
      const tasks = await prisma.task.findMany({
        select: { id: true, name: true },
        where: { NOT: { status: 'CANCELLED' } },
      });

      return reply.status(200).send({ tasks });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao buscar tarefas', error });
    }
  });
  app.get('tasks/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
    }
    try {
      const task = await prisma.task.findUnique({
        where: { id },
      });

      if (!task) {
        return reply.status(404).send({ message: 'Tarefa não encontrada' });
      }
      return reply.status(200).send({ task });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao buscar tarefa', error });
    }
  });
  app.put('/tasks/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
    }

    const result = TaskSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    try {
      const data = result.data;

      const task = await prisma.task.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date(),
        },
      });

      if (!task) {
        return reply.status(404).send({ message: 'Tarefa não encontrada' });
      }
      return reply.status(200).send({ message: 'Tarefa atualizada com sucesso!', task });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao atualizar tarefa', error });
    }
  });
  app.delete('/tasks/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
    }

    try {
      const task = await prisma.task.delete({
        where: { id },
      });

      if (!task) {
        return reply.status(404).send({ message: 'Tarefa não encontrada' });
      }
      return reply.status(200).send({ message: 'Tarefa excluída com sucesso!', task });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao excluir tarefa', error });
    }
  });
};

export default taskRoute;
