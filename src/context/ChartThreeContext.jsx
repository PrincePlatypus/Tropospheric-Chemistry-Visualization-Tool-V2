import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

// Create the context
const ChartThreeContext = createContext(null);

// Create the provider component
export const ChartThreeProvider = ({ children }) => {
  const [firstValue, setFirstValue] = useState(null); // State for the first value
  const [rawSamples, setRawSamples] = useState(null); // State for all raw samples

  // Function to update the first value (existing)
  const updateFirstValue = useCallback((value) => {
    setFirstValue(value);
  }, []);

  // --- New Function to update and log raw samples ---
  const updateRawSamples = useCallback((samples) => {
    console.log("ChartThreeContext: Received raw samples:", samples); // Log the samples
    setRawSamples(samples); // Update the state
  }, []);
  // --- End New Function ---

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    firstValue,
    setFirstValue: updateFirstValue, // Keep existing setter name for compatibility
    rawSamples, // Expose the raw samples state (optional)
    updateRawSamples, // Expose the new function
  }), [firstValue, updateFirstValue, rawSamples, updateRawSamples]); // Add dependencies

  return (
    <ChartThreeContext.Provider value={contextValue}>
      {children}
    </ChartThreeContext.Provider>
  );
};

// Custom hook to use the context
export const useChartThree = () => {
  const context = useContext(ChartThreeContext);
  if (context === null) {
    throw new Error('useChartThree must be used within a ChartThreeProvider');
  }
  return context;
};
