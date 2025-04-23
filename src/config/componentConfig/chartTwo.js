/**
 * Configuration for Chart Two (Distribution)
 */


export const CHART_TWO = {
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

