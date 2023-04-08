import React from 'react'
import { useState, useEffect } from 'react';
import Landing from './Pages/Landing';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  )
};

export default App