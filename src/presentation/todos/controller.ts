import { Request, Response } from 'express';

const todos = [
  { id: 1, text: 'Buy milk', createdAt: new Date() },
  { id: 2, text: 'Buy Bread', createdAt: null },
  { id: 3, text: 'Buy butter', createdAt: new Date() },
  { id: 4, text: 'Buy butter', createdAt: new Date() },
  { id: 5, text: 'Buy butter', createdAt: new Date() },
  { id: 6, text: 'Buy butter', createdAt: new Date() },
  { id: 7, text: 'Buy butter', createdAt: new Date() },
];

export default class TodosController {
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: 'Id is not a number' });

    const todo = todos.find((todo) => todo.id === id);
    return todo ? res.json(todo) : res.status(404).json({ error: `Todo with id: ${id} not found` });
  };

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: 'Text property is required' });
    const newTodo = {
      id: todos.length + 1,
      text,
      createdAt: null,
    };

    todos.push(newTodo);
    return res.json(newTodo);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: 'Id is not a number' });

    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return res.status(400).json({ error: `Todo with id: ${id} not found` });

    const { text, createdAt } = req.body;
    if (!text) return res.status(400).json({ error: 'Text property is required' });

    todo.text = text;
    createdAt === null ? (todo.createdAt = null) : (todo.createdAt = new Date(createdAt || todo.createdAt));

    return res.json(todo);
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return res.status(400).json({ error: `Todo with id: ${id} not found` });

    todos.splice(todos.indexOf(todo), 1);

    return res.json(todo);
  };
}
