import { useContext, useEffect, useState } from 'react';
import { FaPlane } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import CustomerRegisterButton from '../Components/CustomerRegisterButton';
import md5 from 'blueimp-md5';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Auth/AuthProvider';
import StaffRegisterButton from '../Components/StaffRegisterButton';

const Landing = () => {
  const [loginType, setLoginType] = useState('customer');
  const { loggedIn, userRole } = useContext(AuthContext);
  const [info, setInfo] = useState({
    email: '',
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn === true) {
      if (userRole === 'customer') {
        navigate('/customerDashboard');
      } else if (userRole === 'staff') {
        navigate('/staffDashboard');
      }
    }
  }, [loggedIn, userRole]);

  const handleCustomerLogin = async () => {
    const email = info.email;
    const password = md5(info.password);

    const data = {
      "email": email,
      "password": password
    };

    try {
      const response = await axios.post('/customer/login', data)
      if (response.data.success === true) {
        // alert('Sucessfully logged in!');
        window.location.href = '/customerDashboard';
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleStaffLogin = async () => {
    const username = info.username;
    const password = md5(info.password);

    const data = {
      "username": username,
      "password": password
    };

    try {
      const response = await axios.post('/staff/login', data)
      if (response.data.success === true) {
        // alert('Sucessfully logged in!');
        window.location.href = '/staffDashboard';
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.id]: e.target.value });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(https://cdn.plnspttrs.net/07455/ph-bkd-klm-royal-dutch-airlines-boeing-787-10-dreamliner_PlanespottersNet_1323213_d1b8914d2e_o.jpg)` }}>
      <header className="flex items-center justify-between p-4 bg-gradient-to-t from-transparent to-blue-300 text-white">
        <h1 className="text-2xl font-bold">
          <FaPlane className="inline-block mr-2" />
          Air Ticket Management System
        </h1>
      </header>
      <main className="flex flex-grow relative">
        <section className="w-2/3 absolute z-10 left-0 flex flex-col items-center justify-center p-6 mt-[20vh]">
          <div className="flex items-start">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-md">
              <div className="flex justify-center">
                <button
                  className={`bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline ${loginType === 'customer' && 'bg-blue-700'
                    }`}
                  onClick={() => setLoginType('customer')}
                >
                  Customer Login
                </button>
                <button
                  className={`bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline ${loginType === 'airline' && 'bg-blue-700'
                    }`}
                  onClick={() => setLoginType('airline')}
                >
                  Airline Staff Login
                </button>
              </div>
              <h2 className="text-3xl mt-6 mb-6 text-center">
                {loginType === 'customer' ? 'Welcome, dear customer!' : 'Welcome, staff member!'}
              </h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={loginType === 'customer' ? "Email" : "Username"}>
                    {
                      loginType === 'customer' ?
                        "Email"
                        :
                        "Username"
                    }
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={loginType === 'customer' ? "email" : "username"}
                    type="text"
                    placeholder={loginType === 'customer' ? "Email" : "Username"}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </div>
                {
                  loginType === 'customer' ?
                    <div className="flex items-center justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        type="button"
                        onClick={() => { handleCustomerLogin() }}
                      >
                        Customer Sign In
                      </button>
                    </div>
                    :
                    <div className="flex items-center justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        type="button"
                        onClick={() => { handleStaffLogin() }}
                      >
                        Staff Sign In
                      </button>
                    </div>
                }

              </form>
              {
                loginType === 'customer' ?
                  <CustomerRegisterButton />
                  :
                  <StaffRegisterButton />
              }
            </div>
            <button
              className="flex items-center justify-between bg-white shadow-md rounded-md px-4 py-2 space-x-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-indigo-500 ml-4" onClick={() => navigate('/publicSearch')}
            >
              <span>Search Flights without <br></br> Logging In</span>
              <FiArrowRight className="text-blue-500 text-4xl" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
