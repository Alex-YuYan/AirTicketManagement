import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { RiErrorWarningLine } from 'react-icons/ri';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const PurchaseButton = ({ flight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(flight);
    // Handle the submission of payment information here
    console.log(data);

    const params = {
      airline_name: flight.airline_name,
      flight_number: flight.flight_number,
      dept_date_time: flight.dept_date_time,
      card_type: data.card_type,
      card_name: data.card_name,
      card_number: data.card_number,
      card_expiration: data.card_expiration,
    };

    try {
      const response = await axios.post('/customer/purchase', params)
      if (response.data.success === true) {
        alert('Purchase successful, you may now check your flights.');
        setIsOpen(false);
        reset();
        navigate('/customerDashboard');
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.log(err);
      alert('Purchase failed, please try again.')
    }
    setIsOpen(false);
    reset();
  };

  const formFields = [
    {
      name: 'card_type',
      label: 'Card Type',
      type: 'select',
      validation: { required: true },
      options: [
        { value: 'credit', label: 'Credit' },
        { value: 'debit', label: 'Debit' },
      ],
    },
    {
      name: 'card_name',
      label: 'Name on Card',
      type: 'text',
      validation: { required: true },
    },
    {
      name: 'card_number',
      label: 'Card Number',
      type: 'text',
      validation: { required: true, pattern: /^[0-9]{13,19}$/ },
    },
    {
      name: 'card_expiration',
      label: 'Expiration Date',
      type: 'date',
      validation: { required: true },
      min: new Date().toISOString().slice(0, 10),
    },
  ];


  return (
    <div className="relative mt-2">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        onClick={() => setIsOpen(true)}
      >
        Purchase
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
                  Payment Information
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {formFields.map((field) => (
                    <div key={field.name} className="mt-4">
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          {...register(field.name, field.validation)}
                          id={field.name}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          {...register(field.name, field.validation)}
                          type={field.type}
                          id={field.name}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          min={field.min}
                        />
                      )}
                      {errors[field.name] && (
                        <div className="flex items-center mt-2 text-sm text-red-600">
                          <RiErrorWarningLine className="mr-1" />
                          <span>
                            {field.validation.required && errors[field.name].type === 'required'
                              ? `${field.label} is required`
                              : errors[field.name].type === 'pattern'
                                ? `Invalid ${field.label.toLowerCase()}`
                                : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Submit Payment
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

export default PurchaseButton;
