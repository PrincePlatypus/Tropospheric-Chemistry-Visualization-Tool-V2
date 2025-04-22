/**
 * Configuration for Chart Three (Correlation)
 */

import { commonChartSettings } from './chartConfig';

export const CHART_THREE = {
  ...commonChartSettings,
  type: 'scatter',
  title: 'Correlation Plot',
  settings: {
    xAxis: {
      type: 'linear',
      title: 'Variable 1'
    },
    yAxis: {
      type: 'linear',
      title: 'Variable 2'
    }
  },
  defaultVariables: {
    x: 'temperature',
    y: 'pressure'
  }
};



