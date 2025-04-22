import React, { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import esriConfig from '@arcgis/core/config';
import { MAP_CONFIG, API_CONFIG } from '../config/config';

const MapComponent = () => {
  const mapDiv = useRef(null);

  useEffect(() => {
    // Initialize the API key if you have one
    if (API_CONFIG.arcgisApiKey) {
      esriConfig.apiKey = API_CONFIG.arcgisApiKey;
    }

    // Create a new Map instance
    const map = new Map({
      basemap: MAP_CONFIG.basemap
    });

    // Create the MapView
    const view = new MapView({
      container: mapDiv.current,
      map: map,
      zoom: MAP_CONFIG.initialView.zoom,
      center: MAP_CONFIG.initialView.center,
      constraints: MAP_CONFIG.initialView.constraints
    });

    // Cleanup function to destroy the view when component unmounts
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