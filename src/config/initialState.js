/**
 * Initial application state configuration
 */

export const INITIAL_STATE = {
  // Currently selected/displayed items
  current: {
    variable: 'temperature',
    timeRange: {
      start: '2023-01-01',
      end: '2023-12-31'
    },
    location: null,
    chartType: 'line'
  },

  // Available options for selections
  options: {
    variables: [
      { id: 'temperature', label: 'Temperature', unit: '°C' },
      { id: 'pressure', label: 'Pressure', unit: 'hPa' },
      { id: 'humidity', label: 'Humidity', unit: '%' }
    ],
    chartTypes: [
      { id: 'line', label: 'Line Chart' },
      { id: 'bar', label: 'Bar Chart' },
      { id: 'scatter', label: 'Scatter Plot' }
    ]
  }
}; 