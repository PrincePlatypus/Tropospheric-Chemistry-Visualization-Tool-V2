import React from 'react';
import { CHART_ONE } from '../config/componentConfig/chartOne';

const ChartOne = () => {
  return (
    <div className="chart-container">
      <h3>{CHART_ONE.title}</h3>
      <p>Chart One (Time Series) is being displayed here</p>
    </div>
  );
};

export default ChartOne; 