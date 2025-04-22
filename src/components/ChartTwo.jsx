import React from 'react';
import { CHART_TWO } from '../config/componentConfig/chartTwo';

const ChartTwo = () => {
  return (
    <div className="chart-container">
      <h3>{CHART_TWO.title}</h3>
      <p>Chart Two (Distribution) is being displayed here</p>
    </div>
  );
};

export default ChartTwo; 