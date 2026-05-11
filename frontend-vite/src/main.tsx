import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import PrivateRoom from './pages/PrivateRoom.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/p-room" element={<PrivateRoom />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
