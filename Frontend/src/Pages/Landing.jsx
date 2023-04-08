import React from 'react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
      <div className="bg-white p-12 rounded-lg shadow-md w-11/12 md:w-2/4 lg:w-1/3">
        <h1 className="text-4xl font-bold mb-8 text-center">Flight Management App</h1>
        <form className="space-y-6">
          <div>
            <label htmlFor="origin" className="block text-gray-700 font-semibold">
              Origin
            </label>
            <input
              type="text"
              id="origin"
              className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-gray-700 font-semibold">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="w-1/2">
              <label htmlFor="departure" className="block text-gray-700 font-semibold">
                Departure
              </label>
              <input
                type="date"
                id="departure"
                className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="return" className="block text-gray-700 font-semibold">
                Return
              </label>
              <input
                type="date"
                id="return"
                className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search Flights
          </button>
        </form>
      </div>
    </div>
  );
};

export default Landing;
