import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';

export default class TodosController {
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();

    return res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: 'Id is not a number' });

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    return todo ? res.json(todo) : res.status(404).json({ error: `Todo with id: ${id} not found` });
  };

  public createTodo = async (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text property is required' });

    const todo = await prisma.todo.create({
      data: { text },
    });

    return res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: 'Id is not a number' });

    const { text, completedAt } = req.body;
    if (!text) return res.status(400).json({ error: 'Text property is required' });

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        text,
        completedAt: completedAt ? new Date(completedAt) : null,
      },
    });

    return res.json(todo);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: 'Id is not a number' });

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) return res.status(400).json({ error: `Todo with id: ${id} not found` });
    const todoDeleted = await prisma.todo.delete({ where: { id } });

    return res.json(todoDeleted);
  };
}
