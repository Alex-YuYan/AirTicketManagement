import React, { useState, useEffect } from 'react';
import { BiArrowBack, BiRightArrowAlt, BiUser, BiEnvelope, BiBriefcase } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const StaffFreqCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const res = await axios.get('/staff/getFreqCustomers');
        if (res.data && res.data.success === true) {
          setCustomers(res.data.customers);
        } else {
          alert('Failed to fetch customer information.');
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchCustomerInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-400 to-green-400 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-2/3 mx-auto">
        <div className="relative px-4 my-auto bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="flex justify-center">
            <div className="cursor-pointer" onClick={() => navigate('/staffDashboard')}>
              <BiArrowBack className="text-3xl text-gray-800" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 mx-auto">Frequent Customers</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {customers.map((customer) => (
              <div key={customer.email} className="bg-white hover:bg-zinc-100 rounded-lg p-4 shadow-md cursor-pointer flex flex-col" onClick={() => navigate("/staffViewRecord/" + customer.email)}>
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <BiUser className="mr-2" /> {customer.first_name} {customer.last_name}
                  </h2>
                  <p className="flex items-center">
                    <BiEnvelope className="mr-2" /> <strong>Email:</strong> &nbsp; {customer.email}
                  </p>
                  <p className="flex items-center">
                    <BiBriefcase className="mr-2" /> <strong>Flights in the past year: </strong> &nbsp; {customer.num_tickets}
                  </p>
                </div>
                <div className="flex justify-end items-center mt-4">
                  <BiRightArrowAlt className="text-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffFreqCustomer;
