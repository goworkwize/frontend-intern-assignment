import { useState, useEffect } from 'react';
import { Container, Box, Snackbar, Typography, makeStyles } from '@material-ui/core';
import { Alert } from './components/Alert';
import { Header, TodoInput, TodoList, SearchDialog } from './components';
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from './hooks';
import type { CreateTodoInput, Todo } from './hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    flex: 1,
  },
  footer: {
    padding: theme.spacing(2),
    textAlign: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  footerText: {
    fontSize: '0.75rem',
    color: theme.palette.text.disabled,
    '& kbd': {
      padding: '2px 6px',
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.action.hover,
      fontFamily: 'monospace',
      fontSize: '0.7rem',
    },
  },
}));

type FilterType = 'all' | 'active' | 'completed';

function App() {
  const classes = useStyles();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle cmd+k / ctrl+k keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Map filter to API parameter
  const filterParam =
    filter === 'active'
      ? { completed: false }
      : filter === 'completed'
        ? { completed: true }
        : undefined;

  // Fetch todos with backend filtering
  const { data: todos, isLoading, error } = useTodos(filterParam);

  // Mutations
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCreate = async (newTodo: CreateTodoInput) => {
    try {
      await createTodo.mutateAsync(newTodo);
      showSnackbar('Todo created successfully!', 'success');
    } catch (err) {
      showSnackbar('Failed to create todo', 'error');
      console.error('Failed to create todo:', err);
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      await updateTodo.mutateAsync({
        id,
        data: { completed: !completed },
      });
    } catch (err) {
      showSnackbar('Failed to update todo', 'error');
      console.error('Failed to toggle todo:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo.mutateAsync(id);
      showSnackbar('Todo deleted successfully!', 'success');
    } catch (err) {
      showSnackbar('Failed to delete todo', 'error');
      console.error('Failed to delete todo:', err);
    }
  };

  const handleSelectTodo = async (todo: Todo) => {
    // Toggle the todo's completed status
    try {
      await updateTodo.mutateAsync({
        id: todo.id,
        data: { completed: !todo.completed },
      });
      showSnackbar(
        `Marked "${todo.title}" as ${!todo.completed ? 'completed' : 'active'}`,
        'success'
      );
    } catch (err) {
      showSnackbar('Failed to update todo', 'error');
      console.error('Failed to toggle todo:', err);
    }
  };

  return (
    <Box className={classes.root}>
      <Header />

      <Container maxWidth="md" className={classes.container}>
        <TodoInput onCreate={handleCreate} isCreating={createTodo.isLoading} />

        <TodoList
          todos={todos}
          isLoading={isLoading}
          error={error}
          onToggle={handleToggle}
          onDelete={handleDelete}
          deletingId={deleteTodo.isLoading ? deleteTodo.variables : undefined}
          updatingId={updateTodo.isLoading ? updateTodo.variables?.id : undefined}
          filter={filter}
          onFilterChange={setFilter}
        />
      </Container>

      <Box className={classes.footer}>
        <Typography className={classes.footerText}>
          Press <kbd>⌘K</kbd> or <kbd>Ctrl+K</kbd> to search
        </Typography>
      </Box>

      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTodo={handleSelectTodo}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
