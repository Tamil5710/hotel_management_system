import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AddHotelPage from './pages/AddHotelPage';
import EditHotelPage from './pages/EditHotelPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="hotels/new" element={<AddHotelPage />} />
        <Route path="hotels/:id" element={<HotelDetailsPage />} />
        <Route path="hotels/:id/edit" element={<EditHotelPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
