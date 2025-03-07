import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import Faq from './pages/Faq.tsx';
import ServicesInfo from './pages/ServicesInfo.tsx';
import About from './pages/About.tsx';
import Cta from './pages/Cta.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/faq',
    element: <Faq />
  },
  {
    path: '/services-info',
    element: <ServicesInfo />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/consultation',
    element: <Cta />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);