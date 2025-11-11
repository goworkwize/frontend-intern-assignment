import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  CircularProgress,
  Checkbox,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import { Search as SearchIcon, Close as CloseIcon } from '@material-ui/icons';
import { useTodos } from '../hooks';
import type { Todo } from '../hooks';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      width: '100%',
      maxWidth: 600,
      maxHeight: '80vh',
      margin: theme.spacing(2),
    },
  },
  searchBox: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  searchInput: {
    '& .MuiInputBase-root': {
      fontSize: '1.1rem',
    },
    '& .MuiInput-underline:before': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline:after': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: 'none',
    },
  },
  resultsContainer: {
    maxHeight: 400,
    overflow: 'auto',
  },
  resultItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  completedText: {
    textDecoration: 'line-through',
    color: theme.palette.text.secondary,
  },
  emptyState: {
    padding: theme.spacing(8, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  loadingContainer: {
    padding: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
  },
  hint: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.disabled,
    fontSize: '0.875rem',
  },
}));

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectTodo?: (todo: Todo) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({ open, onClose, onSelectTodo }) => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  const { data: results, isLoading } = useTodos(
    debouncedQuery ? { search: debouncedQuery } : undefined,
    { enabled: open }
  );

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setDebouncedQuery('');
    }
  }, [open]);

  const handleSelectTodo = (todo: Todo) => {
    onSelectTodo?.(todo);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className={classes.dialog} maxWidth="sm" fullWidth>
      <Box className={classes.searchBox}>
        <SearchIcon color="action" />
        <TextField
          autoFocus
          fullWidth
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={classes.searchInput}
        />
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent style={{ padding: 0 }}>
        {isLoading && debouncedQuery ? (
          <Box className={classes.loadingContainer}>
            <CircularProgress size={32} />
          </Box>
        ) : !debouncedQuery ? (
          <Box className={classes.hint}>
            <Typography variant="body2">Start typing to search todos...</Typography>
          </Box>
        ) : results && results.length > 0 ? (
          <List className={classes.resultsContainer}>
            {results.map((todo) => (
              <ListItem
                key={todo.id}
                button
                onClick={() => handleSelectTodo(todo)}
                className={classes.resultItem}
              >
                <Checkbox
                  edge="start"
                  checked={todo.completed}
                  tabIndex={-1}
                  disableRipple
                  disabled
                />
                <ListItemText
                  primary={
                    <Typography className={todo.completed ? classes.completedText : ''}>
                      {todo.title}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box className={classes.emptyState}>
            <Typography variant="body2">No todos found for "{debouncedQuery}"</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
