import React, { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import MosaicRule from '@arcgis/core/layers/support/MosaicRule';
import esriConfig from '@arcgis/core/config';
import { MAP_CONFIG, API_CONFIG } from '../config/config';
import { useTime } from '../context/TimeContext';
import { useSpatial } from '../context/SpatialContext';

const MapComponent = () => {
  const mapDiv = useRef(null);
  const mapInstance = useRef(null);
  const viewInstance = useRef(null);
  const { intervalTimeRange } = useTime();
  const { updateClickDetails } = useSpatial();

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
            visible: layerConfig.visible, // Explicitly use the visibility from config
            opacity: layerConfig.opacity,
            listMode: "show"
          });
          layer.variableName = layerConfig.variableName;
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


    mapInstance.current.layers.forEach(layer => {
      if (layer instanceof ImageryLayer && layer.variableName) {
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

  // --- Map Click Handler ---
  const handleMapClick = async (event) => {
    if (!viewInstance.current) return;

    // Extract location (mapPoint has latitude, longitude, spatialReference)
    const location = {
        latitude: event.mapPoint.latitude,
        longitude: event.mapPoint.longitude,
        spatialReference: event.mapPoint.spatialReference?.wkid // Optional: include WKID if needed
    };

    // --- Determine clicked layer (Simple approach: find topmost visible layer) ---
    // Note: A more robust approach might use view.hitTest() if you need precise layer identification
    //       at the click point, especially with overlapping layers or features.
    let clickedLayerId = null;
    if (mapInstance.current) {
        // Iterate layers in reverse draw order (topmost first)
        const visibleLayers = [...mapInstance.current.layers.items]
            .reverse()
            .filter(layer => layer.visible && layer instanceof ImageryLayer); // Check visibility and type

        if (visibleLayers.length > 0) {
            clickedLayerId = visibleLayers[0].id; // Take the ID of the topmost visible ImageryLayer
        }
    }

    // Update the Spatial Context
    updateClickDetails({
      location: location,
      componentId: 'mapView', // Identify which component triggered the click
      layerId: clickedLayerId, // Pass the determined layer ID
    });
  };

  useEffect(() => {
    // Initialize the map
    initializeArcGIS();
    const view = initializeMap();

    // --- Add click listener after view is ready ---
    let clickHandler = null;
    view.when(() => {
      clickHandler = view.on("click", handleMapClick);
    }).catch(error => {
        console.error("Error initializing MapView:", error);
    });

    // Cleanup function
    return () => {
      // --- Remove click listener ---
      if (clickHandler) {
        clickHandler.remove();
        clickHandler = null;
      }

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
    // updateLayerMosaicRules uses the committed start/end times
    updateLayerMosaicRules(intervalTimeRange.start, intervalTimeRange.end);
  }, [intervalTimeRange]); // Re-run only when committed intervalTimeRange changes

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