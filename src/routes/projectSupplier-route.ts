import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { projectSupplierSchema, projectSupplierParamSchema } from '../schemas/projectSupplier-schema';

const prisma = new PrismaClient();

const projectSupplierRoute = async (app: FastifyInstance) => {
  // Criar relação entre projeto e fornecedor
  app.post('/project-supplier', async (request, reply) => {
    const result = projectSupplierSchema.safeParse(request.body);

    // Verificando se a validação falhou
    if (!result.success) {
      const errorMessage = result.error.errors[0].message;
      return reply.status(400).send({ message: errorMessage });
    }

    try {
      const { projectId, supplierId } = result.data;

      // Validação adicional para garantir que projectId e supplierId são válidos
      if (!projectId || !supplierId || isNaN(projectId) || isNaN(supplierId)) {
        return reply.status(400).send({ message: 'IDs do projeto ou fornecedor inválidos.' });
      }

      // Criando a relação entre projeto e fornecedor
      const projectSupplier = await prisma.projectsupplier.create({
        data: {
          projectId,
          supplierId,
        },
      });

      return reply.status(201).send(projectSupplier);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao criar relação projeto-fornecedor:', error.message);
        return reply.status(500).send({ message: 'Erro interno ao criar relação projeto-fornecedor.' });
      } else {
        console.error('Erro desconhecido ao criar relação projeto-fornecedor:', error);
        return reply.status(500).send({ message: 'Erro desconhecido ao criar relação projeto-fornecedor.' });
      }
    }
  });

  // Buscar relação projeto-fornecedor por ID
  app.get('/project-supplier/:id', async (request, reply) => {
    const result = projectSupplierParamSchema.safeParse(request.params);

    // Verificando se a validação falhou
    if (!result.success) {
      const errorMessage = result.error.errors[0].message;
      return reply.status(400).send({ message: errorMessage });
    }

    const id = Number(result.data.id);

    // Verificando se o ID é válido
    if (isNaN(id) || id <= 0) {
      return reply.status(400).send({ message: 'ID inválido. Deve ser um número positivo.' });
    }

    try {
      // Buscando a relação entre o projeto e fornecedor
      const projectSupplier = await prisma.projectsupplier.findUnique({
        where: { id },
        select: { id: true, projectId: true, supplierId: true }, // Selecionando apenas os campos necessários
      });

      if (!projectSupplier) {
        return reply.status(404).send({ message: 'Relação projeto-fornecedor não encontrada.' });
      }

      return reply.status(200).send(projectSupplier);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao buscar relação projeto-fornecedor:', error.message);
        return reply.status(500).send({ message: 'Erro interno ao buscar relação projeto-fornecedor.' });
      } else {
        console.error('Erro desconhecido ao buscar relação projeto-fornecedor:', error);
        return reply.status(500).send({ message: 'Erro desconhecido ao buscar relação projeto-fornecedor.' });
      }
    }
  });
};

export default projectSupplierRoute;
