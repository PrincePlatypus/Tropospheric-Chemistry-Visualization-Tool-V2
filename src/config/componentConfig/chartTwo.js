/**
 * Configuration for Chart Two (Distribution)
 */

import { commonChartSettings } from './chartConfig';

export const CHART_TWO = {
  ...commonChartSettings,
  type: 'bar',
  title: 'Distribution Chart',
  settings: {
    xAxis: {
      type: 'category',
      title: 'Categories'
    },
    yAxis: {
      title: 'Frequency',
      beginAtZero: true
    }
  },
  defaultVariable: 'pressure'
};

