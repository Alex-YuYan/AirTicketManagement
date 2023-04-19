import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { RiErrorWarningLine, RiDeleteBinLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import md5 from 'blueimp-md5';

const StaffRegisterButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [emails, setEmails] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    data.password = md5(data.password);
    if (emails.length === 0) {
      alert('Please add at least one email.');
      return;
    }
    if (new Date(data.date_of_birth) > new Date()) {
      alert('Birthday must be in the past.');
      return;
    }
    data.phone_numbers = phoneNumbers;
    data.emails = emails;
    console.log(data);
    try {
      const response = await axios.post('/staff/register', data)
      if (response.data.success === true) {
        alert('Registration successful, please log in.');
        setIsOpen(false);
        reset();
        navigate(0);
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addEmail = () => {
    const newEmail = document.getElementById('email').value;
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
    }
  };

  const deleteEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const addPhoneNumber = () => {
    const newPhoneNumber = document.getElementById('phone_number').value;
    if (newPhoneNumber && !phoneNumbers.includes(newPhoneNumber)) {
      setPhoneNumbers([...phoneNumbers, newPhoneNumber]);
    }
  };

  const deletePhoneNumber = (index) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  const formFields = [
    { name: 'airline_name', label: 'Airline Name', type: 'text', validation: { required: true } },
    { name: 'username', label: 'Username', type: 'text', validation: { required: true } },
    { name: 'first_name', label: 'First Name', type: 'text', validation: { required: true } },
    { name: 'last_name', label: 'Last Name', type: 'text', validation: { required: true } },
    { name: 'password', label: 'Password', type: 'password', validation: { required: true } },
    { name: 'date_of_birth', label: 'Date of Birth', type: 'date', validation: { required: true } },
    { name: 'email', label: 'Email', type: 'email', validation: { pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i } },
    {
      name: 'phone_number',
      label: 'Phone Number',
      type: 'tel',
      validation: { pattern: /^[0-9]{10}$/ },
    },
  ];


  return (
    <div className="relative mt-2">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        onClick={() => setIsOpen(true)}
      >
        Staff Register
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
              <div className="inline-block w-[70vw] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Register
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
                  {formFields.map((field) => (
                    <div className="mt-4" key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field.label}
                      </label>
                      <input
                        {...register(field.name, field.validation)}
                        type={field.type}
                        id={field.name}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors[field.name] && (
                        <div className="flex items-center mt-2 text-sm text-red-600">
                          <RiErrorWarningLine className="mr-1" />
                          <span>
                            {field.validation.required && errors[field.name].type === 'required'
                              ? `${field.label} is required`
                              : errors[field.name].type === 'pattern'
                                ? `Invalid ${field.label.toLowerCase()}`
                                : errors[field.name].type === 'minLength'
                                  ? `${field.label} must be at least ${field.validation.minLength} characters`
                                  : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="mt-4">
                  <label
                    htmlFor="phone_numbers"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Added Phone Numbers
                  </label>
                  <ul>
                    {phoneNumbers.map((number, index) => (
                      <li key={index} className="flex items-center mt-2">
                        <span className="mr-2">{number}</span>
                        <button
                          type="button"
                          className="text-red-500 focus:outline-none"
                          onClick={() => deletePhoneNumber(index)}
                        >
                          <RiDeleteBinLine size={20} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={addPhoneNumber}
                  >
                    Add Phone Number
                  </button>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="emails"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Added Emails
                  </label>
                  <ul>
                    {emails.map((email, index) => (
                      <li key={index} className="flex items-center mt-2">
                        <span className="mr-2">{email}</span>
                        <button
                          type="button"
                          className="text-red-500 focus:outline-none"
                          onClick={() => deleteEmail(index)}
                        >
                          <RiDeleteBinLine size={20} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={addEmail}
                  >
                    Add Email
                  </button>
                </div>
                
                  <div className="mt-6 col-span-full">
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

export default StaffRegisterButton;
