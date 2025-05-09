import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import supplierSchema from '../schemas/supplier-schema';

const prisma = new PrismaClient();

const supplierRoute = async (app: FastifyInstance) => {
  app.post('/suppliers', async (request, reply) => {
    const result = supplierSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }
    try {
      const data = result.data;

      const supplier = await prisma.supplier.create({
        data: {
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      if (!supplier) {
        return reply.status(400).send({ message: 'Erro ao criar fornecedor' });
      }
      return reply.status(201).send({ message: 'Fornecedor criado com sucesso!', supplier });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao criar fornecedor', error });
    }
  });
  app.get('/suppliers', async (_request, reply) => {
    try {
      const suppliers = await prisma.supplier.findMany({
        select: { id: true, name: true },
        where: { NOT: { role: 'INACTIVE' } },
      });

      return reply.status(200).send({ suppliers });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao buscar fornecedores', error });
    }
  });

  app.put('/suppliers/:id', async (request, reply) => {
    const result = supplierSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }
    try {
      const data = result.data;
      const { id } = request.params as { id: number };

      const supplier = await prisma.supplier.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date(),
        },
      });

      if (!supplier) {
        return reply.status(400).send({ message: 'Erro ao atualizar fornecedor' });
      }
      return reply.status(200).send({ message: 'Fornecedor atualizado com sucesso!', supplier });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao atualizar fornecedor', error });
    }
  });
  app.delete('/suppliers/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: number };

      const supplier = await prisma.supplier.update({
        where: { id },
        data: {
          role: 'INACTIVE',
          updated_at: new Date(),
        },
      });

      if (!supplier) {
        return reply.status(400).send({ message: 'Erro ao excluir fornecedor' });
      }
      return reply.status(200).send({ message: 'Fornecedor excluído com sucesso!', supplier });
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao excluir fornecedor', error });
    }
  });
};

export default supplierRoute;
