import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import supplierSchema from '../schemas/supplier-schema';

const prisma = new PrismaClient();

const supplierRoute = async (app: FastifyInstance) => {
  // Criar fornecedor
  app.post('/suppliers', async (request, reply) => {
    const result = supplierSchema.safeParse(request.body);
    if (!result.success) {
      const errorMessage = result.error.errors[0].message;
      return reply.status(400).send({ message: errorMessage });
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

      return reply.status(201).send({ message: 'Fornecedor criado com sucesso!', supplier });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao criar fornecedor:', error.message);
        return reply.status(500).send({ message: 'Erro ao criar fornecedor', error: error.message });
      } else {
        console.error('Erro desconhecido ao criar fornecedor:', error);
        return reply.status(500).send({ message: 'Erro interno ao criar fornecedor' });
      }
    }
  });

  // Listar fornecedores
  app.get('/suppliers', async (_request, reply) => {
    try {
      const suppliers = await prisma.supplier.findMany({
        select: { id: true, name: true }, // Selecionando apenas os campos necessários
        where: { NOT: { role: 'INACTIVE' } }, // Garantindo que fornecedores com status INACTIVE não sejam retornados
      });

      return reply.status(200).send({ suppliers });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar fornecedores:', error.message);
        return reply.status(500).send({ message: 'Erro ao buscar fornecedores', error: error.message });
      } else {
        console.error('Erro desconhecido ao buscar fornecedores:', error);
        return reply.status(500).send({ message: 'Erro interno ao buscar fornecedores' });
      }
    }
  });

  // Atualizar fornecedor
  app.put('/suppliers/:id', async (request, reply) => {
    const result = supplierSchema.safeParse(request.body);
    if (!result.success) {
      const errorMessage = result.error.errors[0].message;
      return reply.status(400).send({ message: errorMessage });
    }

    const { id } = request.params as { id: string }; // O ID é obtido da URL

    // Validando o ID
    const supplierId = Number(id);
    if (isNaN(supplierId) || supplierId <= 0) {
      return reply.status(400).send({ message: 'ID inválido. Deve ser um número positivo.' });
    }

    try {
      const data = result.data;

      const supplier = await prisma.supplier.update({
        where: { id: supplierId },
        data: {
          ...data,
          updated_at: new Date(),
        },
      });

      return reply.status(200).send({ message: 'Fornecedor atualizado com sucesso!', supplier });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('P2025')) {
        return reply.status(404).send({ message: 'Fornecedor não encontrado.' });
      }
      console.error('Erro ao atualizar fornecedor:', error);
      return reply
        .status(500)
        .send({ message: 'Erro ao atualizar fornecedor', error: error instanceof Error ? error.message : error });
    }
  });

  app.delete('/suppliers/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const supplierId = Number(id);
    if (isNaN(supplierId) || supplierId <= 0) {
      return reply.status(400).send({ message: 'ID inválido. Deve ser um número positivo.' });
    }

    try {
      const supplier = await prisma.supplier.update({
        where: { id: supplierId },
        data: {
          role: 'INACTIVE',
          updated_at: new Date(),
        },
      });

      return reply.status(200).send({ message: 'Fornecedor excluído com sucesso!', supplier });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('P2025')) {
        return reply.status(404).send({ message: 'Fornecedor não encontrado.' });
      }
      console.error('Erro ao excluir fornecedor:', error);
      return reply
        .status(500)
        .send({ message: 'Erro ao excluir fornecedor', error: error instanceof Error ? error.message : error });
    }
  });
};

export default supplierRoute;
