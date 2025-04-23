/**
 * Configuration for Chart Three (Correlation)
 */


export const CHART_THREE = {
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



