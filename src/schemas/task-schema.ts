import { z } from 'zod';

const TaskSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  due_date: z.date().optional().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
  initial_percent: z.number().min(0).max(100).default(0),
  final_percent: z.number().min(0).max(100).default(0),
  value: z.number(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date(),
  projectId: z.number().int(),
  assignedToId: z.number().int().optional().nullable(),
});

export default TaskSchema;
