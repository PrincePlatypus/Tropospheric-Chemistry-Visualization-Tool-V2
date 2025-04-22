import React from 'react';
import { CHART_THREE } from '../config/componentConfig/chartThree';

const ChartThree = () => {
  return (
    <div className="chart-container">
      <h3>{CHART_THREE.title}</h3>
      <p>Chart Three (Correlation) is being displayed here</p>
    </div>
  );
};

export default ChartThree; 