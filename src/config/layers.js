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
  NO2_Hourly: {
    ...LAYER_TEMPLATE,
    id: 'NO2_Hourly',
    title: 'NO2 Hourly',
    url: 'https://gis.earthdata.nasa.gov/image/rest/services/C2930763263-LARC_CLOUD/TEMPO_NO2_L3_V03_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer',
    type: 'ImageServer',
    variableName: 'NO2'
  },
  
  NO2_Daily: {
    ...LAYER_TEMPLATE,
    id: 'NO2_Daily',
    title: 'NO2 Daily',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_NO2_L3_V03_Daily_Maximum/ImageServer',
    type: 'ImageServer',
    variableName: 'NO2'
  },

  NO2_Monthly: {
    ...LAYER_TEMPLATE,
    id: 'NO2_Monthly',
    title: 'NO2 Monthly',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_NO2_L3_V03_Monthly_Mean/ImageServer',
    type: 'ImageServer',
    variableName: 'NO2'
  },

  HCHO_Hourly: {
    ...LAYER_TEMPLATE,
    id: 'HCHO_Hourly',
    title: 'HCHO Hourly',
    url: 'https://gis.earthdata.nasa.gov/image/rest/services/C2930761273-LARC_CLOUD/TEMPO_HCHO_L3_V03_HOURLY_VERTICAL_COLUMN/ImageServer',
    type: 'ImageServer',
    variableName: 'HCHO'
  },

  HCHO_Daily: {
    ...LAYER_TEMPLATE,
    id: 'HCHO_Daily',
    title: 'HCHO Daily',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_HCHO_L3_V03_Daily_Maximum/ImageServer',
    type: 'ImageServer',
    variableName: 'HCHO'
  },

  HCHO_Monthly: {
    ...LAYER_TEMPLATE,
    id: 'HCHO_Monthly',
    title: 'HCHO Monthly',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_HCHO_L3_V03_Monthly_Mean/ImageServer',
    type: 'ImageServer',
    variableName: 'HCHO'
  }
}; 