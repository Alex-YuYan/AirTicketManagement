import React, { useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const StaffAirports = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [type, setType] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ code, name, city, country, type });
    try {
      const res = await axios.post('/staff/airports', {
        code,
        name,
        city,
        country,
        type,
      });
      if (res.data && res.data.success === false) {
        alert(res.data.error);
      } else {
        alert('Airport added successfully!');
        navigate(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setType([...type, value]);
    } else {
      setType(type.filter((t) => t !== value));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-emerald-400 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-2/3 mx-auto">
        <div className="relative px-4 my-auto bg-gray-100 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="flex justify-center">
            <div className="cursor-pointer" onClick={() => navigate('/staffDashboard')}>
              <BiArrowBack className="text-3xl text-gray-800" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 mx-auto">Add Airport</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                Code
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                City
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                Country
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <span className="block text-gray-700 text-sm font-bold mb2">Type</span>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="domestic"
                  className="form-checkbox"
                  onChange={handleTypeChange}
                />
                <span className="ml-2">Domestic</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="checkbox"
                  value="international"
                  className="form-checkbox"
                  onChange={handleTypeChange}
                />
                <span className="ml-2">International</span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add Airport
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffAirports;
