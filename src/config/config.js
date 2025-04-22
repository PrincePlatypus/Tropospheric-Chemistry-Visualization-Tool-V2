/**
 * Main configuration file that exports all configurations
 */

import { MAP_CONFIG } from './componentConfig/mapConfig';
import { MAP_LAYERS, LAYER_TEMPLATE } from './layers';
import { UI_CONFIG } from './uiConfig';
import { CHART_ONE } from './componentConfig/chartOne';
import { CHART_TWO } from './componentConfig/chartTwo';
import { CHART_THREE } from './componentConfig/chartThree';
import { CHART_TYPES } from './componentConfig/chartConfig';

// API and environment configurations
export const API_CONFIG = {
  arcgisApiKey: process.env.REACT_APP_ARCGIS_API_KEY || '',
  baseUrl: process.env.REACT_APP_API_BASE_URL || ''
};

// Variables configuration
export const VARIABLES = {
  temperature: {
    id: 'temperature',
    label: 'Temperature',
    unit: '°C',
    range: [-50, 50],
    defaultValue: 20
  },
  pressure: {
    id: 'pressure',
    label: 'Pressure',
    unit: 'hPa',
    range: [800, 1200],
    defaultValue: 1013
  },
  humidity: {
    id: 'humidity',
    label: 'Humidity',
    unit: '%',
    range: [0, 100],
    defaultValue: 50
  }
};

// Export all configurations
export {
  MAP_CONFIG,
  MAP_LAYERS,
  LAYER_TEMPLATE,
  UI_CONFIG,
  CHART_ONE,
  CHART_TWO,
  CHART_THREE,
  CHART_TYPES
};

// Default export of all configurations
export default {
  MAP_CONFIG,
  API_CONFIG,
  UI_CONFIG,
  MAP_LAYERS,
  LAYER_TEMPLATE,
  CHART_ONE,
  CHART_TWO,
  CHART_THREE,
  CHART_TYPES,
  VARIABLES
}; 