import z from "zod";
import { Router } from "express";
import { client } from "@/libs/db";
import { ZNTask } from "@/z/task";

const router = Router();

router.get("/{:id}", async (req, res) => {
  const { id } = req.params;
  try {
    const result = id
      ? await client.task.findFirst({ where: { id } })
      : await client.task.findMany({ orderBy: { createdAt: "asc" } });
    return res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500);
  }
});

router.post("/", async (req, res) => {
  const { data, success, error } = ZNTask.safeParse(req.body);
  if (!success || !data) {
    return res.status(400).json({ errors: z.treeifyError(error) });
  }
  try {
    const newRecord = await client.task.create({
      data: { ...data, completedAt: data.completed ? new Date() : undefined },
    });

    if (newRecord.id) {
      return res.json({ id: newRecord.id });
    } else {
      return res.status(500);
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Missing ID" });
  }
  const { data, success, error } = ZNTask.partial().safeParse(req.body);
  if (!success) {
    return res.status(400).json({ errors: z.treeifyError(error) });
  }
  try {
    const updatedTask = await client.task.update({
      where: { id },
      data: { ...data, completedAt: data.completed ? new Date() : undefined },
    });

    if (updatedTask) {
      return res.json({ code: 200 });
    } else {
      // Not needed really!
      return res.status(500);
    }
  } catch (e: any) {
    if (e.code === "P2025") {
      // Prisma's "Record not founf"
      return res.status(404);
    }
    console.error(e);
    return res.status(500);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400);
  }
  try {
    const deleteTask = await client.task.delete({
      where: { id },
    });

    if (deleteTask) {
      return res.json({ code: 200 });
    } else {
      // Not needed really!
      return res.status(500);
    }
  } catch (e: any) {
    if (e.code === "P2025") {
      // Prisma's "Record not founf"
      return res.status(404);
    }
    console.error(e);
    return res.status(500);
  }
});

/**
 * Catch all **Unimplemented**
 */
// router.all("*", (_, res) => res.status(501));

export default router;
