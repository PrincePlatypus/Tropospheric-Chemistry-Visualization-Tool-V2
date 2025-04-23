import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTime } from '../context/TimeContext';
import '../styles/TimeControl.css';

const TimeControl = () => {
  // Get new state and functions from context
  const {
    overallTimeRange,
    intervalTimeRange,
    isLocked,
    updateOverallTimeRange,
    updateIntervalTimeRange,
    toggleLock
  } = useTime();

  // Refs for slider elements
  const sliderTrackRef = useRef(null);
  const draggingThumbRef = useRef(null); // 'start', 'end', or null
  const dragStartXRef = useRef(0);
  const initialIntervalRef = useRef(null); // Store interval at drag start

  // Format date for input type="datetime-local"
  // Output format: YYYY-MM-DDTHH:mm
  const formatDateTimeForInput = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return ''; // Handle invalid date
    }
    // Create a new Date object to avoid modifying the original state object
    const localDate = new Date(date.getTime());
    // Adjust for the timezone offset to get the correct local time representation
    localDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    // Convert to ISO string and take the part before seconds (YYYY-MM-DDTHH:mm)
    return localDate.toISOString().slice(0, 16);
  };

  // Convert date to percentage position on the slider track
  const dateToPercent = useCallback((date) => {
    const overallStartMs = overallTimeRange.start.getTime();
    const overallEndMs = overallTimeRange.end.getTime();
    const dateMs = date.getTime();
    const totalDuration = overallEndMs - overallStartMs;

    if (totalDuration <= 0) return 0; // Avoid division by zero

    const percent = ((dateMs - overallStartMs) / totalDuration) * 100;
    return Math.max(0, Math.min(100, percent)); // Clamp between 0 and 100
  }, [overallTimeRange]);

  // Convert percentage position on the slider track to date
  const percentToDate = useCallback((percent) => {
    const overallStartMs = overallTimeRange.start.getTime();
    const overallEndMs = overallTimeRange.end.getTime();
    const totalDuration = overallEndMs - overallStartMs;

    const dateMs = overallStartMs + (totalDuration * percent / 100);
    return new Date(dateMs);
  }, [overallTimeRange]);

  // Handle changes in the datetime-local input fields
  const handleDateTimeInputChange = (type, event) => {
    // Value from datetime-local is like "2023-10-26T14:30"
    // new Date() parses this as local time by default
    const newDate = new Date(event.target.value);

    if (isNaN(newDate)) {
        console.error("Invalid date/time input:", event.target.value);
        return; // Don't proceed if the date is invalid
    }

    // Note: We are treating the selected time as local.
    // The Date object's internal epoch value is consistent.

    switch (type) {
      case 'overallStart':
        if (newDate <= overallTimeRange.end) {
          updateOverallTimeRange(newDate, overallTimeRange.end);
        } else {
          alert('Overall start date/time must be before overall end date/time.');
        }
        break;
      case 'overallEnd':
        if (newDate >= overallTimeRange.start) {
          updateOverallTimeRange(overallTimeRange.start, newDate);
        } else {
          alert('Overall end date/time must be after overall start date/time.');
        }
        break;
      case 'intervalStart':
        // Check against interval end and overall bounds
        if (newDate <= intervalTimeRange.end && newDate >= overallTimeRange.start && newDate <= overallTimeRange.end) {
          updateIntervalTimeRange(newDate, intervalTimeRange.end);
        } else {
          alert('Interval start must be before interval end and within the overall range.');
          // Optionally clamp or revert based on which condition failed
        }
        break;
      case 'intervalEnd':
         // Check against interval start and overall bounds
         if (newDate >= intervalTimeRange.start && newDate >= overallTimeRange.start && newDate <= overallTimeRange.end) {
          updateIntervalTimeRange(intervalTimeRange.start, newDate);
        } else {
          alert('Interval end must be after interval start and within the overall range.');
          // Optionally clamp or revert based on which condition failed
        }
        break;
      default:
        break;
    }
  };

  // Start dragging a thumb
  const handleMouseDown = (event, thumbType) => {
    event.preventDefault(); // Prevent text selection during drag
    draggingThumbRef.current = thumbType;
    dragStartXRef.current = event.clientX;
    initialIntervalRef.current = { ...intervalTimeRange }; // Store initial state for locked drag
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp); // Handle mouse leaving window
  };

  // Handle mouse move during drag
  const handleMouseMove = useCallback((event) => {
    if (!draggingThumbRef.current || !sliderTrackRef.current || !initialIntervalRef.current) return;

    const trackRect = sliderTrackRef.current.getBoundingClientRect();
    const currentX = event.clientX;
    const deltaX = currentX - dragStartXRef.current;
    const deltaPercent = (deltaX / trackRect.width) * 100;

    const overallStartMs = overallTimeRange.start.getTime();
    const overallEndMs = overallTimeRange.end.getTime();
    const totalDuration = overallEndMs - overallStartMs;
    const deltaMs = (totalDuration * deltaPercent) / 100;

    let newStartMs, newEndMs;
    const initialStartMs = initialIntervalRef.current.start.getTime();
    const initialEndMs = initialIntervalRef.current.end.getTime();
    const initialDurationMs = initialEndMs - initialStartMs;

    if (isLocked) {
      // Move both thumbs maintaining duration
      if (draggingThumbRef.current === 'start') {
        newStartMs = initialStartMs + deltaMs;
        newEndMs = newStartMs + initialDurationMs;
      } else { // dragging 'end'
        newEndMs = initialEndMs + deltaMs;
        newStartMs = newEndMs - initialDurationMs;
      }

      // Clamp to overall bounds while maintaining duration
      if (newStartMs < overallStartMs) {
        newStartMs = overallStartMs;
        newEndMs = newStartMs + initialDurationMs;
      }
      if (newEndMs > overallEndMs) {
        newEndMs = overallEndMs;
        newStartMs = newEndMs - initialDurationMs;
        // Re-check start bound after adjusting for end clamp
        if (newStartMs < overallStartMs) {
            newStartMs = overallStartMs;
            // If duration doesn't fit, interval might collapse or need other logic
            if (newStartMs + initialDurationMs > overallEndMs) {
                 newEndMs = overallEndMs; // Allow collapse if needed
            } else {
                 newEndMs = newStartMs + initialDurationMs;
            }
        }
      }

    } else {
      // Move only the dragged thumb
      if (draggingThumbRef.current === 'start') {
        newStartMs = initialStartMs + deltaMs;
        newEndMs = initialEndMs; // Keep end fixed initially
        // Prevent start from crossing end
        if (newStartMs > newEndMs) newStartMs = newEndMs;
      } else { // dragging 'end'
        newStartMs = initialStartMs; // Keep start fixed initially
        newEndMs = initialEndMs + deltaMs;
        // Prevent end from crossing start
        if (newEndMs < newStartMs) newEndMs = newStartMs;
      }
       // Clamp individual thumbs to overall bounds
       newStartMs = Math.max(overallStartMs, newStartMs);
       newEndMs = Math.min(overallEndMs, newEndMs);
    }


    // Ensure start is never strictly after end after all calculations
    if (newStartMs > newEndMs) {
         if (draggingThumbRef.current === 'start') {
             newEndMs = newStartMs;
         } else {
             newStartMs = newEndMs;
         }
    }

    // Update context - uses Date objects, handles clamping internally
    updateIntervalTimeRange(new Date(newStartMs), new Date(newEndMs));

  }, [overallTimeRange, isLocked, updateIntervalTimeRange]);

  // End dragging
  const handleMouseUp = useCallback(() => {
    if (draggingThumbRef.current) {
      draggingThumbRef.current = null;
      initialIntervalRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    }
  }, [handleMouseMove]); // Include handleMouseMove in dependencies

   // Cleanup listeners on unmount
   useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]); // Ensure effect reruns if handlers change


  // --- Calculate Styles ---
  const startPercent = dateToPercent(intervalTimeRange.start);
  const endPercent = dateToPercent(intervalTimeRange.end);
  const rangeWidthPercent = endPercent - startPercent;

  return (
    <div className="time-control">
      {/* Row for Overall Date Pickers */}
      <div className="time-control-row date-pickers-row">
        <div className="date-picker overall-date-picker">
          <label>Overall Start:</label>
          <input
            type="datetime-local"
            value={formatDateTimeForInput(overallTimeRange.start)}
            onChange={(e) => handleDateTimeInputChange('overallStart', e)}
          />
        </div>
        <div className="date-picker overall-date-picker">
          <label>Overall End:</label>
          <input
            type="datetime-local"
            value={formatDateTimeForInput(overallTimeRange.end)}
            onChange={(e) => handleDateTimeInputChange('overallEnd', e)}
          />
        </div>
      </div>

      {/* Row for Slider and Lock Button */}
      <div className="time-control-row slider-row">
         <div className="dual-slider-container">
            <div ref={sliderTrackRef} className="slider-track">
              <div
                className="slider-range"
                style={{
                  left: `${startPercent}%`,
                  width: `${rangeWidthPercent}%`
                }}
              />
              <div
                className="slider-thumb thumb-start"
                style={{ left: `${startPercent}%` }}
                onMouseDown={(e) => handleMouseDown(e, 'start')}
              />
              <div
                className="slider-thumb thumb-end"
                style={{ left: `${endPercent}%` }}
                onMouseDown={(e) => handleMouseDown(e, 'end')}
              />
            </div>
         </div>
         <button
            onClick={toggleLock}
            className={`lock-button ${isLocked ? 'locked' : ''}`}
            title={isLocked ? 'Unlock Interval Duration' : 'Lock Interval Duration'}
          >
            {isLocked ? '🔒' : '🔓'}
          </button>
      </div>

      {/* Row for Interval Date Pickers */}
      <div className="time-control-row date-pickers-row">
        <div className="date-picker interval-date-picker">
          <label>Interval Start:</label>
          <input
            type="datetime-local"
            value={formatDateTimeForInput(intervalTimeRange.start)}
            onChange={(e) => handleDateTimeInputChange('intervalStart', e)}
            min={formatDateTimeForInput(overallTimeRange.start)}
            max={formatDateTimeForInput(intervalTimeRange.end)}
          />
        </div>
        <div className="date-picker interval-date-picker">
          <label>Interval End:</label>
          <input
            type="datetime-local"
            value={formatDateTimeForInput(intervalTimeRange.end)}
            onChange={(e) => handleDateTimeInputChange('intervalEnd', e)}
            min={formatDateTimeForInput(intervalTimeRange.start)}
            max={formatDateTimeForInput(overallTimeRange.end)}
          />
        </div>
      </div>

       {/* Optional: Display current interval dates */}
       <div className="time-control-row time-display-row">
         <div className="time-display">
           Interval: {intervalTimeRange.start.toLocaleString()} - {intervalTimeRange.end.toLocaleString()}
         </div>
       </div>

    </div>
  );
};

export default TimeControl; 