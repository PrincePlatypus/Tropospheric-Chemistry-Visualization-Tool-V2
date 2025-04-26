import React, { createContext, useContext, useState } from 'react';
import { MAP_LAYERS } from '../config/layers';
import { LAYER_ORDER } from '../config/componentConfig/mapConfig';

// Create context
const MapContext = createContext();

// Initial view states
const VIEW_STATES = {
  NO2_VIEW: {
    name: 'NO2 View',
    layers: {
      NO2_Daily: true,
      NO2_Monthly: false,
      NO2_Hourly: false,
      HCHO_Daily: false,
      HCHO_Monthly: false,
      HCHO_Hourly: false
    }
  },
  HCHO_VIEW: {
    name: 'HCHO View',
    layers: {
      NO2_Daily: false,
      NO2_Monthly: false,
      NO2_Hourly: false,
      HCHO_Daily: true,
      HCHO_Monthly: false,
      HCHO_Hourly: false
    }
  },
  COMBINED_VIEW: {
    name: 'Combined View',
    layers: {
      NO2_Daily: true,
      HCHO_Daily: true,
      NO2_Monthly: false,
      HCHO_Monthly: false,
      NO2_Hourly: false,
      HCHO_Hourly: false
    }
  }
};

export const MapProvider = ({ children }) => {
  // Current view state
  const [currentView, setCurrentView] = useState('NO2_VIEW');
  
  // Layer visibility state
  const [layerVisibility, setLayerVisibility] = useState(VIEW_STATES.NO2_VIEW.layers);

  // Layer opacity state (initialize with default opacities)
  const [layerOpacity, setLayerOpacity] = useState(
    Object.fromEntries(
      LAYER_ORDER.map(layer => [layer.id, layer.opacity])
    )
  );

  // Change the current view
  const changeView = (viewName) => {
    if (VIEW_STATES[viewName]) {
      setCurrentView(viewName);
      setLayerVisibility(VIEW_STATES[viewName].layers);
    }
  };

  // Toggle individual layer visibility
  const toggleLayer = (layerId) => {
    if (MAP_LAYERS[layerId]) {
      setLayerVisibility(prev => ({
        ...prev,
        [layerId]: !prev[layerId]
      }));
    }
  };

  // Update layer opacity
  const updateLayerOpacity = (layerId, opacity) => {
    if (MAP_LAYERS[layerId]) {
      setLayerOpacity(prev => ({
        ...prev,
        [layerId]: opacity
      }));
    }
  };

  // Get current view configuration
  const getCurrentViewConfig = () => {
    return {
      layers: LAYER_ORDER.map(layerConfig => ({
        ...MAP_LAYERS[layerConfig.id],
        visible: layerVisibility[layerConfig.id],
        opacity: layerOpacity[layerConfig.id]
      }))
    };
  };

  const value = {
    currentView,
    layerVisibility,
    layerOpacity,
    changeView,
    toggleLayer,
    updateLayerOpacity,
    getCurrentViewConfig,
    availableViews: Object.keys(VIEW_STATES).map(key => ({
      id: key,
      name: VIEW_STATES[key].name
    }))
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

// Custom hook to use the map context
export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export default MapContext; 