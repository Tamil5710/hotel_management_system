import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  );
};

export default MainLayout;
