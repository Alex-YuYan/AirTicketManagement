import React, { useEffect, useState } from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaCaretRight, FaCaretDown, FaArrowRight } from 'react-icons/fa';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const StaffFlightStatusCard = ({ flight }) => {
  const [flightStatus, setFlightStatus] = useState(flight.status);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [ratingList, setRatingList] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const navigate = useNavigate();

  const currentDate = new Date();

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen && customerList.length === 0) {
      fetchCustomerList();
    }
  };

  const toggleDropdown2 = () => {
    setDropdown2Open(!dropdown2Open);
    if (!dropdown2Open && ratingList.length === 0) {
      fetchRatingList();
    }
  };

  const fetchCustomerList = async () => {
    try {
      const res = await axios.get('/staff/getAllCustomers',
        {
          params: {
            flight_number: flight.flight_number,
            dept_date_time: flight.dept_date_time,
          },
        });
      if (res.data && res.data.success === true) {
        setCustomerList(res.data.customers);
      } else {
        alert('Failed to fetch customer list.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRatingList = async () => {
    try {
      const res = await axios.get('/staff/getRatings', {
        params: {
          flight_number: flight.flight_number,
          dept_date_time: flight.dept_date_time,
        }
      })
      if (res.data && res.data.success === true) {
        setRatingList(res.data.ratings);
        if (res.data.avg_rating === -1) {
          setAvgRating('N/A');
        } else {
          setAvgRating(res.data.avg_rating + " / 5");
        }
      } else {
        alert('Failed to fetch rating list.');
      }
    } catch (error) {
      console.log(error);
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
      <div className="flex justify-start items-center mt-2 cursor-pointer" onClick={toggleDropdown}>
        {dropdownOpen ? <FaCaretDown /> : <FaCaretRight />}
        <p className="ml-1">Customer List</p>
      </div>
      {dropdownOpen && (
        <div className="mt-4 border-t border-gray-300 pt-4">
          <ul className="space-y-2">
            {customerList.map((customer, index) => (
              <li key={index} className="text-sm border-solid border-blue-600 border-2 rounded-md p-2 cursor-pointer mx-2" onClick={() => navigate("/staffViewRecord/" + customer.email)}>
                {customer.first_name} {customer.last_name} - purchased under {customer.email}
                <FaArrowRight className="float-right text-blue-700" />
              </li>
            ))}
          </ul>
        </div>
      )}
      {
        currentDate > new Date(flight.arrival_date_time) ?
          <div className="flex justify-start items-center mt-2 cursor-pointer" onClick={toggleDropdown2}>
            {dropdown2Open ? <FaCaretDown /> : <FaCaretRight />}
            <p className="ml-1">Comment & Rating List</p>
          </div>
          : null
      }
      {dropdown2Open && (
        <div className="mt-4 border-t border-gray-300 pt-4">
          <p className="text-lg font-semibold">Average Rating: {avgRating}</p>
          <ul className="space-y-2">
            {ratingList.map((rating, index) => (
              <li key={index} className="text-sm border-2 rounded-md p-2">
                <p className='text-blue-600 font-semibold'>{rating.email}</p>
                <p>Rating: {rating.rating} / 5</p>
                <p>Comment: {rating.comment} </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div >
  );
};

export default StaffFlightStatusCard;