import { z } from 'zod';

const TeamSchema = z.object({
  function: z.string().min(1, 'Function is required'),
  projectId: z.number().int(),
  teamMembers: z.array(z.number().int()).min(1, 'Necessário inserir pelo menos um membro'),
  role: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export default TeamSchema;
