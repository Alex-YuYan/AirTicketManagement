import React, { useEffect, useState } from 'react';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const StaffFlightStatusCard = ({ flight }) => {
  const navigate = useNavigate();
  const [flightStatus, setFlightStatus] = useState(flight.status);

  const changeStatus = async () => {
    try {
      const res = await axios.post('/staff/changeFlightStatus', {
        flight_number: flight.flight_number,
        dept_date_time: flight.dept_date_time,
      });
      if (res.data && res.data.success === true) {
        alert('Flight status changed successfully!');
        setFlightStatus(res.data.status);
      } else {
        alert('Failed to change flight status.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="border border-gray-300 p-4 rounded-md shadow-md space-y-2 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{flight.airline_name} {flight.flight_number}</h2>
        <h2 className="text-xl font-semibold">{flight.airplane_id}</h2>
      </div>
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
      <div className="mt-4 flex justify-between items-center">
        <p className="text-lg"> Base Price: ${flight.base_price} </p>
        <button className={`text-lg font-semibold rounded-md p-1 px-2 text-white ${flightStatus === 'on-time' ? 'bg-green-600' : 'bg-red-600'}`} onClick={changeStatus}>
            Status: {flightStatus}
        </button>
      </div>
    </div >
  );
};

export default StaffFlightStatusCard;