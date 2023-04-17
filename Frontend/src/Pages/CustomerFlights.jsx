import React, { useEffect, useContext, useState } from 'react'
import axios from '../axios';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import CommentButton from '../Components/CommentButton';

const CustomerFlights = () => {
  const [flights, setFlights] = useState([])
  const navigate = useNavigate();

  const currentDate = new Date()

  useEffect(() => {
    const getFlights = async () => {
      try {
        const res = await axios.get('/customer/flights')
        if (res.data && res.data.success === false) {
          alert(res.data.error)
        } else {
          setFlights(res.data.flights)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getFlights()
  }, [])

  return (<div className="min-h-screen bg-gradient-to-tr from-amber-400 to-cyan-500 py-6 flex flex-col justify-center sm:py-12">
    <div className="relative w-2/3 mx-auto">
      <div className="relative px-4 my-auto bg-gray-100 shadow-lg sm:rounded-3xl sm:p-20">
      <div className="flex justify-center">
        <div className="cursor-pointer" onClick={() => navigate("/customerDashboard")}>
          <BiArrowBack className="text-3xl text-gray-800" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4 mx-auto">All Flights</h1>
      </div>
        {flights.map((flight, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <div className="flex justify-between items-start">
              <div className="text-xl font-semibold mb-2">
                {flight.airline_name} - {flight.flight_number}
              </div>
            </div>
            <div className="text-gray-600 mb-4">
              Ticket ID: {flight.id}
            </div>
            <div className="text-gray-600 mb-4">
              Departure: {flight.dept_airport} - {flight.dept_date_time}
            </div>
            <div className="text-gray-600 mb-4">
              Arrival: {flight.arrival_airport} - {flight.arrival_date_time}
            </div>
            <div className="text-gray-600 mb-4">
              Status: {flight.status}
            </div>
            <div className="text-gray-600 font-bold mb-4">
              Price: ${flight.price}
            </div>
            <div className="flex justify-end">
              {
                Date(flight.dept_date_time) > currentDate ?
                  <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md">
                    Cancel
                  </button>
                :
                  <CommentButton />
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}

export default CustomerFlights