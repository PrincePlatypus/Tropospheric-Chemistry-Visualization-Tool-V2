/**
 * Template and instances for map layers
 */

// --- Define Variable Properties ---
// Maps the 'variableLabel' to its specific unit and dimension.
export const VARIABLE_DEFINITIONS = {
  NO2: {
    unit: 'trillion molecules/cm²',
    dimension: 'Tropospheric Vertical Column Density', // Example dimension
    // Add other common properties for NO2 if needed
  },
  HCHO: {
    unit: 'trillion molecules/cm²',
    dimension: 'Tropospheric Vertical Column Density', // Example dimension
  },
  // Example for a different variable
  // O3: {
  //   unit: 'Dobson Units',
  //   dimension: 'Total Column Ozone',
  // }
};

// --- Define Default Starting Variable ---
// The 'variableLabel' to select when the application first loads.
export const DEFAULT_VARIABLE_LABEL = 'NO2'; // Set the desired default


// Template for creating new layer configurations
export const LAYER_TEMPLATE = {
  id: 'unique_layer_id',
  title: 'Layer Title',
  url: 'service_url',
  type: 'FeatureLayer', // Default type, overridden below
  visible: true,
  opacity: 1,
  // --- Removed renderer and popupTemplate for ImageServer layers ---
  // These are less relevant for ImageServer unless specifically configured
  // renderer: { ... },
  // popupTemplate: { ... }
};

// Active layer configurations
export const MAP_LAYERS = {
  NO2_Hourly: {
    ...LAYER_TEMPLATE,
    id: 'NO2_Hourly',
    title: 'NO2 Hourly',
    url: 'https://gis.earthdata.nasa.gov/image/rest/services/C2930763263-LARC_CLOUD/TEMPO_NO2_L3_V03_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer',
    type: 'ImageServer',
    variableName: 'NO2_Troposphere', // Specific field name in the service
    variableLabel: 'NO2' // Link to VARIABLE_DEFINITIONS
    // Unit and Dimension are now derived from VARIABLE_DEFINITIONS['NO2']
  },

  NO2_Daily: {
    ...LAYER_TEMPLATE,
    id: 'NO2_Daily',
    title: 'NO2 Daily',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_NO2_L3_V03_Daily_Maximum/ImageServer',
    type: 'ImageServer',
    variableName: 'NO2_Troposphere',
    variableLabel: 'NO2' // Link to VARIABLE_DEFINITIONS
  },

  NO2_Monthly: {
    ...LAYER_TEMPLATE,
    id: 'NO2_Monthly',
    title: 'NO2 Monthly',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_NO2_L3_V03_Monthly_Mean/ImageServer',
    type: 'ImageServer',
    variableName: 'NO2_Troposphere',
    variableLabel: 'NO2' // Link to VARIABLE_DEFINITIONS
  },

  HCHO_Hourly: {
    ...LAYER_TEMPLATE,
    id: 'HCHO_Hourly',
    title: 'HCHO Hourly',
    url: 'https://gis.earthdata.nasa.gov/image/rest/services/C2930761273-LARC_CLOUD/TEMPO_HCHO_L3_V03_HOURLY_VERTICAL_COLUMN/ImageServer',
    type: 'ImageServer',
    variableName: 'HCHO', // Specific field name in the service
    variableLabel: 'HCHO' // Link to VARIABLE_DEFINITIONS
  },

  HCHO_Daily: {
    ...LAYER_TEMPLATE,
    id: 'HCHO_Daily',
    title: 'HCHO Daily',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_HCHO_L3_V03_Daily_Maximum/ImageServer',
    type: 'ImageServer',
    variableName: 'HCHO',
    variableLabel: 'HCHO' // Link to VARIABLE_DEFINITIONS
  },

  HCHO_Monthly: {
    ...LAYER_TEMPLATE,
    id: 'HCHO_Monthly',
    title: 'HCHO Monthly',
    url: 'https://gis.earthdata.nasa.gov/gp/rest/services/Hosted/TEMPO_HCHO_L3_V03_Monthly_Mean/ImageServer',
    type: 'ImageServer',
    variableName: 'HCHO',
    variableLabel: 'HCHO' // Link to VARIABLE_DEFINITIONS
  }
  // Add other layers here, referencing their variableLabel
}; 