import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { ThemeProviderWrapper, createAppTheme, useThemeMode } from './ThemeContext';
import App from './App.tsx';

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000, // 30 seconds - reasonable for real API
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
function ThemedApp() {
  const { mode } = useThemeMode();
  const theme = createAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  return (
    <ThemeProviderWrapper>
      <ThemedApp />
    </ThemeProviderWrapper>
  );
}

ReactDOM.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById('root')
);
