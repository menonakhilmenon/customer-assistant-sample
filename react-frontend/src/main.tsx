import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import Products from './Products.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>
  },
  {
    path: '/products',
    element: <Products></Products>
  }
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
