import React, { useEffect, useRef, useCallback } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import MosaicRule from '@arcgis/core/layers/support/MosaicRule';
import RasterFunction from '@arcgis/core/layers/support/RasterFunction';
import esriConfig from '@arcgis/core/config';
import { MAP_CONFIG, API_CONFIG } from '../config/config';
import { MAP_LAYERS, VARIABLE_DEFINITIONS } from '../config/layers';
import { useTime } from '../context/TimeContext';
import { useSpatial } from '../context/SpatialContext';
import { useVariable } from '../context/VariableContext';
import { useAnimation } from '../context/AnimationContext';
import { useChartThree } from '../context/ChartThreeContext';

const MapComponent = () => {
  const mapDiv = useRef(null);
  const mapInstance = useRef(null);
  const viewInstance = useRef(null);
  const { intervalTimeRange } = useTime();
  const { updateClickDetails } = useSpatial();
  const { selectedVariableId } = useVariable();
  const { isAnimating } = useAnimation();
  const { rawSamples } = useChartThree();
  const animationCancelRef = useRef(false);

  // Initialize ArcGIS configuration
  const initializeArcGIS = () => {
    if (API_CONFIG.arcgisApiKey) {
      esriConfig.apiKey = API_CONFIG.arcgisApiKey;
    }
  };

  // Create and configure map layers (Initial Creation)
  // Layers are initially added but visibility is controlled later
  const createMapLayers = (map) => {
    // Get all layer configurations from MAP_LAYERS
    const layers = Object.values(MAP_LAYERS);

    layers.forEach((layerConfig, index) => {
      let layer;

      switch (layerConfig.type) {
        case 'ImageServer':
          layer = new ImageryLayer({
            url: layerConfig.url,
            title: layerConfig.title,
            id: layerConfig.id,
            // Initial visibility is now false by default in LAYER_TEMPLATE
            // It will be set dynamically based on selectedVariableId
            visible: layerConfig.visible, // Use config's default (should be false)
            opacity: layerConfig.opacity,
            listMode: "show" // Or "hide" if you don't want them in a potential LayerList widget initially
          });
          // Store config details directly on the layer instance for easier access later
          layer.customConfig = layerConfig;
          break;
        // Add cases for other layer types if needed
        default:
          console.warn(`Unsupported layer type: ${layerConfig.type}`);
          return;
      }

      if (layer) {
        map.add(layer, index); // Add layer to the map
      }
    });
  };

  // Initialize map with mapConfig configuration
  const initializeMap = () => {
    const map = new Map({
      basemap: MAP_CONFIG.basemap // Use basemap from general config
    });

    const view = new MapView({
      container: mapDiv.current,
      map: map,
      ...MAP_CONFIG.initialView, // Use initial view settings
      navigation: MAP_CONFIG.navigation
    });

    mapInstance.current = map;
    viewInstance.current = view;

    // Create layers based on MAP_LAYERS config
    createMapLayers(map);

    // Apply initial time setting via mosaic rule using the intervalTimeRange
    // This needs to run after layers are created
    updateLayerMosaicRules(intervalTimeRange.start, intervalTimeRange.end);

    // Initial update of layer visibility and rendering based on default variable
    // This will be called again by the useEffect hook if the variable changes
    updateLayerVisibilityAndRendering(selectedVariableId);

    return view;
  };

  // Function to update mosaic rules based on interval start and end dates
  const updateLayerMosaicRules = (intervalStart, intervalEnd) => {
    if (!mapInstance.current || !intervalStart || !intervalEnd) return;

    const startEpoch = intervalStart.getTime();
    const endEpoch = intervalEnd.getTime();

    mapInstance.current.layers.forEach(layer => {
      // Check if it's an ImageryLayer and has the necessary config
      if (layer instanceof ImageryLayer && layer.customConfig?.variableName) {
        layer.mosaicRule = new MosaicRule({
          ascending: true,
          mosaicMethod: "esriMosaicCenter", // Or another method if needed
          multidimensionalDefinition: [{
            variableName: layer.customConfig.variableName, // Use variableName from stored config
            dimensionName: "StdTime", // Assuming this is correct
            values: [[startEpoch, endEpoch]],
            isSlice: false
          }],
          // mosaicOperation: "MT_MEAN" // Optional: if needed
        });
      }
    });
  };

  // --- NEW Function: Update Layer Visibility and Rendering based on Variable ---
  const updateLayerVisibilityAndRendering = (currentVariableId) => {
    if (!mapInstance.current || !currentVariableId) return;

    // Find the definition for the currently selected variable
    const variableDef = VARIABLE_DEFINITIONS[currentVariableId];
    if (!variableDef) {
      console.warn(`No definition found for variable: ${currentVariableId}`);
      return;
    }

    const defaultLayerId = variableDef.defaultLayerId;

    mapInstance.current.layers.forEach(layer => {
      if (!(layer instanceof ImageryLayer) || !layer.customConfig) {
        // Skip non-imagery layers or layers without customConfig
        return;
      }

      const layerConfig = layer.customConfig; // Get stored config

      if (layer.id === defaultLayerId) {
        // This is the layer to show for the current variable
        layer.visible = true;

        // Apply rendering rule based on colorMapType
        switch (layerConfig.colorMapType) {
          case 'Personalized':
            if (layerConfig.ColorMap) {
              // Create RasterFunction using the stored arguments
              layer.rasterFunction = new RasterFunction({
                functionName: "Colormap", // Assuming the top-level function is Colormap
                functionArguments: layerConfig.ColorMap, // Pass the stored object
                // outputPixelType might be needed depending on the function chain
                // outputPixelType: "U8" // Example, adjust if needed
              });
              console.log(`Applied Personalized Colormap to ${layer.id}`, layer.rasterFunction);
            } else {
              console.warn(`ColorMapType is Personalized but no ColorMap config found for ${layer.id}`);
              layer.rasterFunction = null; // Clear any existing function
            }
            break;
          case 'RasterFunction':
            // Placeholder: Implement logic to reference a service-defined raster function
            // Example: layer.rasterFunction = RasterFunction.fromJSON({ name: layerConfig.rasterFunctionName });
            console.warn(`RasterFunction type not yet implemented for ${layer.id}`);
            layer.rasterFunction = null; // Clear for now
            break;
          case 'noColorMap':
          default:
            // No specific rendering rule or default case
            layer.rasterFunction = null; // Ensure no raster function is applied
            break;
        }
      } else {
        // Hide layers not associated with the current variable
        layer.visible = false;
      }
    });
  };

  // --- Map Click Handler ---
  const handleMapClick = async (event) => {
    if (!viewInstance.current) return;

    const location = {
        latitude: event.mapPoint.latitude,
        longitude: event.mapPoint.longitude,
        spatialReference: event.mapPoint.spatialReference?.wkid
    };

    // Determine clicked layer ID (using the currently visible layer logic)
    let clickedLayerId = null;
    if (mapInstance.current) {
        // Find the currently visible layer based on the selected variable
        const variableDef = VARIABLE_DEFINITIONS[selectedVariableId];
        if (variableDef) {
            clickedLayerId = variableDef.defaultLayerId;
            // Optional: Verify this layer actually exists and is visible
            const activeLayer = mapInstance.current.findLayerById(clickedLayerId);
            if (!activeLayer || !activeLayer.visible) {
                clickedLayerId = null; // Reset if not found or not visible
            }
        }
    }

    updateClickDetails({
      location: location,
      componentId: 'mapView',
      layerId: clickedLayerId, // Pass the ID of the layer active for the current variable
    });
  };

  // --- Effects ---

  // Initialize Map on Mount
  useEffect(() => {
    initializeArcGIS();
    const view = initializeMap(); // initializeMap now calls createMapLayers and initial update

    let clickHandler = null;
    view.when(() => {
      clickHandler = view.on("click", handleMapClick);
    }).catch(error => {
        console.error("Error initializing MapView:", error);
    });

    return () => {
      if (clickHandler) clickHandler.remove();
      if (view) view.destroy();
      mapInstance.current = null;
      viewInstance.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Update Layer Mosaic Rules when Time Range Changes
  useEffect(() => {
    updateLayerMosaicRules(intervalTimeRange.start, intervalTimeRange.end);
  }, [intervalTimeRange]); // Dependency: time range

  // Update Layer Visibility and Rendering when Selected Variable Changes
  useEffect(() => {
    updateLayerVisibilityAndRendering(selectedVariableId);
  }, [selectedVariableId]); // Dependency: selected variable ID

  // --- Effect to Process Samples for Animation Time Ranges ---
  useEffect(() => {
    console.log("MapView: Animation/Samples Effect Triggered. isAnimating:", isAnimating, "rawSamples:", rawSamples ? `(${rawSamples.length} samples)` : 'null');

    if (isAnimating && rawSamples && rawSamples.length > 0) {
      console.log("MapView: Animation active and samples found. Processing time ranges...");
      const timeRangesMatrix = rawSamples.map(sample => {
        const stdTimeValue = sample?.attributes?.StdTime;
        if (stdTimeValue === undefined || stdTimeValue === null) {
          console.warn("MapView: Sample missing StdTime attribute:", sample);
          return null; // Skip samples without a valid time
        }

        try {
          // Assuming StdTime is epoch milliseconds or a string parsable by Date
          const sampleTimeMs = new Date(stdTimeValue).getTime();
          if (isNaN(sampleTimeMs)) {
            console.warn("MapView: Invalid date parsed from StdTime:", stdTimeValue);
            return null; // Skip samples with invalid dates
          }

          const oneMinuteMs = 60 * 1000;
          const timeBefore = sampleTimeMs - oneMinuteMs;
          const timeAfter = sampleTimeMs + oneMinuteMs;
          return [timeBefore, timeAfter];
        } catch (error) {
          console.error("MapView: Error processing sample time:", sample, error);
          return null; // Skip samples that cause errors
        }
      }).filter(range => range !== null); // Filter out any null entries from skipped samples

      console.log("MapView: Processed animation time ranges (ms):", timeRangesMatrix);

      // --- Call the new animation function ---
      if (viewInstance.current && timeRangesMatrix.length > 0) {
        animateMapTimeSlices(timeRangesMatrix, viewInstance.current, selectedVariableId, animationCancelRef);
      }
      // --- End Animation Time Range Effect ---

    } else if (isAnimating) {
      console.log("MapView: Animation active but no raw samples available yet.");
    } else {
      console.log("MapView: Animation not active.");
    }
  }, [isAnimating, rawSamples, selectedVariableId]); // Dependencies: animation status and raw samples

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

// --- New Function to Animate Map Time Slices ---
const animateMapTimeSlices = async (timeRangesMatrix, mapView, selectedVariableId, cancelRef) => {
    if (!mapView || !mapView.map || !selectedVariableId || !timeRangesMatrix || timeRangesMatrix.length === 0) {
        console.log("animateMapTimeSlices: Missing required parameters or empty time ranges.");
        return;
    }

    // Find the configuration for the currently selected variable's layer
    // Adjust find logic if a specific layer (e.g., 'Hourly') should always be used for animation
    const targetLayerConfig = Object.values(MAP_LAYERS).find(
        layer => layer.variableLabel === selectedVariableId
    );

    if (!targetLayerConfig || !targetLayerConfig.id || !targetLayerConfig.variableName) {
        console.error(`animateMapTimeSlices: Could not find valid layer config or variableName for variableLabel: ${selectedVariableId}`);
        return;
    }

    // Find the actual layer instance on the map
    const layer = mapView.map.layers.find(l => l.id === targetLayerConfig.id && l.type === 'imagery');

    if (!layer) {
        console.error(`animateMapTimeSlices: Layer instance with ID ${targetLayerConfig.id} not found on the map.`);
        return;
    }

    console.log(`animateMapTimeSlices: Starting animation loop for layer ${layer.id} with ${timeRangesMatrix.length} frames.`);

    let frameCounter = 0; // Counter for logging

    // Loop through each time range [startEpoch, endEpoch]
    for (const timeRange of timeRangesMatrix) {
        // --- Cancellation Check ---
        if (cancelRef.current) {
            console.log(`animateMapTimeSlices: Animation cancelled by user at frame ${frameCounter + 1}.`);
            break; // Exit the loop
        }
        // --- ---

        frameCounter++;
        const [startEpoch, endEpoch] = timeRange;

        // Create the new MosaicRule
        const mosaicRule = new MosaicRule({
            ascending: true,
            mosaicMethod: "esriMosaicCenter", // Or another method if needed
            multidimensionalDefinition: [{
                variableName: targetLayerConfig.variableName, // Use variableName from config
                dimensionName: "StdTime", // Assuming this is correct
                values: [[startEpoch, endEpoch]], // Use the specific time range for this frame
                isSlice: false
            }],
            // where: `StdTime >= ${startEpoch} AND StdTime <= ${endEpoch}` // Alternative if needed, check service capabilities
        });

        // Apply the MosaicRule to the layer - This initiates the request
        layer.mosaicRule = mosaicRule;
        console.log(`Frame ${frameCounter}: MosaicRule update posted for time range: ${new Date(startEpoch).toISOString()} - ${new Date(endEpoch).toISOString()}`);

        // Wait for 0.2 seconds (200 milliseconds) before posting the next request
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Log completion only if not cancelled mid-way
    if (!cancelRef.current) {
        console.log(`animateMapTimeSlices: Finished posting all ${frameCounter} animation frame requests for layer ${layer.id}.`);
    }

    // Optional: Reset mosaic rule after animation? Only if not cancelled?
    // if (!cancelRef.current) {
    //    layer.mosaicRule = null;
    // }
};
// --- End New Function ---

export default MapComponent; 