/**
 * Configuration for Chart One (Time Series)
 */

import { commonChartSettings } from './chartConfig';

export const CHART_ONE = {
  ...commonChartSettings,
  type: 'line',
  title: 'Time Series Chart',
  settings: {
    xAxis: {
      type: 'time',
      title: 'Time'
    },
    yAxis: {
      title: 'Value',
      beginAtZero: true
    }
  },
  defaultVariable: 'temperature'
};