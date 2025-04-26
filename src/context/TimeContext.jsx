import React, { createContext, useContext, useState, useCallback } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  // Renamed timeRange to overallTimeRange
  const [overallTimeRange, setOverallTimeRange] = useState({
    start: new Date('2023-01-01T00:00:00Z'), // Use UTC for consistency
    end: new Date('2025-12-31T23:59:59Z'),
  });

  // Committed interval range for MapView and other consumers
  const [intervalTimeRange, setIntervalTimeRange] = useState({
    start: new Date('2024-06-01T00:00:00Z'), // Initial interval start
    end: new Date('2024-08-01T00:00:00Z'),   // Initial interval end
  });

  // Preview interval range for TimeControl UI during interaction
  const [previewIntervalTimeRange, setPreviewIntervalTimeRange] = useState({
    start: new Date('2024-06-01T00:00:00Z'), // Initialize same as committed
    end: new Date('2024-08-01T00:00:00Z'),
  });

  // Added lock state
  const [isLocked, setIsLocked] = useState(false);

  // Updated function to modify the overall range
  const updateOverallTimeRange = useCallback((start, end) => {
    // Basic validation
    if (start instanceof Date && end instanceof Date && start <= end) {
      setOverallTimeRange({ start, end });

      // Adjust both committed and preview intervals
      const adjustInterval = (prevInterval) => {
        const newIntervalStart = new Date(Math.max(prevInterval.start.getTime(), start.getTime()));
        let newIntervalEnd = new Date(Math.min(prevInterval.end.getTime(), end.getTime()));
        if (newIntervalStart > newIntervalEnd) {
          newIntervalEnd = new Date(newIntervalStart.getTime());
        }
         if (newIntervalEnd < newIntervalStart) {
             newIntervalEnd = new Date(newIntervalStart.getTime());
         }
        return { start: newIntervalStart, end: newIntervalEnd };
      };

      setIntervalTimeRange(adjustInterval);
      setPreviewIntervalTimeRange(adjustInterval); // Keep preview consistent

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

  // --- Update Preview Interval (Called during drag/input change) ---
  const updatePreviewIntervalTimeRange = useCallback((start, end) => {
     // Basic validation: ensure dates are valid and within overall range
    if (start instanceof Date && end instanceof Date && start <= end &&
        start >= overallTimeRange.start && end <= overallTimeRange.end) {
      setPreviewIntervalTimeRange({ start, end });
    } else {
       // Clamp values for preview
       const clampedStart = new Date(Math.max(start.getTime(), overallTimeRange.start.getTime()));
       let clampedEnd = new Date(Math.min(end.getTime(), overallTimeRange.end.getTime()));
       if(clampedStart > clampedEnd) {
           // Adjust based on which value caused the inversion during clamping
           if (start.getTime() < overallTimeRange.start.getTime()) { // Start was clamped low
               clampedEnd = new Date(clampedStart.getTime());
           } else if (end.getTime() > overallTimeRange.end.getTime()) { // End was clamped high
               clampedStart = new Date(clampedEnd.getTime());
           } else { // Inversion happened without hitting overall bounds (e.g., start dragged past end)
               // Decide which thumb takes precedence or collapse
               // For simplicity, let's just make them equal if inverted internally
                clampedEnd = new Date(clampedStart.getTime());
           }
       }
        // Ensure end is not before start
        if (clampedEnd < clampedStart) {
            clampedEnd = new Date(clampedStart.getTime());
        }

       setPreviewIntervalTimeRange({ start: clampedStart, end: clampedEnd });
       // Avoid console warning spam during drag
       // console.warn("Preview interval clamped:", { start: clampedStart, end: clampedEnd });
    }
  }, [overallTimeRange]); // Depends on overallTimeRange for validation

  // --- Commit Preview Interval (Called on drag end / input commit) ---
  const commitPreviewIntervalTimeRange = useCallback(() => {
    // Set the committed range to the current preview range
    setIntervalTimeRange(previewIntervalTimeRange);
  }, [previewIntervalTimeRange]); // Depends on the current preview state

  // Function to toggle the lock state
  const toggleLock = useCallback(() => {
    setIsLocked(prev => !prev);
  }, []);

  const value = {
    overallTimeRange,
    intervalTimeRange, // The committed range for MapView etc.
    previewIntervalTimeRange, // The live range for TimeControl UI
    isLocked,
    updateOverallTimeRange,
    updateIntervalTimeRange,
    updatePreviewIntervalTimeRange, // Function to update preview
    commitPreviewIntervalTimeRange, // Function to commit preview
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