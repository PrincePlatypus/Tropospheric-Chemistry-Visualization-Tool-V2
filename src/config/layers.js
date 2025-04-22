/**
 * Template and instances for map layers
 */

// Template for creating new layer configurations
export const LAYER_TEMPLATE = {
  id: 'unique_layer_id',
  title: 'Layer Title',
  url: 'service_url',
  type: 'FeatureLayer', // or 'MapImageLayer', 'WMSLayer', etc.
  visible: true,
  opacity: 1,
  renderer: {
    type: 'simple',
    symbol: {
      type: 'simple-marker',
      color: '#1E90FF',
      size: 6
    }
  },
  popupTemplate: {
    title: '{field_name}',
    content: [{
      type: 'fields',
      fieldInfos: [{
        fieldName: 'field_name',
        label: 'Field Label'
      }]
    }]
  }
};

// Active layer configurations
export const MAP_LAYERS = {
  samplePoints: {
    ...LAYER_TEMPLATE,
    id: 'sample_points',
    title: 'Sample Locations',
    url: 'your_feature_service_url',
    type: 'FeatureLayer'
  },
  // Add more layers as needed by copying LAYER_TEMPLATE
  weatherData: {
    ...LAYER_TEMPLATE,
    id: 'weather_data',
    title: 'Weather Information',
    url: 'weather_service_url',
    type: 'MapImageLayer'
  }
}; 