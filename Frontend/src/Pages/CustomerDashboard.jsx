import React from 'react';
import { FaPlane, FaSearch, FaUser, FaStar, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-amber-400 to-cyan-500 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-2/3 mx-auto">
        <div className="relative px-4 my-auto bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="mx-auto">
            <h1 className="text-4xl text-center font-medium mb-10 -mt-6">Customer Dashboard</h1>
            <div className="flex justify-left -mb-16 ml-4">
              <div className="flex">
                <FaUser className="text-blue-800 w-10 h-10" />
                <h1 className="text-4xl font-medium marker:text-opacity-80 text-black ml-4">Welcome, John Doe!</h1>
              </div>
            </div>
            <div className="bg-cover bg-center h-96 mb-6 rounded-lg shadow-xl" style={{ backgroundImage: `url(https://cdn.plnspttrs.net/17043/d-abvm-lufthansa-boeing-747-430_PlanespottersNet_1208292_c45f636647_o.jpg)`}}></div>
            <div className="grid grid-cols-3 gap-6">
              <button className="bg-amber-100 p-6 rounded-lg flex items-center shadow-md">
                <FaPlane className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">My Flights</span>
              </button>
              <button className="bg-orange-100 p-6 rounded-lg flex items-center shadow-md">
                <FaSearch className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">Search / Booking</span>
              </button>
              <button className="bg-blue-100 p-6 rounded-lg flex items-center shadow-md">
                <FaUser className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">Profile</span>
              </button>
              <button className="bg-purple-100 p-6 rounded-lg flex items-center shadow-md">
                <FaStar className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">Rate Flights</span>
              </button>
              <button className="bg-emerald-100 p-6 rounded-lg flex items-center shadow-md">
                <FaMoneyBillWave className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">Spendings</span>
              </button>
              <button className="bg-gray-100 p-6 rounded-lg flex items-center shadow-md">
                <FaSignOutAlt className="text-gray-700 w-10 h-10" />
                <span className="text-xl font-bold ml-4">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard
