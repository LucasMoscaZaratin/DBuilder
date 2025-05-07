import { z } from 'zod';

const TeamSchema = z.object({
  id: z.number().int(),
  function: z.string().min(1, 'Function is required'),
  created_at: z.date().default(() => new Date()),
  projectId: z.number().int(),
  workerId: z.number().int(),
});

export default TeamSchema;
