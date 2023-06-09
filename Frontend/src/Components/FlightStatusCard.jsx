import React from 'react';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';

const FlightStatusCard = ({ flight }) => {
  return (
    <div className="border border-gray-300 p-4 rounded-md shadow-md space-y-2">
      <h2 className="text-xl font-semibold">{flight.airline_name} {flight.flight_number}</h2>
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FaPlaneDeparture />
            <p>{flight.dept_airport}</p>
          </div>
          <p className="text-sm text-gray-600">{flight.dept_date_time}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FaPlaneArrival />
            <p>{flight.arrival_airport}</p>
          </div>
          <p className="text-sm text-gray-600">{flight.arrival_date_time}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-center items-center">
        <p className={`text - lg font-bold ${flight.status === 'on-time' ? 'text-green-600' : 'text-red-600'}`}>
          Status: {flight.status}
        </p>
      </div>
    </div >
  );
};

export default FlightStatusCard;