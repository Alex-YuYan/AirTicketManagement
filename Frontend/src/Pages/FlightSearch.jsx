import React, { useEffect, useState } from 'react';
import { Menu, Tab } from '@headlessui/react';
import { IoSearch } from 'react-icons/io5';

const FlightSearch = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState('one-way');
  const [airlineName, setAirlineName] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [statusDate, setStatusDate] = useState('');

  const currentDate = new Date();
  const minDate = currentDate.toISOString().split('T')[0];

  const checkDates = useEffect(() => {
    if (departureDate < minDate) {
      setDepartureDate(minDate);
    } else if (departureDate > returnDate) {
      setReturnDate(departureDate);
    } else if (returnDate < minDate) {
      setReturnDate(minDate);
    }
  }, [departureDate, returnDate]);

  const handleSearch = () => {
    console.log(source, destination, departureDate, returnDate, tripType);
  };

  const handleFlightStatus = () => {
    console.log(airlineName, flightNumber, statusDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-amber-400 to-cyan-500 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-2/3 mx-auto">
        <div className="bg-white p-6 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Flight Search</h1>
          <Tab.Group>
            <Tab.List className="flex p-1 space-x-0 bg-green-500 rounded-full text-xl">
              <Tab
                className={({ selected }) =>
                  selected
                    ? 'bg-white rounded-full text-amber-500 w-1/2 text-center'
                    : 'text-white hover:text-amber-400 w-1/2 text-center'
                }
              >
                Search Future Flight
              </Tab>
              <Tab
                className={({ selected }) =>
                  selected
                    ? 'bg-white rounded-full text-amber-500 w-1/2 text-center'
                    : 'text-white hover:text-amber-400 w-1/2 text-center'
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
                    <Menu.Button className="w-32 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 focus:outline-none">
                      {tripType}
                    </Menu.Button>
                  </div>
                  <Menu.Items className="absolute left-0 w-56 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active ? 'bg-amber-500 text-white' : 'text-gray-900'
                            } block px-4 py-2 text-sm`}
                          onClick={() => setTripType('one-way')}
                        >
                          One Way
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active ? 'bg-amber-500 text-white' : 'text-gray-900'
                            } block px-4 py-2 text-sm`}
                          onClick={() => setTripType('round-trip')}
                        >
                          Round Trip
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md"
                  />
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md"
                    min={minDate}
                  />
                  {tripType === 'round-trip' && (
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md"
                      min={departureDate || minDate}
                    />
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full mt-4 p-2 bg-amber-500 text-white rounded-md flex justify-center items-center hover:bg-amber-600"
                >
                  <IoSearch className="mr-2" />
                  Search Flights
                </button>
              </Tab.Panel>
              <Tab.Panel>
                <div className="mt-8">
                  <div className="grid grid-cols-3 gap-4 mt-5">
                    <input
                      type="text"
                      placeholder="Airline Name"
                      value={airlineName}
                      onChange={(e) => setAirlineName(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Flight Number"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md"
                    />
                    <input
                      type="date"
                      value={statusDate}
                      onChange={(e) => setStatusDate(e.target.value)}
                      min={minDate}
                      className="border border-gray-300 p-2 rounded-md"
                    />
                  </div>
                  <button
                    onClick={handleFlightStatus}
                    className="w-full mt-4 p-2 bg-amber-500 text-white rounded-md flex justify-center items-center hover:bg-amber-600"
                  >
                    <IoSearch className="mr-2" />
                    Check Status
                  </button>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;