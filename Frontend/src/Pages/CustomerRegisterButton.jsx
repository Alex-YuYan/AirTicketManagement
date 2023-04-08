import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { RiErrorWarningLine } from 'react-icons/ri';
import axios from '../axios';
import md5 from 'blueimp-md5';

const CustomerRegisterButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    // md5 hash the password
    data.password = md5(data.password);
    try {
      const response = await axios.post('/customer/register', data, { withCredentials: true })
      if (response.data.success === true) {
        alert('Registration successful, please log in.');
        setIsOpen(false);
        reset();
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
      <div className="relative mt-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          onClick={() => setIsOpen(true)}
        >
          Customer Register
        </button>
        <Transition appear show={isOpen} as={React.Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => setIsOpen(false)}
          >
            <div className="min-h-screen px-4 text-center z-30">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />
              </Transition.Child>
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Register
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-4">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <input
                        {...register('first_name', { required: true })}
                        type="text"
                        id="first_name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.username && (
                        <div className="flex items-center mt-2 text-sm text-red-600">
                          <RiErrorWarningLine className="mr-1" />
                          <span>Username is required</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <input
                        {...register('last_name', { required: true })}
                        type="text"
                        id="last_name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.username && (
                        <div className="flex items-center mt-2 text-sm text-red-600">
                          <RiErrorWarningLine className="mr-1" />
                          <span>Username is required</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        {...register('email', {
                          required: true,
                          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        })}
                        type="email"
                        id="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.email && (
                        <div className="flex items-center mt-2 text-sm text-red-600">
                          <RiErrorWarningLine className="mr-1" />
                          <span>
                            {errors.email.type === 'required'
                              ? 'Email is required'
                              : 'Invalid email address'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <input
                        {...register('password', { required: true, minLength: 6 })}
                        type="password"
                        id="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.password && (
                        <div className="flex items-center mt-2 text-sm text-red-600">
                          <RiErrorWarningLine className="mr-1" />
                          <span>
                            {errors.password.type === 'required'
                              ? 'Password is required'
                              : 'Password must be at least 6 characters'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Register
                      </button>
                    </div>
                  </form>
                  <div className="mt-4">
                    <button
                      className="text-gray-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
  );
};

export default CustomerRegisterButton;