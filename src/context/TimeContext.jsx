import React, { createContext, useContext, useState, useCallback } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  // Renamed timeRange to overallTimeRange
  const [overallTimeRange, setOverallTimeRange] = useState({
    start: new Date('2023-01-01T00:00:00Z'), // Use UTC for consistency
    end: new Date('2023-12-31T23:59:59Z'),
  });

  // Added intervalTimeRange for the selected interval
  const [intervalTimeRange, setIntervalTimeRange] = useState({
    start: new Date('2023-06-01T00:00:00Z'), // Initial interval start
    end: new Date('2023-07-01T00:00:00Z'),   // Initial interval end
  });

  // Added lock state
  const [isLocked, setIsLocked] = useState(false);

  // Removed interval state and updateCurrentTime

  // Updated function to modify the overall range
  const updateOverallTimeRange = useCallback((start, end) => {
    // Basic validation
    if (start instanceof Date && end instanceof Date && start <= end) {
      setOverallTimeRange({ start, end });

      // Adjust interval if it falls outside the new overall range
      setIntervalTimeRange(prevInterval => {
        const newIntervalStart = new Date(Math.max(prevInterval.start.getTime(), start.getTime()));
        let newIntervalEnd = new Date(Math.min(prevInterval.end.getTime(), end.getTime()));

        // Ensure interval start is not after interval end after adjustment
        if (newIntervalStart > newIntervalEnd) {
           newIntervalEnd = new Date(newIntervalStart.getTime()); // Collapse interval if needed
           // Or adjust based on lock state and duration if preferred
        }

        // Ensure interval end is not before start
         if (newIntervalEnd < newIntervalStart) {
             newIntervalEnd = new Date(newIntervalStart.getTime());
         }


        return { start: newIntervalStart, end: newIntervalEnd };
      });
    } else {
      console.error("Invalid overall time range:", start, end);
    }
  }, []); // No dependencies needed if only using setters

  // Updated function to modify the selected interval range
  const updateIntervalTimeRange = useCallback((start, end) => {
    // Basic validation: ensure dates are valid and within overall range
    if (start instanceof Date && end instanceof Date && start <= end &&
        start >= overallTimeRange.start && end <= overallTimeRange.end) {
      setIntervalTimeRange({ start, end });
    } else {
       // Clamp values instead of erroring out completely during drag
       const clampedStart = new Date(Math.max(start.getTime(), overallTimeRange.start.getTime()));
       let clampedEnd = new Date(Math.min(end.getTime(), overallTimeRange.end.getTime()));

       // Ensure start is not after end after clamping
       if(clampedStart > clampedEnd) {
           if (start.getTime() === clampedStart.getTime()) { // If start was the one clamped
               clampedEnd = new Date(clampedStart.getTime());
           } else { // If end was the one clamped
               // This case is complex with clamping, might need refinement
               // For now, just set end equal to start if inverted
               clampedEnd = new Date(clampedStart.getTime());
           }
       }
        // Ensure end is not before start
        if (clampedEnd < clampedStart) {
            clampedEnd = new Date(clampedStart.getTime());
        }


       setIntervalTimeRange({ start: clampedStart, end: clampedEnd });
       console.warn("Attempted to set interval outside bounds or invalid, clamped:", { start: clampedStart, end: clampedEnd });
    }
  }, [overallTimeRange]); // Depends on overallTimeRange for validation

  // Function to toggle the lock state
  const toggleLock = useCallback(() => {
    setIsLocked(prev => !prev);
  }, []);

  // Removed updateInterval

  const value = {
    overallTimeRange,
    intervalTimeRange,
    isLocked,
    updateOverallTimeRange,
    updateIntervalTimeRange,
    toggleLock
    // Removed timeRange, interval, updateCurrentTime, updateInterval
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