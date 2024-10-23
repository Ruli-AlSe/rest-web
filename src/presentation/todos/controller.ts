import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

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
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.create({
      data: createTodoDto!,
    });

    return res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.findUnique({
      where: { id },
    });
    if (!todo) return res.status(404).json({ error: `Todo with id: ${id} not found` });

    const todoUpdated = await prisma.todo.update({
      where: { id },
      data: updateTodoDto!.values,
    });

    return res.json(todoUpdated);
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
