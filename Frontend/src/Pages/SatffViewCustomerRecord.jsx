import React, { useEffect, useContext, useState } from 'react'
import axios from '../axios';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router-dom';

const SatffViewCustomerRecord = () => {
  const [flights, setFlights] = useState([])
  const navigate = useNavigate();
  const { email } = useParams();

  useEffect(() => {
    const getFlights = async () => {
      try {
        const res = await axios.get('/staff/getCustomerRecord', {
          params: {
            email: email
          }
        })
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


  return (<div className="min-h-screen bg-gradient-to-b from-white to-cyan-600 py-6 flex flex-col justify-center sm:py-12">
    <div className="relative w-2/3 mx-auto">
      <div className="relative px-4 my-auto bg-gray-100 shadow-lg sm:rounded-3xl sm:p-20">
      <div className="flex justify-center">
        <div className="cursor-pointer" onClick={() => navigate("/staffDashboard")}>
          <BiArrowBack className="text-3xl text-gray-800" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4 mx-auto">All Tickets Purchased Under <span className='text-blue-600'>{email}</span></h1>
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
              <div className="text-lg font-semibold mb-2">
                Purchased for: {flight.first_name} {flight.last_name}
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
            <div className="text-gray-600 font-bold">
              Price: ${flight.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}

export default SatffViewCustomerRecord