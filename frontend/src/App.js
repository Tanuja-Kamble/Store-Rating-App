// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StoreList from './pages/StoreList';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import OwnerDashboard from './pages/OwnerDashboard';
import Navbar from './components/Navbar';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
     <ToastContainer />
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stores" element={<StoreList />} />      
        <Route path="/stores"   element={
            <ProtectedRoute allowedRoles={['Normal User']}>
                <StoreList />
            </ProtectedRoute>
            }
        />
        
        <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['System Administrator']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>      
        <Route
  path="/owner"
  element={
    <ProtectedRoute allowedRoles={['Store Owner']}>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
