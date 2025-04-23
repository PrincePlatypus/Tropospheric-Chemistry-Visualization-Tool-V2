import React, { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import MosaicRule from '@arcgis/core/layers/support/MosaicRule';
import esriConfig from '@arcgis/core/config';
import { MAP_CONFIG, API_CONFIG } from '../config/config';
import { useMap } from '../context/MapContext';
import { useTime } from '../context/TimeContext';

const MapComponent = () => {
  const mapDiv = useRef(null);
  const mapInstance = useRef(null);
  const viewInstance = useRef(null);
  const { getCurrentViewConfig } = useMap();
  const { timeRange, interval } = useTime();

  // Initialize ArcGIS configuration
  const initializeArcGIS = () => {
    if (API_CONFIG.arcgisApiKey) {
      esriConfig.apiKey = API_CONFIG.arcgisApiKey;
    }
  };

  // Create and configure map layers
  const createMapLayers = (map, layers) => {
    console.log('Creating layers:', layers); // Debug log

    layers.forEach((layerConfig, index) => {
      let layer;
      
      switch (layerConfig.type) {
        case 'ImageServer':
          layer = new ImageryLayer({
            url: layerConfig.url,
            title: layerConfig.title,
            id: layerConfig.id,
            visible: layerConfig.visible, // Explicitly use the visibility from config
            opacity: layerConfig.opacity,
            listMode: "show"
          });
          layer.variableName = layerConfig.variableName;
          console.log(`Creating layer ${layerConfig.id} with visibility:`, layerConfig.visible); // Debug log
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
    const map = new Map({
      basemap: MAP_CONFIG.basemap
    });

    const view = new MapView({
      container: mapDiv.current,
      map: map,
      ...MAP_CONFIG.initialView,
      navigation: MAP_CONFIG.navigation
    });

    mapInstance.current = map;
    viewInstance.current = view;

    // Use mapConfig layers directly
    console.log('MAP_CONFIG layers:', MAP_CONFIG.layers); // Debug log
    createMapLayers(map, MAP_CONFIG.layers);

    // Apply initial time setting via mosaic rule using the interval
    updateLayerMosaicRules(timeRange.current, interval);

    return view;
  };

  // Function to update mosaic rules based on time interval
  const updateLayerMosaicRules = (currentTime, currentInterval) => {
    if (!mapInstance.current) return;

    // Calculate start and end time for the interval
    const currentEpochTime = currentTime.getTime();
    let intervalStartTime, intervalEndTime;

    switch (currentInterval) {
      case '1h':
        // Interval starts at the beginning of the current hour
        intervalStartTime = new Date(currentTime);
        intervalStartTime.setMinutes(0, 0, 0);
        // Interval ends at the beginning of the next hour
        intervalEndTime = new Date(intervalStartTime.getTime() + 60 * 60 * 1000);
        break;
      case '1m':
        // Interval starts at the beginning of the current month
        intervalStartTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
        // Interval ends at the beginning of the next month
        intervalEndTime = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 1);
        break;
      case '1d':
      default: // Default to daily interval
        // Interval starts at the beginning of the current day (midnight)
        intervalStartTime = new Date(currentTime);
        intervalStartTime.setHours(0, 0, 0, 0);
        // Interval ends at the beginning of the next day (midnight)
        intervalEndTime = new Date(intervalStartTime.getTime() + 24 * 60 * 60 * 1000);
        break;
    }

    const startEpoch = intervalStartTime.getTime();
    const endEpoch = intervalEndTime.getTime(); // Use the calculated end time

    console.log(`Updating mosaic rules for interval: ${intervalStartTime.toISOString()} to ${intervalEndTime.toISOString()} (${startEpoch} to ${endEpoch})`);

    mapInstance.current.layers.forEach(layer => {
      if (layer instanceof ImageryLayer && layer.variableName) {
        console.log(`Updating mosaic rule for layer: ${layer.id} with variable: ${layer.variableName}`);
        layer.mosaicRule = new MosaicRule({
          ascending: true,
          mosaicMethod: "esriMosaicCenter",
          multidimensionalDefinition: [{
            variableName: layer.variableName,
            dimensionName: "StdTime",
            values: [[startEpoch, endEpoch]], // Use the interval [start, end]
            isSlice: false // Indicate it's a range, not a single slice
          }],
          // mosaicOperation: "MT_FIRST" // Or MT_MEAN, MT_MAX etc. depending on desired result within the interval
          // Let's try removing mosaicOperation to see if the service default works better for ranges
        });
      }
    });
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
      mapInstance.current = null; // Clear refs on unmount
      viewInstance.current = null;
    };
  }, []);

  // Effect to update layer mosaic rules when time or interval changes
  useEffect(() => {
    updateLayerMosaicRules(timeRange.current, interval);
  }, [timeRange.current, interval]); // Re-run when current time or interval changes

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