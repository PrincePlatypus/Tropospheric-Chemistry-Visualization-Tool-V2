import React from 'react';
import { useVariable } from '../context/VariableContext';
import '../styles/Legend.css'; // We'll create this CSS file next

const Legend = () => {
  const { selectedVariable } = useVariable();

  // Don't render if no variable or ramp is selected
  if (!selectedVariable || !selectedVariable.chartColorRamp || !selectedVariable.chartColorRamp.stops || selectedVariable.chartColorRamp.stops.length < 2) {
    return null;
  }

  const { name, unit, chartColorRamp } = selectedVariable;
  const stops = chartColorRamp.stops;

  // Get min and max values from the stops
  const minValue = stops[0].value;
  const maxValue = stops[stops.length - 1].value;

  // Create the CSS linear gradient string from the stops
  const gradientString = `linear-gradient(to right, ${stops.map(stop => `${stop.color} ${((stop.value - minValue) / (maxValue - minValue)) * 100}%`).join(', ')})`;

  return (
    <div className="legend-container">
      <div className="legend-title">{`${name} (${unit})`}</div>
      <div className="legend-gradient" style={{ background: gradientString }}></div>
      <div className="legend-labels">
        <span>{minValue.toFixed(1)}</span>
        <span>{maxValue.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default Legend; 