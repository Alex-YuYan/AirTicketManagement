import React from 'react'
import { useState, useEffect } from 'react';
import Landing from './Pages/Landing';
import CustomerDashboard from './Pages/CustomerDashboard';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
    </Routes>
  )
};

export default App