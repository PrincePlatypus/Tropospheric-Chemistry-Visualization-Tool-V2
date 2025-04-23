/**
 * Configuration for Chart One (Time Series)
 */


export const CHART_ONE = {
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