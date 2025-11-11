import React from 'react';
import { Box, Typography, CircularProgress, makeStyles, Paper, Tabs, Tab } from '@material-ui/core';
import type { Todo } from '../hooks';
import { TodoItem } from './TodoItem';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(8, 2),
    color: theme.palette.text.secondary,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(8, 2),
  },
  errorContainer: {
    textAlign: 'center',
    padding: theme.spacing(4, 2),
    color: theme.palette.error.main,
  },
  stats: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  stat: {
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main + '10',
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  filterTabs: {
    marginBottom: theme.spacing(2),
  },
}));

interface TodoListProps {
  todos?: Todo[];
  isLoading?: boolean;
  error?: Error | null;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  deletingId?: number;
  updatingId?: number;
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos = [],
  isLoading = false,
  error = null,
  onToggle,
  onDelete,
  deletingId,
  updatingId,
  filter,
  onFilterChange,
}) => {
  const classes = useStyles();

  // Backend already filtered, just limit display
  const displayTodos = todos.slice(0, 20);

  const stats = React.useMemo(() => {
    const count = todos.length;
    // For filtered views, just show the count
    // For "all" view, we'd need separate queries to get accurate counts
    // For now, just show the count of current filter
    return { count, filter };
  }, [todos.length, filter]);

  if (isLoading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={classes.errorContainer}>
        <Typography variant="h6" gutterBottom>
          Error loading todos
        </Typography>
        <Typography variant="body2">{error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box className={classes.header}>
        <Typography variant="h5">My Todos</Typography>
        <Box className={classes.stats}>
          <Typography variant="body2" className={classes.stat}>
            {stats.filter === 'all' && `Total: ${stats.count}`}
            {stats.filter === 'active' && `Active: ${stats.count}`}
            {stats.filter === 'completed' && `Completed: ${stats.count}`}
          </Typography>
        </Box>
      </Box>

      <Paper className={classes.filterTabs}>
        <Tabs
          value={filter}
          onChange={(_, newValue) => onFilterChange(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All" value="all" />
          <Tab label="Active" value="active" />
          <Tab label="Completed" value="completed" />
        </Tabs>
      </Paper>

      {displayTodos.length === 0 ? (
        <Box className={classes.emptyState}>
          <Typography variant="h6" gutterBottom>
            {filter === 'all' ? 'No todos yet' : `No ${filter} todos`}
          </Typography>
          <Typography variant="body2">
            {filter === 'all'
              ? 'Add a new todo to get started!'
              : `You don't have any ${filter} todos.`}
          </Typography>
        </Box>
      ) : (
        <Box className={classes.container}>
          {displayTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              isDeleting={deletingId === todo.id}
              isUpdating={updatingId === todo.id}
            />
          ))}
          {todos.length > 20 && (
            <Typography variant="body2" color="textSecondary" align="center">
              Showing 20 of {todos.length} todos
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
