import { Request, Response } from 'express';

export class TodosController {
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    res.json([
      { id: 1, text: 'Buy milk', createdAt: new Date() },
      { id: 1, text: 'Buy Bread', createdAt: null },
      { id: 1, text: 'Buy butter', createdAt: new Date() },
    ]);
  };
}
