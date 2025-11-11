import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  makeStyles,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import {
  CheckCircle as CheckCircleIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@material-ui/icons';
import { useThemeMode } from '../ThemeContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  icon: {
    fontSize: '2rem',
  },
  themeButton: {
    color: theme.palette.primary.contrastText,
  },
}));

export const Header: React.FC = () => {
  const classes = useStyles();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar position="static" className={classes.appBar} elevation={0}>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.titleContainer}>
          <CheckCircleIcon className={classes.icon} />
          <Typography variant="h5" component="h1">
            Todo App
          </Typography>
        </Box>
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton onClick={toggleTheme} className={classes.themeButton} edge="end">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
