import React from 'react';
import { FaPlane, FaSearch, FaUser, FaStar, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';
import { useState, useContext } from 'react'
import { Dialog } from '@headlessui/react'
import AuthContext from '../Auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const StaffDashboard = () => {
  let [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();
  const { setLoggedIn, userFirstName, userLastName } = useContext(AuthContext);

  const handleLogout = async () => {
    const res = await axios.post("/customer/logout");
    if (res.data && res.data.success === true) {
      setLoggedIn(false);
      setIsOpen(false);
      alert('You have been logged out.');
      nav('/');
    } else {
      alert('Something went wrong.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-amber-400 to-cyan-500 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-2/3 mx-auto">
        <div className="relative px-4 my-auto bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="mx-auto">
            <div className="flex justify-left -mb-16 ml-4">
              <div className="flex">
                <FaUser className="text-blue-800 w-10 h-10" />
                <h1 className="text-4xl font-medium marker:text-opacity-80 text-black ml-4">Welcome, {userFirstName} {userLastName}!</h1>
              </div>
            </div>
            <div className="bg-cover bg-center h-96 mb-6 rounded-lg shadow-xl" style={{ backgroundImage: `url(https://cdn.plnspttrs.net/17043/d-abvm-lufthansa-boeing-747-430_PlanespottersNet_1208292_c45f636647_o.jpg)` }}></div>
            <div className="grid grid-cols-3 gap-6">
              <button className="bg-amber-100 hover:bg-amber-200 p-6 rounded-lg flex items-center shadow-md">
                <FaPlane className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">My Flights</span>
              </button>
              <button className="bg-orange-100 hover:bg-orange-200 p-6 rounded-lg flex items-center shadow-md">
                <FaSearch className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">Search / Booking</span>
              </button>
              <button className="bg-blue-100 hover:bg-blue-200 p-6 rounded-lg flex items-center shadow-md">
                <FaUser className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">Profile</span>
              </button>
              <button className="bg-purple-100 hover:bg-purple-200 p-6 rounded-lg flex items-center shadow-md">
                <FaStar className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">Rate Flights</span>
              </button>
              <button className="bg-emerald-100 hover:bg-emerald-200 p-6 rounded-lg flex items-center shadow-md">
                <FaMoneyBillWave className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">Spendings</span>
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg flex items-center shadow-md" onClick={() => setIsOpen(true)}>
                <FaSignOutAlt className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Dialog as="div" className="relative z-50" open={isOpen} onClose={()=>{}}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white shadow-lg">
            <div className="p-6">
              <Dialog.Title className="text-2xl font-semibold mb-4">Log Out</Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-6">
                Log Out Confirmation
              </Dialog.Description>

              <div className="flex justify-end space-x-4">
                <button
                  className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition-colors duration-200"
                  onClick={() => handleLogout()}
                >
                  Yes, log me out
                </button>
                <button
                  className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-400 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  No, stay logged in
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default StaffDashboard
