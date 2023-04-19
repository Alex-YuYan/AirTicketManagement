import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { BiArrowBack } from 'react-icons/bi';

const AddFlight = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [deptDateTime, setDeptDateTime] = useState('');
  const [airplaneId, setAirplaneId] = useState('');
  const [arrivalDateTime, setArrivalDateTime] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [status, setStatus] = useState('');
  const [deptAirport, setDeptAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');

  const [airplaneIds, setAirplaneIds] = useState([]);
  const [departureAirports, setDepartureAirports] = useState([]);
  const [arrivalAirports, setArrivalAirports] = useState([]);

  const navigate = useNavigate();

  const sampleAirplaneIds = ['A1', 'A2', 'A3'];
  const sampleDepartureAirports = [
    { code: 'JFK', name: 'John F. Kennedy International Airport' },
    { code: 'LAX', name: 'Los Angeles International Airport' },
    { code: 'ORD', name: 'O\'Hare International Airport' },
  ];
  const sampleArrivalAirports = [
    { code: 'LHR', name: 'London Heathrow Airport' },
    { code: 'CDG', name: 'Charles de Gaulle Airport' },
    { code: 'AMS', name: 'Amsterdam Airport Schiphol' },
  ];

  useEffect(() => {
    const fetchAirplaneIds = async () => {
      try {
        // Replace with your API call
        const res = await axios.get('/api/airplanes');
        setAirplaneIds(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAirports = async () => {
      try {
        // Replace with your API call
        const res = await axios.get('/api/airports');
        setDepartureAirports(res.data);
        setArrivalAirports(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAirplaneIds();
    fetchAirports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      flightNumber,
      deptDateTime,
      airplaneId,
      arrivalDateTime,
      basePrice,
      status,
      deptAirport,
      arrivalAirport,
    });

    try {
      const res = await axios.post('/staff/flights', {
        flight_number: flightNumber,
        dept_date_time: deptDateTime,
        airplane_id: airplaneId,
        arrival_date_time: arrivalDateTime,
        base_price: basePrice,
        status,
        dept_airport: deptAirport,
        arrival_airport: arrivalAirport,
      });

      if (res.data && res.data.success === false) {
        alert(res.data.error);
      } else {
        alert('Flight added successfully!');
        navigate(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Replace the sample data with your API call
    setAirplaneIds(sampleAirplaneIds);
    setDepartureAirports(sampleDepartureAirports);
    setArrivalAirports(sampleArrivalAirports);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-400 to-green-400 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-2/3 mx-auto">
        <div className="relative px-4 my-auto bg-gray-100 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="flex justify-center">
            <div className="cursor-pointer" onClick={() => navigate('/staffDashboard')}>
              <BiArrowBack className="text-3xl text-gray-800" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 mx-auto">Add New Flight</h1>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Input field for flight_number */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="flightNumber">
                Flight Number
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="flightNumber"
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                required
              />
            </div>
            {/* Input field for dept_date_time */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deptDateTime">
                Departure Date & Time
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="deptDateTime"
                type="datetime-local"
                value={deptDateTime}
                onChange={(e) => setDeptDateTime(e.target.value)}
                required
              />
            </div>
            {/* Input field for arrival_date_time */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="arrivalDateTime">
                Arrival Date & Time
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="arrivalDateTime"
                type="datetime-local"
                value={arrivalDateTime}
                onChange={(e) => setArrivalDateTime(e.target.value)}
                required
              />
            </div>
            {/* Input field for base_price */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="basePrice">
                Base Price
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="basePrice"
                type="number"
                min="0"
                step="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
              />
            </div>
            {/* Dropdown menu for status */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select a status</option>
                <option value="on-time">On-time</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="airplaneId">
                Airplane ID
              </label>
              <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="airplaneId"
                value={airplaneId}
                onChange={(e) => setAirplaneId(e.target.value)}
                required
              >
                <option value="">Select an airplane</option>
                {airplaneIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>
            {/* Add similar input fields for other data */}
            {/* Example input field for dept_airport: */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deptAirport">
                Departure Airport
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="deptAirport"
                value={deptAirport}
                onChange={(e) => setDeptAirport(e.target.value)}
                required
              >
                <option value="">Select a departure airport</option>
                {departureAirports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>
            {/* Example input field for arrival_airport: */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="arrivalAirport">
                Arrival Airport
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="arrivalAirport"
                value={arrivalAirport}
                onChange={(e) => setArrivalAirport(e.target.value)}
                required
              >
                <option value="">Select an arrival airport</option>
                {arrivalAirports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>
            {/* Add the rest of the input fields */}
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add Flight
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFlight;