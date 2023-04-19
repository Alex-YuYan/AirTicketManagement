import React from 'react'
import { useState, useEffect } from 'react';
import Landing from './Pages/Landing';
import CustomerDashboard from './Pages/CustomerDashboard';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './Auth/RequireAuth';
import NotFound from './Pages/NotFound';
import CustomerFlights from './Pages/CustomerFlights';
import PublicSearch from './Pages/PublicSearch';
import CustomerSearch from './Pages/CustomerSearch';
import CustomerSpending from './Pages/CustomerSpending';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/publicSearch" element={<PublicSearch />} />
      <Route element={<RequireAuth />}>
        <Route path="/customerDashboard" element={<CustomerDashboard />} />
        <Route path="/customerFlights" element={<CustomerFlights />} />
        <Route path='/customerSearch' element={<CustomerSearch />} />
        <Route path='/customerSpending' element={<CustomerSpending />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
};

export default App;