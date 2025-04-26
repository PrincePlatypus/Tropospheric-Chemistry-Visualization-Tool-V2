import React from 'react';
import { useChartThree } from '../context/ChartThreeContext';
import { useVariable } from '../context/VariableContext'; // Import useVariable
import '../styles/Value.css'; // Create this CSS file for styling

const Value = () => {
  const { firstValue } = useChartThree(); // Get the value from ChartThree context
  const { selectedVariable } = useVariable(); // Get the selected variable details

  // Don't render if no variable is selected or the first value hasn't been set yet
  // (Check for null explicitly, as 0 is a valid value)
  if (!selectedVariable || firstValue === null || firstValue === undefined) {
    return null; // Or return a placeholder like <div className="value-display placeholder">--</div>
  }

  const displayValue = typeof firstValue === 'number'
    ? firstValue.toFixed(2) // Format number to 2 decimal places
    : '--'; // Placeholder if value is not a number for some reason

  return (
    <div className="value-display">
      <span className="value-unit">Value:  </span>
      <span className="value-number">{displayValue}</span>
      <span className="value-unit">{selectedVariable.unit}</span>
    </div>
  );
};

export default Value; 