import React from 'react'
import { useState, useEffect } from 'react';
import Landing from './Pages/Landing';
import CustomerDashboard from './Pages/CustomerDashboard';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './Auth/RequireAuth';
import NotFound from './Pages/NotFound';
import FlightSearch from './Pages/FlightSearch';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/publicSearch" element={<FlightSearch />} />
      <Route element={<RequireAuth />}>
        <Route path="/customerDashboard" element={<CustomerDashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
};

export default App;