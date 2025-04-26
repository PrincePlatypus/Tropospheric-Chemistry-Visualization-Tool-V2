import React from 'react';
import { CHART_ONE } from '../config/componentConfig/chartOne';
import { useTime } from '../context/TimeContext';
import { useSpatial } from '../context/SpatialContext';
import { useVariable } from '../context/VariableContext';

const ChartOne = () => {
  const { intervalTimeRange } = useTime();
  const { clickDetails } = useSpatial();
  const { selectedVariable } = useVariable();

  const formatLocation = (location) => {
    if (!location) return 'N/A';
    if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
      return `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`;
    }
    return JSON.stringify(location);
  };

  const variableName = selectedVariable ? selectedVariable.name : 'No variable selected';
  const variableUnit = selectedVariable ? `(${selectedVariable.unit})` : '';

  return (
    <div className="chart-container">
      <h3>{CHART_ONE.title}: {variableName} {variableUnit}</h3>
      <div style={{ marginBottom: '10px', fontSize: '0.9em', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
        <strong>Time Interval:</strong>{' '}
        {intervalTimeRange.start.toLocaleString()} - {intervalTimeRange.end.toLocaleString()}
      </div>

      <div style={{ marginBottom: '10px', fontSize: '0.9em', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
        <strong>Location Info:</strong>
        {clickDetails.location ? (
          <ul>
            <li>Location: {formatLocation(clickDetails.location)}</li>
          </ul>
        ) : (
          <p>No location selected.</p>
        )}
      </div>

      <div style={{ marginBottom: '10px', fontSize: '0.9em', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
        <strong>Selected Variable Details:</strong>
        {selectedVariable ? (
          <ul>
            <li>ID: {selectedVariable.id}</li>
            <li>Name: {selectedVariable.name}</li>
            <li>Unit: {selectedVariable.unit}</li>
            <li>Dimension: {selectedVariable.dimension}</li>
          </ul>
        ) : (
          <p>No variable selected.</p>
        )}
      </div>

      <p>Chart One (Time Series) visualization area for {selectedVariable ? selectedVariable.name : '...'}</p>
    </div>
  );
};

export default ChartOne; 