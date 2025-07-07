import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { StoreProvider } from './hooks/useGlobalReducer';
import { BackendURL } from './components/BackendURL';


const Main = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (!backendUrl || backendUrl === '') {
    return (
      <React.StrictMode>
        <BackendURL />
      </React.StrictMode>
    );
  }

  return (
    <React.StrictMode>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </React.StrictMode>
  );
};

// Guard to prevent double `createRoot` execution (especially in Vite HMR)
const rootElement = document.getElementById('root');
if (!rootElement._reactRootContainer) {
  ReactDOM.createRoot(rootElement).render(<Main />);
}
