/**
 * Map view and behavior configuration
 */

export const MAP_CONFIG = {
  basemap: 'topo-vector',
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
  }
}; 