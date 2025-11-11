import { useQuery, useMutation, useQueryClient } from 'react-query';
import type { UseQueryOptions } from 'react-query';
import {
  fetchTodos,
  fetchTodoById,
  fetchTodosByUserId,
  createTodo,
  updateTodo,
  deleteTodo,
} from './todoApi';
import type { Todo, CreateTodoInput, UpdateTodoInput } from './todoSchema';

// Query keys
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters?: { userId?: number; completed?: boolean; search?: string }) =>
    [...todoKeys.lists(), filters] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

/**
 * Hook to fetch all todos with optional filtering and search
 */
export const useTodos = (
  filters?: { completed?: boolean; search?: string },
  options?: UseQueryOptions<Todo[], Error>
) => {
  return useQuery<Todo[], Error>(todoKeys.list(filters), () => fetchTodos(filters), {
    staleTime: 30 * 1000, // 30 seconds - reasonable for real API
    ...options,
  });
};

/**
 * Hook to fetch a single todo by id
 */
export const useTodo = (id: number, options?: UseQueryOptions<Todo, Error>) => {
  return useQuery<Todo, Error>(todoKeys.detail(id), () => fetchTodoById(id), {
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds - reasonable for real API
    ...options,
  });
};

/**
 * Hook to fetch todos by userId
 */
export const useTodosByUserId = (userId: number, options?: UseQueryOptions<Todo[], Error>) => {
  return useQuery<Todo[], Error>(todoKeys.list({ userId }), () => fetchTodosByUserId(userId), {
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds - reasonable for real API
    ...options,
  });
};

/**
 * Hook to create a new todo
 * Uses optimistic updates for instant UI feedback, then syncs with server
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  type CreateTodoContext = {
    previousAllTodos?: Todo[];
    previousActiveTodos?: Todo[];
    previousCompletedTodos?: Todo[];
    tempId: number;
  };

  return useMutation<Todo, Error, CreateTodoInput, CreateTodoContext>(createTodo, {
    onMutate: async (newTodoData) => {
      // Cancel any outgoing refetches for all list queries
      await queryClient.cancelQueries(todoKeys.lists());

      // Snapshot all list query data
      const previousAllTodos = queryClient.getQueryData<Todo[]>(todoKeys.list());
      const previousActiveTodos = queryClient.getQueryData<Todo[]>(
        todoKeys.list({ completed: false })
      );
      const previousCompletedTodos = queryClient.getQueryData<Todo[]>(
        todoKeys.list({ completed: true })
      );

      // Generate a temporary ID for optimistic update
      const tempId = Date.now();
      const optimisticTodo: Todo = {
        ...newTodoData,
        id: tempId,
      };

      // Optimistically update all relevant caches
      // Update "all" todos cache
      queryClient.setQueryData<Todo[]>(todoKeys.list(), (old) => {
        if (!old) return [optimisticTodo];
        return [optimisticTodo, ...old];
      });

      // Update filtered cache if applicable
      if (newTodoData.completed === false) {
        queryClient.setQueryData<Todo[]>(todoKeys.list({ completed: false }), (old) => {
          if (!old) return [optimisticTodo];
          return [optimisticTodo, ...old];
        });
      } else if (newTodoData.completed === true) {
        queryClient.setQueryData<Todo[]>(todoKeys.list({ completed: true }), (old) => {
          if (!old) return [optimisticTodo];
          return [optimisticTodo, ...old];
        });
      }

      // Return context with previous values for rollback
      return {
        previousAllTodos,
        previousActiveTodos,
        previousCompletedTodos,
        tempId,
      };
    },
    onSuccess: (createdTodo, _variables, context) => {
      // Replace the temporary todo with the real one from the server in all caches
      queryClient.setQueryData<Todo[]>(todoKeys.list(), (old) => {
        if (!old) return [createdTodo];
        return old.map((todo) => (todo.id === context?.tempId ? createdTodo : todo));
      });

      if (createdTodo.completed === false) {
        queryClient.setQueryData<Todo[]>(todoKeys.list({ completed: false }), (old) => {
          if (!old) return [createdTodo];
          return old.map((todo) => (todo.id === context?.tempId ? createdTodo : todo));
        });
      } else if (createdTodo.completed === true) {
        queryClient.setQueryData<Todo[]>(todoKeys.list({ completed: true }), (old) => {
          if (!old) return [createdTodo];
          return old.map((todo) => (todo.id === context?.tempId ? createdTodo : todo));
        });
      }
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousAllTodos) {
        queryClient.setQueryData(todoKeys.list(), context.previousAllTodos);
      }
      if (context?.previousActiveTodos) {
        queryClient.setQueryData(todoKeys.list({ completed: false }), context.previousActiveTodos);
      }
      if (context?.previousCompletedTodos) {
        queryClient.setQueryData(
          todoKeys.list({ completed: true }),
          context.previousCompletedTodos
        );
      }
      console.error('Failed to create todo:', error);
    },
  });
};

/**
 * Hook to update a todo
 * Uses optimistic updates for instant UI feedback, then syncs with server
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  type UpdateTodoContext = {
    previousAllTodos?: Todo[];
    previousActiveTodos?: Todo[];
    previousCompletedTodos?: Todo[];
    previousTodo?: Todo;
  };

  return useMutation<Todo, Error, { id: number; data: UpdateTodoInput }, UpdateTodoContext>(
    ({ id, data }) => updateTodo(id, data),
    {
      onMutate: async (variables) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(todoKeys.lists());
        await queryClient.cancelQueries(todoKeys.detail(variables.id));

        // Snapshot the previous values for all caches
        const previousAllTodos = queryClient.getQueryData<Todo[]>(todoKeys.list());
        const previousActiveTodos = queryClient.getQueryData<Todo[]>(
          todoKeys.list({ completed: false })
        );
        const previousCompletedTodos = queryClient.getQueryData<Todo[]>(
          todoKeys.list({ completed: true })
        );
        const previousTodo = queryClient.getQueryData<Todo>(todoKeys.detail(variables.id));

        // Helper to update a todo in an array
        const updateTodoInArray = (todos: Todo[] | undefined): Todo[] | undefined => {
          if (!todos) return undefined;
          return todos.map((todo) =>
            todo.id === variables.id ? { ...todo, ...variables.data } : todo
          );
        };

        // Optimistically update all list caches
        queryClient.setQueryData<Todo[] | undefined>(todoKeys.list(), updateTodoInArray);
        queryClient.setQueryData<Todo[] | undefined>(
          todoKeys.list({ completed: false }),
          updateTodoInArray
        );
        queryClient.setQueryData<Todo[] | undefined>(
          todoKeys.list({ completed: true }),
          updateTodoInArray
        );

        // Optimistically update the individual todo
        if (previousTodo) {
          queryClient.setQueryData<Todo>(todoKeys.detail(variables.id), {
            ...previousTodo,
            ...variables.data,
          });
        }

        // Return context for rollback
        return {
          previousAllTodos,
          previousActiveTodos,
          previousCompletedTodos,
          previousTodo,
        };
      },
      onSuccess: (updatedTodo, variables, context) => {
        // Update the detail cache
        queryClient.setQueryData<Todo>(todoKeys.detail(variables.id), updatedTodo);

        // Find the old todo to check if completed status changed
        const oldTodo = context?.previousAllTodos?.find((t: Todo) => t.id === variables.id);
        const completedChanged = oldTodo && oldTodo.completed !== updatedTodo.completed;

        if (completedChanged) {
          // If completed status changed, remove from old filter and add to new filter

          // Update "all" cache
          queryClient.setQueryData<Todo[] | undefined>(todoKeys.list(), (old) => {
            if (!old) return undefined;
            return old.map((todo) => (todo.id === variables.id ? updatedTodo : todo));
          });

          // Remove from old filter and add to new filter
          if (updatedTodo.completed) {
            // Moved from active to completed
            queryClient.setQueryData<Todo[] | undefined>(
              todoKeys.list({ completed: false }),
              (old) => {
                if (!old) return undefined;
                return old.filter((todo) => todo.id !== variables.id);
              }
            );
            queryClient.setQueryData<Todo[] | undefined>(
              todoKeys.list({ completed: true }),
              (old) => {
                if (!old) return [updatedTodo];
                // Add if not already present
                if (old.some((todo) => todo.id === variables.id)) {
                  return old.map((todo) => (todo.id === variables.id ? updatedTodo : todo));
                }
                return [updatedTodo, ...old];
              }
            );
          } else {
            // Moved from completed to active
            queryClient.setQueryData<Todo[] | undefined>(
              todoKeys.list({ completed: true }),
              (old) => {
                if (!old) return undefined;
                return old.filter((todo) => todo.id !== variables.id);
              }
            );
            queryClient.setQueryData<Todo[] | undefined>(
              todoKeys.list({ completed: false }),
              (old) => {
                if (!old) return [updatedTodo];
                // Add if not already present
                if (old.some((todo) => todo.id === variables.id)) {
                  return old.map((todo) => (todo.id === variables.id ? updatedTodo : todo));
                }
                return [updatedTodo, ...old];
              }
            );
          }
        } else {
          // Just update in place in all caches
          queryClient.setQueryData<Todo[] | undefined>(todoKeys.list(), (old) => {
            if (!old) return undefined;
            return old.map((todo) => (todo.id === variables.id ? updatedTodo : todo));
          });
          queryClient.setQueryData<Todo[] | undefined>(
            todoKeys.list({ completed: false }),
            (old) => {
              if (!old) return undefined;
              return old.map((todo) => (todo.id === variables.id ? updatedTodo : todo));
            }
          );
          queryClient.setQueryData<Todo[] | undefined>(
            todoKeys.list({ completed: true }),
            (old) => {
              if (!old) return undefined;
              return old.map((todo) => (todo.id === variables.id ? updatedTodo : todo));
            }
          );
        }
      },
      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousAllTodos) {
          queryClient.setQueryData(todoKeys.list(), context.previousAllTodos);
        }
        if (context?.previousActiveTodos) {
          queryClient.setQueryData(
            todoKeys.list({ completed: false }),
            context.previousActiveTodos
          );
        }
        if (context?.previousCompletedTodos) {
          queryClient.setQueryData(
            todoKeys.list({ completed: true }),
            context.previousCompletedTodos
          );
        }
        if (context?.previousTodo) {
          queryClient.setQueryData(todoKeys.detail(variables.id), context.previousTodo);
        }
        console.error(`Failed to update todo ${variables.id}:`, error);
      },
    }
  );
};

/**
 * Hook to delete a todo
 * Uses optimistic updates for instant UI feedback, then syncs with server
 */
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  type DeleteTodoContext = {
    previousAllTodos?: Todo[];
    previousActiveTodos?: Todo[];
    previousCompletedTodos?: Todo[];
  };

  return useMutation<void, Error, number, DeleteTodoContext>(deleteTodo, {
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(todoKeys.lists());
      await queryClient.cancelQueries(todoKeys.detail(deletedId));

      // Snapshot all list caches
      const previousAllTodos = queryClient.getQueryData<Todo[]>(todoKeys.list());
      const previousActiveTodos = queryClient.getQueryData<Todo[]>(
        todoKeys.list({ completed: false })
      );
      const previousCompletedTodos = queryClient.getQueryData<Todo[]>(
        todoKeys.list({ completed: true })
      );

      // Optimistically remove the todo from all list caches
      const removeTodoFromArray = (todos: Todo[] | undefined): Todo[] | undefined => {
        if (!todos) return undefined;
        return todos.filter((todo) => todo.id !== deletedId);
      };

      queryClient.setQueryData<Todo[] | undefined>(todoKeys.list(), removeTodoFromArray);
      queryClient.setQueryData<Todo[] | undefined>(
        todoKeys.list({ completed: false }),
        removeTodoFromArray
      );
      queryClient.setQueryData<Todo[] | undefined>(
        todoKeys.list({ completed: true }),
        removeTodoFromArray
      );

      // Remove the individual todo from cache
      queryClient.removeQueries(todoKeys.detail(deletedId));

      // Return context for rollback
      return { previousAllTodos, previousActiveTodos, previousCompletedTodos };
    },
    onSuccess: () => {
      // Cache is already updated optimistically in onMutate
      // No need to refetch since delete was successful
    },
    onError: (error, deletedId, context) => {
      // Rollback on error
      if (context?.previousAllTodos) {
        queryClient.setQueryData(todoKeys.list(), context.previousAllTodos);
      }
      if (context?.previousActiveTodos) {
        queryClient.setQueryData(todoKeys.list({ completed: false }), context.previousActiveTodos);
      }
      if (context?.previousCompletedTodos) {
        queryClient.setQueryData(
          todoKeys.list({ completed: true }),
          context.previousCompletedTodos
        );
      }
      console.error(`Failed to delete todo ${deletedId}:`, error);
    },
  });
};

/**
 * Hook to toggle todo completion status
 */
export const useToggleTodo = () => {
  const updateTodo = useUpdateTodo();
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, number>(async (id: number) => {
    // Get the current todo from cache
    const currentTodo = queryClient.getQueryData<Todo>(todoKeys.detail(id));

    if (!currentTodo) {
      throw new Error(`Todo with id ${id} not found in cache`);
    }

    // Toggle the completed status
    return updateTodo.mutateAsync({
      id,
      data: { completed: !currentTodo.completed },
    });
  });
};
