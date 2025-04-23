import React, { useState, useEffect } from 'react';
import { useTime } from '../context/TimeContext';
import './TimeControl.css';

const TimeControl = () => {
  const { timeRange, interval, updateCurrentTime, updateTimeRange, updateInterval } = useTime();
  const [sliderValue, setSliderValue] = useState(0);

  // Available intervals
  const intervals = [
    { value: '1h', label: 'Hourly' },
    { value: '1d', label: 'Daily' },
    { value: '1m', label: 'Monthly' }
  ];

  // Calculate total steps based on interval and range
  const calculateTotalSteps = () => {
    const { start, end } = timeRange;
    const diffTime = Math.abs(end - start);
    switch (interval) {
      case '1h':
        return Math.ceil(diffTime / (1000 * 60 * 60));
      case '1d':
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      case '1m':
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      default:
        return 100;
    }
  };

  // Convert slider value to date
  const sliderToDate = (value) => {
    const { start } = timeRange;
    const millisPerStep = {
      '1h': 1000 * 60 * 60,
      '1d': 1000 * 60 * 60 * 24,
      '1m': 1000 * 60 * 60 * 24 * 30
    }[interval];

    return new Date(start.getTime() + (value * millisPerStep));
  };

  // Handle slider change
  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value);
    setSliderValue(value);
    updateCurrentTime(sliderToDate(value));
  };

  // Handle date changes
  const handleDateChange = (type, event) => {
    const newDate = new Date(event.target.value);
    const currentStart = type === 'start' ? newDate : timeRange.start;
    const currentEnd = type === 'end' ? newDate : timeRange.end;
    
    if (currentStart <= currentEnd) {
      updateTimeRange(currentStart, currentEnd);
      setSliderValue(0); // Reset slider to start
    } else {
      alert('Start date must be before end date');
    }
  };

  // Handle interval change
  const handleIntervalChange = (event) => {
    updateInterval(event.target.value);
    setSliderValue(0); // Reset slider when interval changes
  };

  // Format date for input
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="time-control">
      <div className="time-control-row">
        <div className="date-picker">
          <label>Start Date:</label>
          <input
            type="date"
            value={formatDateForInput(timeRange.start)}
            onChange={(e) => handleDateChange('start', e)}
          />
        </div>
        <div className="date-picker">
          <label>End Date:</label>
          <input
            type="date"
            value={formatDateForInput(timeRange.end)}
            onChange={(e) => handleDateChange('end', e)}
          />
        </div>
        <div className="interval-selector">
          <label>Interval:</label>
          <select value={interval} onChange={handleIntervalChange}>
            {intervals.map(int => (
              <option key={int.value} value={int.value}>
                {int.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="time-control-row">
        <div className="time-display">
          Current Time: {timeRange.current.toLocaleString()}
        </div>
        <input
          type="range"
          min="0"
          max={calculateTotalSteps()}
          value={sliderValue}
          onChange={handleSliderChange}
          className="time-slider"
        />
      </div>
    </div>
  );
};

export default TimeControl; 