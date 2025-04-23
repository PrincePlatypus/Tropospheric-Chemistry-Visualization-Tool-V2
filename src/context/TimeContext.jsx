import React, { createContext, useContext, useState } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const [timeRange, setTimeRange] = useState({
    start: new Date('2023-01-01'),
    end: new Date('2023-12-31'),
    current: new Date('2023-01-01')
  });

  const [interval, setInterval] = useState('1d'); // '1h', '1d', '1m' for hour, day, month

  const updateCurrentTime = (newTime) => {
    setTimeRange(prev => ({
      ...prev,
      current: newTime
    }));
  };

  const updateTimeRange = (start, end) => {
    setTimeRange(prev => ({
      ...prev,
      start,
      end,
      current: start // Reset current to start when range changes
    }));
  };

  const updateInterval = (newInterval) => {
    setInterval(newInterval);
  };

  const value = {
    timeRange,
    interval,
    updateCurrentTime,
    updateTimeRange,
    updateInterval
  };

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};

export default TimeContext; 