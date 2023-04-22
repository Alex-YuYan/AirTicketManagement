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
import StaffDashboard from './Pages/StaffDashboard';
import StaffFlights from './Pages/StaffFlights';
import StaffAirports from './Pages/StaffAirports';
import StaffAirplane from './Pages/StaffAirplane';
import StaffAddFlight from './Pages/StaffAddFlight';
import StaffFreqCustomer from './Pages/StaffFreqCustomer';

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
        <Route path='/staffDashboard' element={<StaffDashboard />} />
        <Route path='/staffFlights' element={<StaffFlights />} />
        <Route path='/staffAirports' element={<StaffAirports />} />
        <Route path='/staffAirplane' element={<StaffAirplane />} />
        <Route path='/staffAddFlight' element={<StaffAddFlight />} />
        <Route path='/staffFreqCustomer' element={<StaffFreqCustomer />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
};

export default App;