import React from 'react';
import {
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Typography,
  Box,
  makeStyles,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import type { Todo } from '../hooks';

const useStyles = makeStyles((theme) => ({
  card: {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  },
  completedCard: {
    backgroundColor: theme.palette.grey[50],
    opacity: 0.8,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  },
  checkbox: {
    padding: theme.spacing(1),
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    wordBreak: 'break-word',
    transition: 'all 0.2s ease',
  },
  completedTitle: {
    textDecoration: 'line-through',
    color: theme.palette.text.secondary,
  },
  deleteButton: {
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.light + '20',
    },
  },
}));

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  isDeleting = false,
  isUpdating = false,
}) => {
  const classes = useStyles();

  return (
    <Card
      className={`${classes.card} ${todo.completed ? classes.completedCard : ''}`}
      elevation={1}
    >
      <CardContent className={classes.content}>
        <Checkbox
          checked={todo.completed}
          onChange={() => onToggle(todo.id, todo.completed)}
          disabled={isUpdating}
          color="primary"
          className={classes.checkbox}
        />

        <Box className={classes.textContainer}>
          <Typography
            variant="body1"
            className={`${classes.title} ${todo.completed ? classes.completedTitle : ''}`}
          >
            {todo.title}
          </Typography>
        </Box>

        <IconButton
          onClick={() => onDelete(todo.id)}
          disabled={isDeleting}
          className={classes.deleteButton}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};
