import React, { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import esriConfig from '@arcgis/core/config';
import { MAP_CONFIG, API_CONFIG } from '../config/config';
import { useMap } from '../context/MapContext';

const MapComponent = () => {
  const mapDiv = useRef(null);
  const mapInstance = useRef(null);
  const viewInstance = useRef(null);
  const { getCurrentViewConfig } = useMap();

  // Initialize ArcGIS configuration
  const initializeArcGIS = () => {
    if (API_CONFIG.arcgisApiKey) {
      esriConfig.apiKey = API_CONFIG.arcgisApiKey;
    }
  };

  // Create and configure map layers
  const createMapLayers = (map, layers) => {
    layers.forEach((layerConfig, index) => {
      let layer;
      
      switch (layerConfig.type) {
        case 'ImageServer':
          layer = new ImageryLayer({
            url: layerConfig.url,
            title: layerConfig.title,
            id: layerConfig.id,
            visible: layerConfig.visible,
            opacity: layerConfig.opacity,
            listMode: "show"
          });
          break;
        default:
          console.warn(`Unsupported layer type: ${layerConfig.type}`);
          return;
      }

      if (layer) {
        map.add(layer, index);
      }
    });
  };

  // Initialize map with mapConfig configuration
  const initializeMap = () => {
    // Create map with basemap from mapConfig
    const map = new Map({
      basemap: MAP_CONFIG.basemap
    });

    // Create view with all settings from mapConfig
    const view = new MapView({
      container: mapDiv.current,
      map: map,
      // Spread all initial view settings
      ...MAP_CONFIG.initialView,
      // Enable navigation settings
      navigation: MAP_CONFIG.navigation
    });

    // Store instances for later use
    mapInstance.current = map;
    viewInstance.current = view;

    // Configure initial layers from mapConfig
    const initialLayers = MAP_CONFIG.layers;
    createMapLayers(map, initialLayers);

    // Apply any additional view configurations from context
    const contextConfig = getCurrentViewConfig();
    if (contextConfig.layers) {
      // Update layer visibility based on context
      map.layers.forEach(layer => {
        const contextLayer = contextConfig.layers.find(l => l.id === layer.id);
        if (contextLayer) {
          layer.visible = contextLayer.visible;
          layer.opacity = contextLayer.opacity;
        }
      });
    }

    return view;
  };

  useEffect(() => {
    // Initialize the map
    initializeArcGIS();
    const view = initializeMap();

    // Cleanup function
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={mapDiv} 
      style={{ 
        height: '100%', 
        width: '100%',
        padding: 0,
        margin: 0
      }}
    />
  );
};

export default MapComponent; 