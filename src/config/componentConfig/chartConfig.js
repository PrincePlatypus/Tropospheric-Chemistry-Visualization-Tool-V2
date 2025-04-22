/**
 * Common chart configuration settings
 */

export const commonChartSettings = {
  animation: true,
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    position: 'top'
  }
};

export const CHART_TYPES = {
  line: {
    id: 'line',
    label: 'Line Chart',
    supportedVariables: ['temperature', 'pressure', 'humidity']
  },
  bar: {
    id: 'bar',
    label: 'Bar Chart',
    supportedVariables: ['temperature', 'pressure', 'humidity']
  },
  scatter: {
    id: 'scatter',
    label: 'Scatter Plot',
    supportedVariables: ['temperature', 'pressure', 'humidity']
  }
};
