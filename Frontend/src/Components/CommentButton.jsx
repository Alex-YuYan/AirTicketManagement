import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { RiErrorWarningLine, RiStarFill, RiStarLine } from 'react-icons/ri';
import axios from '../axios';

const CommentButton = ({ flight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const closeModal = () => {
    setCurrentRating(0); // Reset the currentRating state
    setIsOpen(false);
  };

  const onSubmit = async (data) => {
    const params = {
      flight_number: flight.flight_number,
      dept_date_time: flight.dept_date_time,
      airline_name: flight.airline_name,
      rating: data.rating,
      comment: data.comment,
    };

    if (data.rating === undefined) {
      alert('Please select a rating.');
      return;
    }

    try {
      const response = await axios.post('/customer/rate', params)
      if (response.data.success === true) {
        alert('Comment submitted successfully.');
        setIsOpen(false);
        reset();
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.log(err);
      alert('Comment submission failed, please try again.')
    }
    setIsOpen(false);
    reset();
  };

  const handleRating = (rating) => {
    setCurrentRating(rating);
    setValue('rating', rating);
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <RiStarFill
            key={i}
            className="text-yellow-400 cursor-pointer"
            onClick={() => handleRating(i)}
          />
        );
      } else {
        stars.push(
          <RiStarLine
            key={i}
            className="text-yellow-400 cursor-pointer"
            onClick={() => handleRating(i)}
          />
        );
      }
    }
    return stars;
  };

  const formFields = [
    {
      name: 'comment',
      label: 'Comment',
      type: 'textarea',
      validation: { required: false },
    },
  ];

  return (
    <div className="relative mt-2">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        onClick={() => setIsOpen(true)}
      >
        Comment
      </button>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => closeModal()}
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
                  Rate and Comment on Flight
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-4">
                    <label
                      htmlFor="rating"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Rating
                    </label>
                    <div className="mt-1 flex">
                      {renderStars(currentRating).map((star) => star)}
                    </div>
                    {errors.rating && (
                      <div className="flex items-center mt-2 text-sm text-red-600">
                        <RiErrorWarningLine className="mr-1" />
                        <span>Rating is required</span>
                      </div>
                    )}
                  </div>
                  {
                    formFields.map((field) => (
                      <div key={field.name} className="mt-4">
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            {...register(field.name, field.validation)}
                            id={field.name}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-20 resize-none"
                          />
                        ) : (
                          <input
                            {...register(field.name, field.validation)}
                            type={field.type}
                            id={field.name}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        )}
                        {errors[field.name] && (
                          <div className="flex items-center mt-2 text-sm text-red-600">
                            <RiErrorWarningLine className="mr-1" />
                            <span>
                              {`${field.label} is required`}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  }
                  < div className="mt-6">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Submit Comment
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
        </Dialog >
      </Transition >
    </div >
  );
};

export default CommentButton;