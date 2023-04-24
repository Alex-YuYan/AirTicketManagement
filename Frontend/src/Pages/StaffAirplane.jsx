import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { BiArrowBack } from 'react-icons/bi';

const StaffAirplane = () => {
  const [airplaneId, setAirplaneId] = useState('');
  const [numSeats, setNumSeats] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [manufactureDate, setManufactureDate] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ airplaneId, numSeats, manufacturer, manufactureDate });
    if (!airplaneId || !numSeats || !manufacturer || !manufactureDate) {
      alert('Please fill in all fields');
      return;
    }
    if (isNaN(numSeats)) {
      alert('Number of seats must be a number');
      return;
    }
    if (numSeats < 0) {
      alert('Number of seats must be greater than 0');
      return;
    }
    if (new Date(manufactureDate) > new Date()) {
      alert('Manufacture date cannot be in the future');
      return;
    }
    try {
      const res = await axios.post('/staff/airplane', {
        airplane_id: airplaneId,
        num_seat: numSeats,
        manufacturer,
        manufacture_date: manufactureDate,
      });
      if (res.data && res.data.success === false) {
        alert(res.data.error);
      } else {
        alert('Airplane added successfully!');
        navigate(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-emerald-400 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-2/3 mx-auto">
        <div className="relative px-4 my-auto bg-gray-100 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="flex justify-center">
            <div className="cursor-pointer" onClick={() => navigate('/staffDashboard')}>
              <BiArrowBack className="text-3xl text-gray-800" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 mx-auto">Add New Airplane</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="airplaneId">
                Airplane ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="airplaneId"
                type="text"
                value={airplaneId}
                onChange={(e) => setAirplaneId(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numSeats">
                Number of Seats
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="numSeats"
                type="number"
                value={numSeats}
                onChange={(e) => setNumSeats(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manufacturer">
                Manufacturer
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="manufacturer"
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manufactureDate">
                Manufacture Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="manufactureDate"
                type="date"
                value={manufactureDate}
                onChange={(e) => setManufactureDate(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add Airplane
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffAirplane;
