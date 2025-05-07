import { PrismaClient, profile_role } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import profileSchema from '../schemas/profile-schema';

const prisma = new PrismaClient();

const profileRoute = async (app: FastifyInstance) => {
  app.post('/profile', async (request, reply) => {
    const result = profileSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    try {
      const {
        name,
        email,
        document_id,
        rg,
        ie,
        state_registration,
        birth_date,
        gender,
        marital_status,
        occupation,
        company,
        fantasy_name,
        nationality,
        address,
        address_number,
        complement,
        city,
        state,
        zip_code,
        country,
        phone_number,
        notes,
        is_active,
        role,
      } = result.data;

      if (!Object.values(profile_role).includes(role as profile_role)) {
        return reply.status(400).send({ message: 'Role inválido' });
      }

      const profile = await prisma.profile.create({
        data: {
          updated_at: new Date(),
          name,
          email,
          document_id,
          rg,
          ie,
          state_registration,
          birth_date,
          gender,
          marital_status,
          occupation,
          company,
          fantasy_name,
          nationality,
          address,
          address_number,
          complement,
          city,
          state,
          zip_code,
          country,
          phone_number,
          notes,
          is_active,
          role: role as profile_role,
        },
      });

      return reply.status(201).send(profile);
    } catch (err) {
      console.error('Erro ao criar perfil:', err);
      return reply.status(500).send({ message: 'Erro ao criar o perfil' });
    }
  });
  app.get('/profile', async (request, reply) => {
    const profile = await prisma.profile.findFirst({
      where: { name: (request.query as { name: string }).name },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
      },
    });

    if (!profile) {
      return reply.status(404).send({ message: 'Perfil não encontrado' });
    } else {
      return reply.send(profile);
    }
  });
  app.get('/profile/:id', async (request, reply) => {
    const result = profileSchema.safeParse(request.params);

    if (!result.success) {
      return reply.status(400).send({ message: 'Invalid ID', errors: result.error.errors });
    }

    const id = Number(result.data.id);

    const fullProfile = await prisma.profile.findUnique({
      where: { id: id },
    });

    if (!fullProfile) {
      return reply.status(404).send({ message: 'Profile not found' });
    } else {
      return reply.send(fullProfile);
    }
  });
  app.put('/profile/:id', async (request, reply) => {
    const result = profileSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: result.error.errors[0].message });
    }

    const id = Number((request.params as { id: string }).id);
    if (!id || isNaN(id)) {
      return reply.status(400).send({ message: 'ID inválido' });
    }

    try {
      const profile = await prisma.profile.update({
        where: { id },
        data: {
          ...result.data,
          role: result.data.role as profile_role,
        },
      });

      return reply.status(200).send(profile);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({ message: 'Perfil não encontrado' });
      }
      return reply.status(500).send({ message: 'Erro ao atualizar perfil' });
    }
  });
};

export default profileRoute;
