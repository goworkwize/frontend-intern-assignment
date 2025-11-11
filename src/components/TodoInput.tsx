import React, { useState } from 'react';
import { Paper, TextField, Button, makeStyles, CircularProgress } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import type { CreateTodoInput } from '../hooks';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  form: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'flex-start',
  },
  textField: {
    flex: 1,
  },
  button: {
    height: 56,
    minWidth: 120,
  },
}));

interface TodoInputProps {
  onCreate: (todo: CreateTodoInput) => Promise<void>;
  isCreating?: boolean;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onCreate, isCreating = false }) => {
  const classes = useStyles();
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const newTodo: CreateTodoInput = {
      userId: 1,
      title: title.trim(),
      completed: false,
    };

    try {
      await onCreate(newTodo);
      setTitle('');
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  return (
    <Paper className={classes.paper} elevation={2}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          className={classes.textField}
          label="Add a new todo"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={isCreating}
          autoFocus
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isCreating || !title.trim()}
          className={classes.button}
          startIcon={isCreating ? <CircularProgress size={20} /> : <AddIcon />}
        >
          {isCreating ? 'Adding...' : 'Add Todo'}
        </Button>
      </form>
    </Paper>
  );
};
