import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from '@/App';
import { applyTheme, getSavedTheme } from '@/store/uiStore';
import '@/styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Bootstrap() {
  useEffect(() => {
    applyTheme(getSavedTheme());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-float)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)',
          },
        }}
      />
      {import.meta.env.VITE_ENABLE_DEVTOOLS === 'true' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>,
);
