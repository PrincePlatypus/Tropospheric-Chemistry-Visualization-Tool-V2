import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTime } from '../context/TimeContext';
import '../styles/TimeControl.css';

const TimeControl = () => {
  // Get new state and functions from context
  const {
    overallTimeRange,
    previewIntervalTimeRange,
    isLocked,
    updateOverallTimeRange,
    updatePreviewIntervalTimeRange,
    commitPreviewIntervalTimeRange,
    toggleLock
  } = useTime();

  // Refs for slider elements
  const sliderTrackRef = useRef(null);

  // --- Refs for context functions to ensure handlers use the latest versions ---
  const updatePreviewFuncRef = useRef(updatePreviewIntervalTimeRange);
  const commitPreviewFuncRef = useRef(commitPreviewIntervalTimeRange);

  // --- Effect to keep function refs updated ---
  useEffect(() => {
    updatePreviewFuncRef.current = updatePreviewIntervalTimeRange;
    commitPreviewFuncRef.current = commitPreviewIntervalTimeRange;
  }, [updatePreviewIntervalTimeRange, commitPreviewIntervalTimeRange]);

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

    let currentPreviewStart = previewIntervalTimeRange.start;
    let currentPreviewEnd = previewIntervalTimeRange.end;
    let isValid = false;

    switch (type) {
      case 'overallStart':
        if (newDate <= overallTimeRange.end) {
          updateOverallTimeRange(newDate, overallTimeRange.end);
        } else {
          alert('Overall start date/time must be before overall end date/time.');
        }
        return; // Overall updates handle interval adjustments
      case 'overallEnd':
        if (newDate >= overallTimeRange.start) {
          updateOverallTimeRange(overallTimeRange.start, newDate);
        } else {
          alert('Overall end date/time must be after overall start date/time.');
        }
        return; // Overall updates handle interval adjustments
      case 'intervalStart':
        if (newDate <= previewIntervalTimeRange.end && newDate >= overallTimeRange.start && newDate <= overallTimeRange.end) {
          currentPreviewStart = newDate;
          isValid = true;
        } else {
          alert('Interval start must be before interval end and within the overall range.');
        }
        break;
      case 'intervalEnd':
        if (newDate >= previewIntervalTimeRange.start && newDate >= overallTimeRange.start && newDate <= overallTimeRange.end) {
          currentPreviewEnd = newDate;
          isValid = true;
        } else {
          alert('Interval end must be after interval start and within the overall range.');
        }
        break;
      default:
        break;
    }

    if (isValid) {
        updatePreviewIntervalTimeRange(currentPreviewStart, currentPreviewEnd);
        commitPreviewIntervalTimeRange();
    }
  };

  // Start dragging a thumb
  const handleMouseDown = (event, thumbType) => {
    event.preventDefault();

    // --- Define move and up handlers INSIDE mousedown ---
    // They will close over the correct initial values and function refs

    const dragStartX = event.clientX;
    // Capture the initial interval state *at the start of this specific drag*
    const initialInterval = { ...previewIntervalTimeRange };
    const currentOverallTimeRange = { ...overallTimeRange }; // Capture current overall range
    const currentIsLocked = isLocked; // Capture current lock state

    const handleMouseMove = (moveEvent) => {

      if (!sliderTrackRef.current) {
        return;
      }

      const trackRect = sliderTrackRef.current.getBoundingClientRect();
      const currentX = moveEvent.clientX;
      // Use the captured dragStartX
      const deltaX = currentX - dragStartX;
      const deltaPercent = (deltaX / trackRect.width) * 100;

      // Use captured overall range
      const overallStartMs = currentOverallTimeRange.start.getTime();
      const overallEndMs = currentOverallTimeRange.end.getTime();
      const totalDuration = overallEndMs - overallStartMs;
      const deltaMs = (totalDuration * deltaPercent) / 100;

      let newStartMs, newEndMs;
      // Use captured initial interval
      const initialStartMs = initialInterval.start.getTime();
      const initialEndMs = initialInterval.end.getTime();
      const initialDurationMs = initialEndMs - initialStartMs;

      // Use captured lock state
      if (currentIsLocked) {
        if (thumbType === 'start') {
          newStartMs = initialStartMs + deltaMs;
          newEndMs = newStartMs + initialDurationMs;
        } else {
          newEndMs = initialEndMs + deltaMs;
          newStartMs = newEndMs - initialDurationMs;
        }
        if (newStartMs < overallStartMs) {
          newStartMs = overallStartMs;
          newEndMs = newStartMs + initialDurationMs;
        }
        if (newEndMs > overallEndMs) {
          newEndMs = overallEndMs;
          newStartMs = newEndMs - initialDurationMs;
          if (newStartMs < overallStartMs) {
            newStartMs = overallStartMs;
            if (newStartMs + initialDurationMs > overallEndMs) {
                 newEndMs = overallEndMs;
            } else {
                 newEndMs = newStartMs + initialDurationMs;
            }
          }
        }
      } else {
        if (thumbType === 'start') {
          newStartMs = initialStartMs + deltaMs;
          newEndMs = initialEndMs;
          if (newStartMs > newEndMs) newStartMs = newEndMs;
        } else {
          newStartMs = initialStartMs;
          newEndMs = initialEndMs + deltaMs;
          if (newEndMs < newStartMs) newEndMs = newStartMs;
        }
        newStartMs = Math.max(overallStartMs, newStartMs);
        newEndMs = Math.min(overallEndMs, newEndMs);
      }
      if (newStartMs > newEndMs) {
         if (thumbType === 'start') {
             newEndMs = newStartMs;
         } else {
             newStartMs = newEndMs;
         }
      }

      // Call the context function (this is stable from useTime)
      updatePreviewFuncRef.current(new Date(newStartMs), new Date(newEndMs));
    };

    const handleMouseUp = (upEvent) => {
      // Remove the *exact* functions that were added
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);

      // Commit the final state
      commitPreviewFuncRef.current();
    };

    // --- Add listeners using the functions defined above ---
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
  };

  // --- Calculate Styles ---
  const startPercent = dateToPercent(previewIntervalTimeRange.start);
  const endPercent = dateToPercent(previewIntervalTimeRange.end);
  const rangeWidthPercent = Math.max(0, endPercent - startPercent); // Ensure non-negative width

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
        <div className="date-picker interval-date-picker">
          <label>Interval Start:</label>
          <input
            type="datetime-local"
            value={formatDateTimeForInput(previewIntervalTimeRange.start)}
            onChange={(e) => handleDateTimeInputChange('intervalStart', e)}
            min={formatDateTimeForInput(overallTimeRange.start)}
            max={formatDateTimeForInput(previewIntervalTimeRange.end)}
          />
        </div>
        <div className="date-picker interval-date-picker">
          <label>Interval End:</label>
          <input
            type="datetime-local"
            value={formatDateTimeForInput(previewIntervalTimeRange.end)}
            onChange={(e) => handleDateTimeInputChange('intervalEnd', e)}
            min={formatDateTimeForInput(previewIntervalTimeRange.start)}
            max={formatDateTimeForInput(overallTimeRange.end)}
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

    </div>
  );
};

export default TimeControl; 