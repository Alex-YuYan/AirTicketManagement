import React from 'react'
import { useState, useEffect } from 'react';
import Landing from './Pages/Landing';
import CustomerDashboard from './Pages/CustomerDashboard';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './Auth/RequireAuth';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<RequireAuth />}>
        <Route path="/customerDashboard" element={<CustomerDashboard />} />
      </Route>
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  )
};

export default App