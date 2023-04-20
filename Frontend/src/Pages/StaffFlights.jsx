import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import StaffFlightStatusCard from '../Components/StaffFlightStatusCard';

const StaffFlights = () => {
  const currentDate = new Date();
  const aMonthFromNow = new Date(new Date().setMonth(currentDate.getMonth() + 1));

  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [startDate, setStartDate] = useState(currentDate.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(aMonthFromNow.toISOString().split('T')[0]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const [departureAirports, setDepartureAirports] = useState([]);
  const [arrivalAirports, setArrivalAirports] = useState([]);

  useEffect(() => {
    const getFlights = async () => {
      try {
        const res = await axios.get('/staff/flights', {
          params: {
            start_date: startDate,
            end_date: endDate,
            source,
            destination,
          },
        });
        if (res.data && res.data.success === false) {
          alert(res.data.error);
        } else {
          setFlights(res.data.flights);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAirports = async () => {
      try {
        const res = await axios.get('/list/airports');
        if (res.data && res.data.success === false) {
          alert(res.data.error);
        } else {
          setDepartureAirports(res.data.airports);
          setArrivalAirports(res.data.airports);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAirports();
    getFlights();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get('/staff/flights', {
        params: {
          start_date: startDate,
          end_date: endDate,
          source,
          destination,
        },
      });
      if (res.data && res.data.success === false) {
        alert(res.data.error);
      } else {
        setFlights(res.data.flights);
        if (res.data.flights.length === 0) {
          alert('No matching flights found!');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-400 to-green-400 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-2/3 mx-auto">
        <div className="relative px-4 my-auto bg-gray-100 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="flex justify-center">
            <div className="cursor-pointer" onClick={() => navigate('/staffDashboard')}>
              <BiArrowBack className="text-3xl text-gray-800" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 mx-auto">View Company's Flights</h1>
          </div>
          <div className='grid grid-cols-2 gap-1'>
            <input
              type="date"
              className="border rounded p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <input
              type="date"
              className="border rounded p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
            <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="deptAirport"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              >
                <option value="">Select a departure airport</option>
                {departureAirports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
            </select>
            <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="destAirport"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              >
                <option value="">Select a destination airport</option>
                {departureAirports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
            </select>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full" onClick={handleSearch}> Search </button>
          {flights.map((flight, index) => (
            <StaffFlightStatusCard flight={flight} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffFlights;
