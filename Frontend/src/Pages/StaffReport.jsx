import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../Auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { BiArrowBack } from 'react-icons/bi';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TooltipComponent, GridComponent, LegendComponent, BarChart, LineChart, CanvasRenderer]);

const StaffReport = () => {
  const navigate = useNavigate();
  const { userFirstName, userLastName } = useContext(AuthContext);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [ticketsSold, setTicketsSold] = useState([]);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [displayStartDate, setDisplayStartDate] = useState(null);
  const [displayEndDate, setDisplayEndDate] = useState(null);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
  const [lastYearRevenue, setLastYearRevenue] = useState(0);

  const getBarChartOptions = () => {
    const xAxisData = ticketsSold.map(item => item[0]);
    const seriesData = ticketsSold.map(item => item[1].toFixed(2));

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Tickets Sold',
          type: 'bar',
          data: seriesData,
          itemStyle: {
            color: '#1890ff',
          },
        },
      ],
    };
  };

  const getTicketsSold = async (start_date, end_date) => {
    if (!start_date || !end_date) {
      alert('Please enter a valid date range.');
      return;
    }
    const start = new Date(start_date);
    const end = new Date(end_date);
    const today = new Date();
    if (end < start || start > today || end > new Date(start.setFullYear(start.getFullYear() + 1))) {
      alert('Please enter a valid date range, the end date should be within a year from the start date and start date should be in the future.')
      return;
    }
    setDisplayStartDate(start_date);
    setDisplayEndDate(end_date);
    try {
      const res = await axios.get('/staff/getTicketSoldMonthly', {
        params: {
          start_date: start_date,
          end_date: end_date,
        },
      });
      if (res.data && res.data.success === true) {
        setTicketsSold(res.data.tickets_sold);
        const total = res.data.tickets_sold.reduce((acc, item) => acc + item[1], 0);
        setTotalTicketsSold(total);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    getTicketsSold(oneYearAgo.toISOString().split('T')[0], new Date().toISOString().split('T')[0]);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const getRevenue = async (start_date, end_date, type) => {
      try {
        const res = await axios.get('/staff/getRevenue', {
          params: {
            start_date: start_date,
            end_date: end_date,
          },
        });
        if (res.data && res.data.success === true) {
          if (type === 'lastMonth') {
            setLastMonthRevenue(res.data.revenue);
          } else {
            setLastYearRevenue(res.data.revenue);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    getRevenue(oneMonthAgo.toISOString().split('T')[0], new Date().toISOString().split('T')[0], 'lastMonth');
    getRevenue(oneYearAgo.toISOString().split('T')[0], new Date().toISOString().split('T')[0], 'lastYear');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-emerald-400 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative w-2/3 mx-auto">
        <div className="relative px-4 my-auto bg-gray-100 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="mx-auto">
            <div className="cursor-pointer mb-4" onClick={() => navigate("/staffDashboard")}>
              <BiArrowBack className="text-3xl text-gray-800" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{userFirstName} {userLastName}, here's your ticket sales summary:</h1>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Total Tickets Sold between <span className='text-blue-600'>{displayStartDate}</span> and <span className='text-blue-600'>{displayEndDate}</span> is <span className="text-2xl text-green-600 font-bold">{totalTicketsSold}</span> tickets</h2>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Total Revenue Last Year is <span className="text-2xl text-green-600 font-bold">${lastYearRevenue}</span> </h2>
              <h2 className="text-xl font-semibold text-gray-800">Total Revenue Last Month is <span className="text-2xl text-green-600 font-bold">${lastMonthRevenue}</span> </h2>
            </div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Select a date range:</h2>
              <div className="flex items-center">
                <label className="mr-2">Start Date:</label>
                <input
                  className="border border-gray-300 rounded p-2"
                  type="date"
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <label className="mr-2 ml-2">End Date:</label>
                <input
                  className="border border-gray-300 rounded p-2"
                  type="date"
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <div className="ml-2"> </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => getTicketsSold(startDate, endDate)}
                >
                  Get Tickets Sold
                </button>
              </div>
            </div>
            <ReactECharts option={getBarChartOptions()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffReport;
