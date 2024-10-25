import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('Testing routes.ts', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  const todo1 = { text: 'Todo 1' };
  const todo2 = { text: 'Todo 2' };

  test('should return TODOs api/todos', async () => {
    await prisma.todo.createMany({ data: [todo1, todo2] });

    const { body } = await request(testServer.app).get('/api/todos');

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(body[0].text).toBe(todo1.text);
    expect(body[1].text).toBe(todo2.text);
  });

  test('should return a TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app).get(`/api/todos/${todo.id}`).expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: todo.completedAt,
    });
  });

  test('should return a 404 NotFound api/todos/:id', async () => {
    const { body } = await request(testServer.app).get('/api/todos/999').expect(404);

    expect(body).toEqual({
      error: 'Todo with id 999 not found',
    });
  });

  test('should return a new TODO api/todos/', async () => {
    const { body } = await request(testServer.app).post('/api/todos/').send(todo1).expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null,
    });
  });

  test('should return an error if text is not present api/todos/', async () => {
    const { body } = await request(testServer.app).post('/api/todos/').send({}).expect(500);

    expect(body).toEqual({
      error: 'Internal server error - check logs',
    });
  });

  test('should return an error if text is empty api/todos/', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos/')
      .send({ text: '' })
      .expect(500);

    expect(body).toEqual({
      error: 'Internal server error - check logs',
    });
  });

  test('should return an updated TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: 'Text updated', completedAt: '2024-10-12' })
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: 'Text updated',
      completedAt: expect.stringMatching(/2024-10-12/),
    });
  });

  test('should return an error if TODO not found api/todos/:id', async () => {
    const { body } = await request(testServer.app)
      .put('/api/todos/1')
      .send({ text: 'Text updated', completedAt: '2024-10-12' })
      .expect(404);

    expect(body).toEqual({
      error: 'Todo with id 1 not found',
    });
  });

  test('should return an updated TODO but only the date api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: '2024-10-12' })
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: expect.stringMatching(/2024-10-12/),
    });
  });

  test('should return an updated TODO but only the text api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: 'Text updated' })
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: 'Text updated',
      completedAt: null,
    });
  });

  test('should delete a TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .send({ text: 'Text updated' })
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: todo.completedAt,
    });
  });

  test('should return and error if todo not found api/todos/:id', async () => {
    const { body } = await request(testServer.app)
      .delete('/api/todos/999')
      .send({ text: 'Text updated' })
      .expect(404);

    expect(body).toEqual({
      error: 'Todo with id 999 not found',
    });
  });
});
