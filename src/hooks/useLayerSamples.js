import { useState, useEffect, useCallback } from 'react';
import { useTime } from '../context/TimeContext';
import { MAP_LAYERS } from '../config/layers';
import esriRequest from '@arcgis/core/request';
import MosaicRule from '@arcgis/core/layers/support/MosaicRule';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import Extent from '@arcgis/core/geometry/Extent';

// Helper to get the correct layer ID based on variable and interval
const getLayerIdForVariable = (variableName, interval) => {
  const intervalMap = { '1h': 'Hourly', '1d': 'Daily', '1m': 'Monthly' };
  const intervalSuffix = intervalMap[interval] || 'Daily'; // Default to Daily if interval is unexpected
  const layerId = `${variableName}_${intervalSuffix}`;
  // Check if this layer actually exists in our config
  return MAP_LAYERS[layerId] ? layerId : null;
};

// Helper to calculate time interval boundaries (similar to MapView)
const calculateTimeInterval = (currentTime, currentInterval) => {
  let intervalStartTime, intervalEndTime;
  switch (currentInterval) {
    case '1h':
      intervalStartTime = new Date(currentTime);
      intervalStartTime.setMinutes(0, 0, 0);
      intervalEndTime = new Date(intervalStartTime.getTime() + 60 * 60 * 1000);
      break;
    case '1m':
      intervalStartTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
      intervalEndTime = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 1);
      break;
    case '1d':
    default:
      intervalStartTime = new Date(currentTime);
      intervalStartTime.setHours(0, 0, 0, 0);
      intervalEndTime = new Date(intervalStartTime.getTime() + 24 * 60 * 60 * 1000);
      break;
  }
  return {
    startEpoch: intervalStartTime.getTime(),
    endEpoch: intervalEndTime.getTime(),
  };
};

/**
 * Custom hook to fetch sample data from ArcGIS Image Server layers.
 * @param {string[]} variableNames - Array of variable names to fetch (e.g., ['NO2', 'HCHO']).
 * @param {import('@arcgis/core/views/MapView').default} mapView - The MapView instance to get extent and spatial reference.
 * @param {number} [sampleCount=1000] - The desired number of samples.
 * @returns {{ loading: boolean, error: any, samples: object }} - State object with loading status, error, and fetched samples keyed by variable name.
 */
const useLayerSamples = (variableNames = [], mapView, sampleCount = 1000) => {
  const { timeRange, interval } = useTime();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [samples, setSamples] = useState({});
  const [currentExtent, setCurrentExtent] = useState(null);

  // Debounce extent updates
  useEffect(() => {
    if (!mapView) return;

    let debounceTimeout;
    const handleExtentChange = (newExtent) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        // Only update if extent actually changed significantly (optional optimization)
        if (!currentExtent || !currentExtent.equals(newExtent)) {
           console.log("Extent changed, updating state:", newExtent?.toJSON());
           setCurrentExtent(newExtent?.clone()); // Clone to ensure state update
        }
      }, 500); // 500ms debounce delay
    };

    // Use watch instead of on immediate: false for better debouncing control
    const watcher = mapView.watch('extent', handleExtentChange);

    // Initial extent
    if (mapView.extent) {
        setCurrentExtent(mapView.extent.clone());
    }


    return () => {
      clearTimeout(debounceTimeout);
      if (watcher) {
        watcher.remove();
      }
    };
  }, [mapView]); // Rerun only if mapView instance changes


  // Fetching logic
  const fetchData = useCallback(async () => {
    if (!variableNames || variableNames.length === 0 || !currentExtent || !mapView) {
      setSamples({}); // Clear samples if no variables or extent
      return;
    }

    setLoading(true);
    setError(null);
    console.log(`Fetching samples for: ${variableNames.join(', ')} within extent:`, currentExtent.toJSON());


    const { startEpoch, endEpoch } = calculateTimeInterval(timeRange.current, interval);
    const fetchedSamples = {};
    const promises = [];

    for (const varName of variableNames) {
      const layerId = getLayerIdForVariable(varName, interval);
      if (!layerId) {
        console.warn(`No matching layer found for variable '${varName}' and interval '${interval}'`);
        continue;
      }

      const layerConfig = MAP_LAYERS[layerId];
      if (!layerConfig || layerConfig.type !== 'ImageServer') {
        console.warn(`Layer '${layerId}' not found or not an ImageServer`);
        continue;
      }

      // Construct Mosaic Rule
      const mosaicRule = new MosaicRule({
        ascending: true, // Consider making this configurable if needed
        mosaicMethod: "esriMosaicCenter", // Consider making this configurable
        multidimensionalDefinition: [{
          variableName: layerConfig.variableName, // Use variableName from layer config
          dimensionName: "StdTime", // Assume StdTime, make configurable if needed
          values: [[startEpoch, endEpoch]],
          isSlice: false
        }],
        // mosaicOperation: "MT_FIRST" // Or others, depends on desired aggregation
      }).toJSON(); // Convert to JSON for the request

      // Construct getSamples parameters
      const queryParams = {
        f: 'json',
        geometry: JSON.stringify(currentExtent.toJSON()),
        geometryType: 'esriGeometryEnvelope',
        returnFirstValueOnly: false,
        outFields: layerConfig.variableName, // Request the specific variable
        mosaicRule: JSON.stringify(mosaicRule),
        sampleCount: sampleCount,
        returnGeometry: true, // Get sample locations
        // Use spatial reference from the view
        imageSR: mapView.spatialReference.wkid,
        // Consider adding pixelSize if needed for specific analyses
        // pixelSize: JSON.stringify({ x: mapView.resolution, y: mapView.resolution })
      };

      const requestUrl = `${layerConfig.url}/getSamples`;
      console.log(`Requesting: ${requestUrl} with params:`, queryParams);


      promises.push(
        esriRequest(requestUrl, { query: queryParams, responseType: 'json' })
          .then(response => {
            console.log(`Samples received for ${varName}:`, response.data);
            fetchedSamples[varName] = response.data; // Store samples keyed by variable name
          })
          .catch(err => {
            console.error(`Error fetching samples for ${varName}:`, err);
            // Store error per variable or set a general error flag
            setError(prev => ({ ...(prev || {}), [varName]: err }));
            fetchedSamples[varName] = null; // Indicate failure for this variable
          })
      );
    }

    try {
      await Promise.all(promises);
      setSamples(fetchedSamples);
    } catch (e) {
      // This catch might be redundant if individual errors are handled above,
      // but good for catching Promise.all itself failing.
      console.error("Error during Promise.all execution for getSamples:", e);
      // setError(e); // Set a general error if needed
    } finally {
      setLoading(false);
    }

  }, [variableNames, currentExtent, mapView, timeRange.current, interval, sampleCount]); // Dependencies for useCallback

  // Effect to trigger fetch when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData is memoized by useCallback

  return { loading, error, samples };
};

export default useLayerSamples; 