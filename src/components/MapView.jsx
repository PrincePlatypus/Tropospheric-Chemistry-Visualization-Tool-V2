import React, { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import MosaicRule from '@arcgis/core/layers/support/MosaicRule';
import esriConfig from '@arcgis/core/config';
import { MAP_CONFIG, API_CONFIG } from '../config/config';
import { useTime } from '../context/TimeContext';

const MapComponent = () => {
  const mapDiv = useRef(null);
  const mapInstance = useRef(null);
  const viewInstance = useRef(null);
  const { intervalTimeRange } = useTime();

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

    // Apply initial time setting via mosaic rule using the intervalTimeRange
    updateLayerMosaicRules(intervalTimeRange.start, intervalTimeRange.end);

    return view;
  };

  // Function to update mosaic rules based on interval start and end dates
  const updateLayerMosaicRules = (intervalStart, intervalEnd) => {
    if (!mapInstance.current || !intervalStart || !intervalEnd) return;

    // Use the provided interval start and end times directly
    const startEpoch = intervalStart.getTime();
    const endEpoch = intervalEnd.getTime();

    // Ensure end is not before start (can happen with rapid updates/clamping)
    if (endEpoch < startEpoch) {
        console.warn("Mosaic rule update skipped: end time is before start time.");
        return;
    }

    console.log(`Updating mosaic rules for interval: ${intervalStart.toISOString()} to ${intervalEnd.toISOString()} (${startEpoch} to ${endEpoch})`);

    mapInstance.current.layers.forEach(layer => {
      if (layer instanceof ImageryLayer && layer.variableName) {
        console.log(`Updating mosaic rule for layer: ${layer.id} with variable: ${layer.variableName}`);
        layer.mosaicRule = new MosaicRule({
          ascending: true,
          mosaicMethod: "esriMosaicCenter", // Or another method if needed
          multidimensionalDefinition: [{
            variableName: layer.variableName,
            dimensionName: "StdTime", // Assuming this is correct for your services
            values: [[startEpoch, endEpoch]], // Use the interval [start, end]
            isSlice: false // Indicate it's a range
          }],
          // Consider mosaicOperation if needed (e.g., MT_MEAN, MT_MAX)
          // mosaicOperation: "MT_MEAN"
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Effect to update layer mosaic rules when intervalTimeRange changes
  useEffect(() => {
    updateLayerMosaicRules(intervalTimeRange.start, intervalTimeRange.end);
  }, [intervalTimeRange]); // Re-run when intervalTimeRange changes

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