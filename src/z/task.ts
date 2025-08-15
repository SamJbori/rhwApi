import z from "zod";

export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
};

export const ZNTask = z.object({
  title: z.string().min(1).max(255),
  color: z.string().optional(),
  completed: z.boolean().optional(),
});

export type ONTask = z.output<typeof ZNTask>;
