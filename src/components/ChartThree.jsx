import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Chart, registerables } from 'chart.js';
// import { CHART_THREE_CONFIG } from '../config/componentConfig/chartThree'; // Example config import
import { useTime } from '../context/TimeContext';
import { useSpatial } from '../context/SpatialContext';
import { useVariable } from '../context/VariableContext';
import { useChartThree } from '../context/ChartThreeContext'; // Import the context hook
import { MAP_LAYERS } from '../config/layers';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import Point from '@arcgis/core/geometry/Point';

Chart.register(...registerables);

// --- Helper Function to Prepare Parameters ---
// Modified to find HOURLY layers
const prepareFetchParameters = (intervalTimeRange, selectedVariableId, clickLocation) => {
    if (!intervalTimeRange || !selectedVariableId || !clickLocation) {
        console.warn("prepareFetchParameters (ChartThree): Missing required inputs.");
        return null;
    }

    // 1. Process Time Interval - Keep original interval for hourly
    const startEpochMs = intervalTimeRange.start.getTime();
    const endEpochMs = intervalTimeRange.end.getTime();

    // 2. Find the correct "Hourly" Layer Config
    const targetLayerConfig = Object.values(MAP_LAYERS).find(layer =>
        layer.title.includes('Hourly') && layer.variableLabel === selectedVariableId // Find HOURLY layer
    );

    if (!targetLayerConfig) {
        console.warn(`prepareFetchParameters (ChartThree): Could not find Hourly layer config for variableLabel: ${selectedVariableId}`);
        return null;
    }

    // 3. Location is already prepared
    const location = clickLocation;

    return {
        startEpochMs,
        endEpochMs,
        layerConfig: targetLayerConfig,
        location,
    };
};

// --- Helper: Parse RGBA Color String (Copied from ChartTwo) ---
const parseRgba = (rgbaString) => {
    const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return null;
    return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: match[4] !== undefined ? parseFloat(match[4]) : 1,
    };
};

// --- Helper: Interpolate between two colors (Copied from ChartTwo) ---
const interpolateColor = (color1, color2, factor) => {
    if (factor < 0) factor = 0;
    if (factor > 1) factor = 1;
    const result = {
        r: Math.round(color1.r + factor * (color2.r - color1.r)),
        g: Math.round(color1.g + factor * (color2.g - color1.g)),
        b: Math.round(color1.b + factor * (color2.b - color1.b)),
        a: color1.a + factor * (color2.a - color1.a),
    };
    return `rgba(${result.r}, ${result.g}, ${result.b}, ${result.a})`;
};

// --- Helper: Get Color from Ramp based on Value (Copied from ChartTwo) ---
const getColorForValue = (value, chartColorRamp) => {
    if (value === null || value === undefined || !chartColorRamp || !chartColorRamp.stops || chartColorRamp.stops.length === 0) {
        return 'rgba(128, 128, 128, 0.5)'; // Default grey
    }
    const stops = chartColorRamp.stops;
    let lowerStop = stops[0];
    let upperStop = stops[stops.length - 1];

    if (value <= lowerStop.value) return lowerStop.color;
    if (value >= upperStop.value) return upperStop.color;

    for (let i = 0; i < stops.length - 1; i++) {
        if (value >= stops[i].value && value <= stops[i + 1].value) {
            lowerStop = stops[i];
            upperStop = stops[i + 1];
            break;
        }
    }

    const color1 = parseRgba(lowerStop.color);
    const color2 = parseRgba(upperStop.color);
    if (!color1 || !color2) {
        console.warn("Could not parse stop colors:", lowerStop.color, upperStop.color);
        return 'rgba(128, 128, 128, 0.5)';
    }

    const range = upperStop.value - lowerStop.value;
    const factor = (range === 0) ? 0 : (value - lowerStop.value) / range;
    return interpolateColor(color1, color2, factor);
};

// --- Rename Component ---
const ChartThree = () => {
  // --- Context Hooks ---
  const { intervalTimeRange } = useTime();
  const { clickDetails } = useSpatial();
  const { selectedVariable } = useVariable();
  const { setFirstValue, updateRawSamples } = useChartThree(); // Get the new function

  // --- Refs for Chart ---
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // --- State ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actualChartData, setActualChartData] = useState(null);

  // --- Data Processing Function ---
  // Modified for Hourly data format
  const processData = useCallback((rawData, layerConfig) => {
    let processedSamples = [];
    if (rawData?.samples && layerConfig?.variableName) {
        const variableKey = layerConfig.variableName;
        processedSamples = rawData.samples.map(sample => {
            const stdTime = sample.attributes?.StdTime;
            const valueStr = sample.attributes?.[variableKey];
            if (stdTime === undefined || valueStr === undefined) return null;
            try {
                const date = new Date(stdTime);
                // --- Format date as "MM/YY HH:mm" ---
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
                const dayNumber = date.getDate().toString().padStart(2, '0');
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const formattedDate = `${month}/${dayNumber} ${hours}:${minutes}`; // e.g., "05/24 15:45"
                // --- ---
                const value = parseFloat(valueStr);
                if (isNaN(value)) return null; // Skip if value is not a number
                return { date: formattedDate, value: value, originalDate: date }; // Keep original date for sorting
            } catch (e) {
                console.error("Error processing sample:", sample, e);
                return null;
            }
        }).filter(item => item !== null); // Remove null entries

        // Sort by original date
        processedSamples.sort((a, b) => a.originalDate - b.originalDate);

        console.log("ChartThree: Processed Data for Chart:", processedSamples);
    } else {
        console.log("ChartThree: No samples found in raw data or missing layer config.");
    }
    return processedSamples;
  }, []);

  // --- Fetch Function ---
  // Updated console logs
  const fetchChartData = useCallback(async () => {
      const params = prepareFetchParameters(
          intervalTimeRange,
          selectedVariable?.id,
          clickDetails.location
      );
      if (!params) {
          console.log("ChartThree: Fetch parameters not ready.");
          setActualChartData(null); // Clear data if params invalid
          setFirstValue(null); // Clear context value
          return;
      }
      // console.log(`ChartThree Fetch Triggered w/ Prepared Params | Time: ${params.startEpochMs}-${params.endEpochMs} | Layer: ${params.layerConfig.id} | Loc: ...`);

      setIsLoading(true);
      setError(null);
      setFirstValue(null); // Clear context value before fetch

      try {
          const layer = new ImageryLayer({ url: params.layerConfig.url });
          const geometry = new Point({
              x: params.location.longitude,
              y: params.location.latitude,
              spatialReference: { wkid: 4326 }
          });
          const query = {
              geometry: geometry,
              timeExtent: { start: params.startEpochMs, end: params.endEpochMs },
              returnFirstValueOnly: false,
              returnGeometry: false,
              outFields: ["*"],
              orderByFields: ["StdTime ASC"] // Ensure results are sorted by time
          };
          // console.log("ChartThree: Calling getSamples with query:", query);
          const result = await layer.getSamples(query);
          console.log("ChartThree: getSamples Raw Result:", result);

          // --- Process data AND update state ---
          const processed = processData(result, params.layerConfig);
          setActualChartData(processed);

          // --- Update ChartThreeContext with the raw samples ---
          if (result && result.samples) {
              updateRawSamples(result.samples); // Call the context function
          } else {
              updateRawSamples(null); // Clear if no samples received
          }
          // --- ---

          // --- Update ChartThreeContext with the first value ---
          if (result?.samples && result.samples.length > 0 && params.layerConfig?.variableName) {
            const firstSample = result.samples[0];
            const variableKey = params.layerConfig.variableName;
            const valueStr = firstSample.attributes?.[variableKey];
            const firstNumericValue = valueStr !== undefined ? parseFloat(valueStr) : null;

            if (!isNaN(firstNumericValue) && firstNumericValue !== null) {
              setFirstValue(firstNumericValue); // Update context
            } else {
              console.warn("ChartThree: First sample value is not a valid number.", valueStr);
              setFirstValue(null); // Set context to null if value invalid
            }
          } else {
            console.log("ChartThree: No samples returned or variableName missing.");
            setFirstValue(null); // Set context to null if no samples
          }
          // --- ---

      } catch (err) {
          console.error("ChartThree: Error fetching samples:", err);
          setError(err.message || 'Failed to fetch chart data');
          setActualChartData([]);
          setFirstValue(null); // Clear context value on error
          updateRawSamples(null); // Clear raw samples on error
      } finally {
          setIsLoading(false);
      }
  }, [intervalTimeRange, selectedVariable, clickDetails.location, setFirstValue, processData, updateRawSamples]);

  // --- Effect to Trigger Fetch ---
  useEffect(() => {
      if (selectedVariable && clickDetails.location) {
          fetchChartData();
      } else {
          // console.log("ChartThree: Skipping fetch - Variable or Location missing.");
          setActualChartData(null);
          setFirstValue(null); // Clear context value if fetch skipped
      }
  }, [fetchChartData, selectedVariable, clickDetails.location, setFirstValue]); // Added setFirstValue dependency


  // --- Effect to Create/Update Chart ---
  // Updated titles and labels
  useEffect(() => {
    const dataToDraw = actualChartData;
    const colorRamp = selectedVariable?.chartColorRamp; // Get the ramp

    if (chartContainerRef.current && selectedVariable && dataToDraw && colorRamp) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      if (dataToDraw.length > 0) {
          const ctx = chartContainerRef.current.getContext('2d');
          const labels = dataToDraw.map(item => item.date); // Use formatted date string
          const dataValues = dataToDraw.map(item => item.value);

          // --- Generate color arrays using the helper function ---
          const pointColors = dataValues.map(value => getColorForValue(value, colorRamp));
          // --- ---

          chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: selectedVariable.name,
                data: dataValues,
                fill: false,
                tension: 0.1,
                pointBackgroundColor: pointColors,
                pointBorderColor: pointColors,
                segment: {
                  borderColor: ctx => getColorForValue(ctx.p0.parsed.y, colorRamp),
                },
                pointRadius: 3,
                pointHoverRadius: 5,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: { 
                  display: true, 
                  text: `Hourly ${selectedVariable.name}`, 
                  color: '#ffffff', 
                  font: { size: 16 } 
                },
                legend: { display: false },
                tooltip: {
                  titleColor: '#ffffff',
                  bodyColor: '#ffffff',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  callbacks: {
                    label: function(context) {
                      let label = context.dataset.label || '';
                      if (label) label += ': ';
                      if (context.parsed.y !== null) {
                        label += context.parsed.y.toFixed(2);
                      }
                      return label;
                    }
                  }
                }
              },
              scales: {
                y: { 
                  beginAtZero: false, 
                  title: { 
                    display: true, 
                    text: selectedVariable.unit, 
                    color: '#ffffff' 
                  }, 
                  ticks: { 
                    color: '#ffffff' 
                  }, 
                  grid: { 
                    color: '#333333' 
                  } 
                },
                x: { 
                  title: { 
                    display: true, 
                    text: 'Time (MM/YY HH:mm)', 
                    color: '#ffffff' 
                  }, 
                  ticks: { 
                    color: '#ffffff' 
                  }, 
                  grid: { 
                    color: '#333333' 
                  } 
                }
              }
            }
          });
      } else {
          // Handle empty data case
          console.log("ChartThree: No data available to display for the selected parameters.");
          const ctx = chartContainerRef.current.getContext('2d');
          ctx.clearRect(0, 0, chartContainerRef.current.width, chartContainerRef.current.height);
          ctx.font = "16px Arial";
          ctx.fillStyle = "#888888";
          ctx.textAlign = "center";
          ctx.fillText("No data available for this selection.", chartContainerRef.current.width / 2, chartContainerRef.current.height / 2);
          chartInstanceRef.current = null;
      }

    } else {
      // Destroy chart if variable deselected, data is null, or ramp missing
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
       if (chartContainerRef.current) {
           const ctx = chartContainerRef.current.getContext('2d');
           ctx.clearRect(0, 0, chartContainerRef.current.width, chartContainerRef.current.height);
       }
    }

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [selectedVariable, actualChartData]);


  return (
    // Updated class name
    <div className="chart-container chart-three-container">
      {isLoading && <div className="chart-overlay">Loading...</div>}
      {error && <div className="chart-overlay error">Error: {error}</div>}
      <div className="chart-canvas-wrapper">
        <canvas ref={chartContainerRef}></canvas>
      </div>
    </div>
  );
};

// --- Export ChartThree ---
export default ChartThree;
