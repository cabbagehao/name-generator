import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChineseApp from './ChineseApp';
import EnglishApp from './EnglishApp';
import { SharedNames } from './pages/SharedNames';
import { Profile } from './pages/Profile';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChineseApp />,
  },
  {
    path: "/en",
    element: <EnglishApp />,
  },
  {
    path: "/shared/:code",
    element: <SharedNames />,
  },
  {
    path: "/profile",
    element: <Profile />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);