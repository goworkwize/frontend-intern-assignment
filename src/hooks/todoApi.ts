import type { Todo, CreateTodoInput, UpdateTodoInput } from './todoSchema';
import { todoSchema } from './todoSchema';

const API_BASE_URL = 'https://todo-placeholder.tlaurentiu.net';

/**
 * Fetch all todos with optional filtering and search
 */
export const fetchTodos = async (params?: {
  completed?: boolean;
  search?: string;
}): Promise<Todo[]> => {
  const url = new URL(`${API_BASE_URL}/todos`);

  if (params?.completed !== undefined) {
    url.searchParams.append('completed', String(params.completed));
  }

  if (params?.search) {
    url.searchParams.append('search', params.search);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  const data = await response.json();

  // Validate the response data with Zod
  return data.map((todo: unknown) => todoSchema.parse(todo));
};

/**
 * Fetch a single todo by id
 */
export const fetchTodoById = async (id: number): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch todo with id ${id}`);
  }

  const data = await response.json();

  // Validate the response data with Zod
  return todoSchema.parse(data);
};

/**
 * Fetch todos by userId
 */
export const fetchTodosByUserId = async (userId: number): Promise<Todo[]> => {
  const response = await fetch(`${API_BASE_URL}/todos?userId=${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch todos for user ${userId}`);
  }

  const data = await response.json();

  // Validate the response data with Zod
  return data.map((todo: unknown) => todoSchema.parse(todo));
};

/**
 * Create a new todo
 */
export const createTodo = async (input: CreateTodoInput): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to create todo');
  }

  const data = await response.json();

  // Server returns the created todo with a generated id
  return todoSchema.parse(data);
};

/**
 * Update an existing todo
 */
export const updateTodo = async (id: number, input: UpdateTodoInput): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to update todo with id ${id}`);
  }

  const data = await response.json();

  return todoSchema.parse(data);
};

/**
 * Delete a todo
 */
export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete todo with id ${id}`);
  }
};
