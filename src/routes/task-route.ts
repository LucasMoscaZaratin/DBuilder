import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import TaskSchema from '../schemas/task-schema';

const prisma = new PrismaClient();

const taskRoute = async (app: FastifyInstance) => {
  // Criar tarefa
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

      return reply.status(201).send({ message: 'Tarefa criada com sucesso!', task });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao criar tarefa:', error.message);
        return reply.status(500).send({ message: 'Erro ao criar tarefa', error: error.message });
      } else {
        console.error('Erro desconhecido ao criar tarefa:', error);
        return reply.status(500).send({ message: 'Erro interno ao criar tarefa' });
      }
    }
  });

  // Listar tarefas
  app.get('/tasks', async (_request, reply) => {
    try {
      const tasks = await prisma.task.findMany({
        select: { id: true, name: true }, // Selecionando apenas os campos necessários
        where: { NOT: { status: 'CANCELLED' } }, // Garantindo que tarefas com status CANCELLED não sejam retornadas
      });

      return reply.status(200).send({ tasks });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar tarefas:', error.message);
        return reply.status(500).send({ message: 'Erro ao buscar tarefas', error: error.message });
      } else {
        console.error('Erro desconhecido ao buscar tarefas:', error);
        return reply.status(500).send({ message: 'Erro interno ao buscar tarefas' });
      }
    }
  });

  // Buscar tarefa por ID
  app.get('/tasks/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    // Validando o ID
    if (isNaN(id) || id <= 0) {
      return reply.status(400).send({ message: 'ID inválido. Deve ser um número positivo.' });
    }

    try {
      const task = await prisma.task.findUnique({
        where: { id },
      });

      if (!task) {
        return reply.status(404).send({ message: 'Tarefa não encontrada' });
      }
      return reply.status(200).send({ task });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar tarefa:', error.message);
        return reply.status(500).send({ message: 'Erro ao buscar tarefa', error: error.message });
      } else {
        console.error('Erro desconhecido ao buscar tarefa:', error);
        return reply.status(500).send({ message: 'Erro interno ao buscar tarefa' });
      }
    }
  });

  // Atualizar tarefa
  app.put('/tasks/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    // Validando o ID
    if (isNaN(id) || id <= 0) {
      return reply.status(400).send({ message: 'ID inválido. Deve ser um número positivo.' });
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
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('P2025')) {
        return reply.status(404).send({ message: 'Tarefa não encontrada.' });
      }
      console.error('Erro ao atualizar tarefa:', error);
      return reply
        .status(500)
        .send({ message: 'Erro ao atualizar tarefa', error: error instanceof Error ? error.message : error });
    }
  });

  // Excluir tarefa
  app.delete('/tasks/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    // Validando o ID
    if (isNaN(id) || id <= 0) {
      return reply.status(400).send({ message: 'ID inválido. Deve ser um número positivo.' });
    }

    try {
      const task = await prisma.task.delete({
        where: { id },
      });

      return reply.status(200).send({ message: 'Tarefa excluída com sucesso!', task });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('P2025')) {
        return reply.status(404).send({ message: 'Tarefa não encontrada.' });
      }
      console.error('Erro ao excluir tarefa:', error);
      return reply
        .status(500)
        .send({ message: 'Erro ao excluir tarefa', error: error instanceof Error ? error.message : error });
    }
  });
};

export default taskRoute;
