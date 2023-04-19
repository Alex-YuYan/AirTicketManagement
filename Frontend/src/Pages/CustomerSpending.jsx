import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../Auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const CustomerSpending = () => {
  const navigate = useNavigate();
  const { userFirstName, userLastName } = useContext(AuthContext);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [spending, setSpending] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [displayStartDate, setDisplayStartDate] = useState(null);
  const [displayEndDate, setDisplayEndDate] = useState(null);

  const getSpending = async (start_date, end_date) => {
    setDisplayStartDate(start_date);
    setDisplayEndDate(end_date);
    try {
      const res = await axios.get('/customer/spending', {
        params: {
          start_date: start_date,
          end_date: end_date,
        },
      });
      if (res.data && res.data.success === true) {
        setSpending(res.data.spending);
        const total = res.data.spending.reduce((acc, item) => acc + item.spending, 0);
        setTotalSpending(total);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    getSpending(oneYearAgo.toISOString().split('T')[0], new Date().toISOString().split('T')[0]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-amber-400 to-cyan-500 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-2/3 mx-auto">
        <div className="relative px-4 my-auto bg-gray-100 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{userFirstName} {userLastName}, here's your spending summary:</h1>
            <div className="flex items-center justify-between mb-4">
              <input
                className="border border-gray-300 rounded p-2"
                type="date"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                className="border border-gray-300 rounded p-2"
                type="date"
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => getSpending(startDate, endDate)}
              >
                Get Spending
              </button>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Total Spending between {displayStartDate} and {displayEndDate}: ${totalSpending.toFixed(2)}</h2>
            </div>
            <div>
              <ul>
                {spending.map((item, index) => (
                  <li key={index} className="flex justify-between items-center mb-2">
                    <span className="text-gray-800 font-medium">{item.month}</span>
                    <span className="text-gray-800 font-medium">${item.spending.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSpending;