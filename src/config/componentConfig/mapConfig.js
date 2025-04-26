/**
 * Map view and behavior configuration
 */

import { MAP_LAYERS } from '../layers';

// Define the order and visibility of layers
export const LAYER_ORDER = [
  {
    id: 'NO2_Daily',    // must match the key in MAP_LAYERS
    visible: false,
    opacity: 0.7
  },
  {
    id: 'NO2_Monthly',
    visible: false,     // This layer will not be visible initially
    opacity: 0.7
  },
  {
    id: 'HCHO_Hourly',
    visible: true,
    opacity: 0.5
  }
  // Add more layers in the desired order
];

// Create ordered layers array with full configuration
const orderedLayers = LAYER_ORDER
  .filter(layerConfig => MAP_LAYERS[layerConfig.id]) // Ensure layer exists
  .map(layerConfig => {
    const layerDetails = MAP_LAYERS[layerConfig.id];
    return {
      ...layerDetails,
      visible: layerConfig.visible,
      opacity: layerConfig.opacity
    };
  });

export const MAP_CONFIG = {
  basemap: 'hybrid',
  initialView: {
    zoom: 4,
    center: [-98, 39], // US center coordinates [longitude, latitude]
    constraints: {
      minZoom: 2,
      maxZoom: 18
    }
  },
  navigation: {
    mouseWheelZoomEnabled: true,
    browserTouchPanEnabled: true
  },
  layers: orderedLayers
}; 