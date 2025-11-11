import React from 'react';
import { Paper, IconButton, Typography, Box, makeStyles } from '@material-ui/core';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.shape.borderRadius,
    gap: theme.spacing(1.5),
  },
  success: {
    backgroundColor: theme.palette.success.light + '30',
    color: theme.palette.success.dark,
    border: `1px solid ${theme.palette.success.main}`,
  },
  error: {
    backgroundColor: theme.palette.error.light + '30',
    color: theme.palette.error.dark,
    border: `1px solid ${theme.palette.error.main}`,
  },
  warning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    border: '1px solid #f59e0b',
  },
  info: {
    backgroundColor: theme.palette.primary.light + '30',
    color: theme.palette.primary.dark,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  icon: {
    fontSize: '1.5rem',
  },
  message: {
    flex: 1,
    fontWeight: 500,
  },
  closeButton: {
    padding: theme.spacing(0.5),
  },
}));

interface AlertProps {
  severity?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  children: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'standard';
  elevation?: number;
}

export const Alert: React.FC<AlertProps> = ({
  severity = 'info',
  onClose,
  children,
  elevation = 0,
}) => {
  const classes = useStyles();

  const icons = {
    success: <SuccessIcon className={classes.icon} />,
    error: <ErrorIcon className={classes.icon} />,
    warning: <WarningIcon className={classes.icon} />,
    info: <InfoIcon className={classes.icon} />,
  };

  return (
    <Paper className={`${classes.root} ${classes[severity]}`} elevation={elevation}>
      <Box>{icons[severity]}</Box>
      <Typography variant="body2" className={classes.message}>
        {children}
      </Typography>
      {onClose && (
        <IconButton size="small" onClick={onClose} className={classes.closeButton}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
};
