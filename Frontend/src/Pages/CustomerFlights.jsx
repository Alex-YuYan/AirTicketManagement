import React, { useEffect, useContext, useState } from 'react'
import axios from '../axios';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import CommentButton from '../Components/CommentButton';

const CustomerFlights = () => {
  const currentDate = new Date()
  const [flights, setFlights] = useState([])
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();


  const getFlights = async () => {
    try {
      const res = await axios.get('/customer/flights', {
        params: {
          start_date: startDate,
          end_date: endDate,
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

  useEffect(() => {
    getFlights()
  }, [])

  const handleCancel = async (flight) => {
    try {
      const params = {
        id: flight.id
      }
      const res = await axios.post('/customer/cancel', params)
      if (res.data && res.data.success === true) {
        alert("Successfully cancelled flight")
        navigate(0)
      } else {
        alert(res.data.message)
      }
    }
    catch (error) {
      console.error(error)
    }
  }


  return (<div className="min-h-screen bg-gradient-to-b from-sky-400 to-white py-6 flex flex-col justify-center sm:py-12">
    <div className="relative w-2/3 mx-auto">
      <div className="relative px-4 my-auto bg-gray-100 shadow-lg sm:rounded-3xl sm:p-20">
        <div className="flex justify-center">
          <div className="cursor-pointer" onClick={() => navigate("/customerDashboard")}>
            <BiArrowBack className="text-3xl text-gray-800" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4 mx-auto">All Flights</h1>
        </div>
        <div className="flex justify-center mb-4">
          <input
            type="date"
            className="border rounded p-2 mx-2 w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <input
            type="date"
            className="border rounded p-2 mx-2 w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-10 w-full" onClick={getFlights}> Search </button>
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
            <div className="text-gray-600 font-bold mb-4">
              Price: ${flight.price}
            </div>
            <div className="flex justify-end">
              {
                new Date(flight.dept_date_time) > currentDate ?
                  <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md" onClick={() => handleCancel(flight)}>
                    Cancel
                  </button>
                  :
                  <CommentButton flight={flight} />
              }
            </div>
          </div>
        ))}
        {
          flights.length === 0 && <h1 className="text-2xl font-bold text-red-500 mt-4 mx-auto">No flights matching query (default showing future flights)</h1>
        }
      </div>
    </div>
  </div>
  );
}

export default CustomerFlights