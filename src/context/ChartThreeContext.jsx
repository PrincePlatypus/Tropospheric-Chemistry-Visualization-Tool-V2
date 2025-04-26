import React, { createContext, useState, useContext, useMemo } from 'react';

// Create the context
const ChartThreeContext = createContext(null);

// Create the provider component
export const ChartThreeProvider = ({ children }) => {
  const [firstValue, setFirstValue] = useState(null); // State to hold the first value

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    firstValue,
    setFirstValue, // Function to update the value
  }), [firstValue]);

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
