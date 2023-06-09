import React, { useState, useContext, useEffect } from 'react';
import { Menu, Tab } from '@headlessui/react';
import { IoSearch } from 'react-icons/io5';
import { BiArrowBack } from 'react-icons/bi';
import axios from '../axios';
import FlightCard from '../Components/FlightCard';
import { useNavigate } from 'react-router-dom';
import FlightStatusCard from '../Components/FlightStatusCard';

const PublicSearch = () => {
  const currentDate = new Date();
  const minDate = currentDate.toISOString().split('T')[0];

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(currentDate.toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(currentDate.toISOString().split('T')[0]);
  const [tripType, setTripType] = useState('one-way');
  const [airlineName, setAirlineName] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [statusDate, setStatusDate] = useState('');
  const [flightsData, setFlightsData] = useState([]);
  const [searched, setSearched] = useState(false);
  const [returnFlightsData, setReturnFlightsData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [departureAirports, setDepartureAirports] = useState([]);
  const [arrivalAirports, setArrivalAirports] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleSearch = async () => {
    if (tripType === 'one-way') {
      try {
        const response = await axios.get('/search/one-way', {
          params: {
            dept_airport: source,
            arrival_airport: destination,
            dept_date: departureDate
          }
        });
        if (response.data.success === true) {
          setFlightsData(response.data.flights);
          setSearched(true);
        } else {
          alert(response.data.error);
          setSearched(true);
          setFlightsData([]);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.get('/search/round-trip', {
          params: {
            dept_airport: source,
            arrival_airport: destination,
            dept_date: departureDate,
            return_date: returnDate
          }
        });
        if (response.data.success === true) {
          setFlightsData(response.data.dept_flights);
          setReturnFlightsData(response.data.return_flights);
          setSearched(true);
        } else {
          alert(response.data.error);
          setSearched(true);
          setFlightsData([]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFlightStatus = async () => {
    console.log(airlineName, flightNumber, statusDate);

    try {
      const response = await axios.get('/search/status', {
        params: {
          airline_name: airlineName,
          flight_number: flightNumber,
          dept_date_time: statusDate,
        },
      });
      if (response.data.success === true) {
        setStatusData(response.data.flights);
      } else {
        alert(response.data.error);
        setStatusData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-white py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-2/3 mx-auto">
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="flex justify-center">
            <div className="cursor-pointer" onClick={() => navigate("/customerDashboard")}>
              <BiArrowBack className="text-3xl text-gray-800" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 mx-auto">Flight Search</h1>
          </div>
          <Tab.Group>
            <Tab.List className="flex p-1 space-x-0 bg-green-500 rounded-full text-xl">
              <Tab
                className={({ selected }) =>
                  selected
                    ? 'bg-white rounded-full text-black w-1/2 text-center'
                    : 'text-white hover:text-amber-100 w-1/2 text-center'
                }
              >
                Search Future Flight
              </Tab>
              <Tab
                className={({ selected }) =>
                  selected
                    ? 'bg-white rounded-full text-black w-1/2 text-center'
                    : 'text-white hover:text-amber-100 w-1/2 text-center'
                }
              >
                Check Flight Status
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <Menu as="div" className="relative inline-block text-left mt-5">
                  <div className="flex items-center">
                    <h2 className="w-20">Trip Type:</h2>
                    <Menu.Button className="w-32 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-bluee-600 focus:outline-none">
                      {tripType}
                    </Menu.Button>
                  </div>
                  <Menu.Items className="absolute left-0 w-56 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                            } block px-4 py-2 text-sm w-full`}
                          onClick={() => setTripType('one-way')}
                        >
                          One Way
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                            } block px-4 py-2 text-sm w-full`}
                          onClick={() => setTripType('round-trip')}
                        >
                          Round Trip
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
                <form>
                  <div className="mt-4 grid grid-cols-2 gap-4">
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
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md"
                      min={minDate}
                      required={true}
                    />
                    {tripType === 'round-trip' && (
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md"
                        min={departureDate || minDate}
                        required={true}
                      />
                    )}
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md flex justify-center items-center hover:bg-blue-600"
                    type='button'
                  >
                    <IoSearch className="mr-2" />
                    Search Flights
                  </button>
                </form>
                {
                  tripType === 'one-way' && flightsData.length > 0 ?
                    <div className="container mx-auto p-4">
                      <h1 className="text-3xl font-bold mb-6">Flights</h1>
                      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
                        {flightsData.map((flight, index) => (
                          <FlightCard key={index} flight={flight} />
                        ))}
                      </div>
                    </div>
                    : tripType === 'one-way' && searched && <h1 className="text-2xl font-bold mt-4 text-red-500">No One-way Flights Found for Given Information</h1>
                }
                {
                  tripType === 'round-trip' && flightsData.length > 0 && returnFlightsData.length > 0 ? (
                    <div className="container mx-auto p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <h1 className="text-3xl font-bold mb-6">Departing Flights</h1>
                          <div className="grid grid-cols-1 gap-4">
                            {flightsData.map((flight, index) => (
                              <FlightCard key={index} flight={flight} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold mb-6 mt-8 lg:mt-0">Returning Flights</h1>
                          <div className="grid grid-cols-1 gap-4">
                            {returnFlightsData.map((flight, index) => (
                              <FlightCard key={index} flight={flight} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    tripType === 'round-trip' &&
                    searched && (
                      <h1 className="text-2xl font-bold mt-4 text-red-500">
                        No Round-Trip Flights Found for Given Information
                      </h1>
                    )
                  )
                }

              </Tab.Panel>
              <Tab.Panel>
                <div className="mt-8">
                  <form>
                    <div className="grid grid-cols-3 gap-4 mt-5">
                      <input
                        type="text"
                        placeholder="Airline Name"
                        value={airlineName}
                        onChange={(e) => setAirlineName(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md"
                        required={true}
                      />
                      <input
                        type="text"
                        placeholder="Flight Number"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md"
                        required={true}
                      />
                      <input
                        type="date"
                        value={statusDate}
                        onChange={(e) => setStatusDate(e.target.value)}
                        min={minDate}
                        className="border border-gray-300 p-2 rounded-md"
                        required={true}
                      />
                    </div>
                    <button
                      onClick={handleFlightStatus}
                      className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md flex justify-center items-center hover:bg-blue-600"
                      type='button'
                    >
                      <IoSearch className="mr-2" />
                      Check Status
                    </button>
                  </form>
                </div>
                {statusData.length > 0 ? (
                  <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-6">Flight Status</h1>
                    <div className="grid grid-cols-1 gap-4">
                      {statusData.map((flightStatus, index) => (
                        <FlightStatusCard key={index} flight={flightStatus} />
                      ))}
                    </div>
                  </div>
                ) : (
                  searched && (
                    <h1 className="text-2xl font-bold mt-4 text-red-500">
                      No Flight Status Found for Given Information
                    </h1>
                  )
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default PublicSearch;