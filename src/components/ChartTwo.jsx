import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Chart, registerables } from 'chart.js';
// Assuming you might have a config file, but not strictly needed for this basic version
// import { CHART_TWO } from '../config/componentConfig/chartTwo';
import { useTime } from '../context/TimeContext';
import { useSpatial } from '../context/SpatialContext';
import { useVariable } from '../context/VariableContext';
import { MAP_LAYERS } from '../config/layers'; // Import MAP_LAYERS
import ImageryLayer from '@arcgis/core/layers/ImageryLayer'; // Import ImageryLayer
import Point from '@arcgis/core/geometry/Point'; // Import Point

// Register necessary Chart.js components (do this once)
Chart.register(...registerables);

// --- Helper Function to Prepare Parameters ---
const prepareFetchParameters = (intervalTimeRange, selectedVariableId, clickLocation) => {
    if (!intervalTimeRange || !selectedVariableId || !clickLocation) {
        console.warn("prepareFetchParameters: Missing required inputs.");
        return null;
    }

    // 1. Process Time Interval
    const startDate = new Date(intervalTimeRange.start);
    const endDate = new Date(intervalTimeRange.end);

    // Start of the month for the start date
    const monthStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1, 0, 0, 0, 0);
    // End of the month for the end date
    // Go to the start of the *next* month, then subtract 1 millisecond
    const monthEnd = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1, 0, 0, 0, 0);
    monthEnd.setMilliseconds(monthEnd.getMilliseconds() - 1);

    const startEpochMs = monthStart.getTime();
    const endEpochMs = monthEnd.getTime();

    // 2. Find the correct "Monthly" Layer Config
    const targetLayerConfig = Object.values(MAP_LAYERS).find(layer =>
        layer.title.includes('Monthly') && layer.variableLabel === selectedVariableId
    );

    if (!targetLayerConfig) {
        console.warn(`prepareFetchParameters: Could not find Monthly layer config for variableLabel: ${selectedVariableId}`);
        return null; // Or handle this case as needed
    }

    // 3. Location is already prepared (assuming clickLocation has lat/lon)
    const location = clickLocation;

    return {
        startEpochMs,
        endEpochMs,
        layerConfig: targetLayerConfig, // The full layer object
        location,
    };
};

// --- Helper: Parse RGBA Color String ---
const parseRgba = (rgbaString) => {
    const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return null;
    return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: match[4] !== undefined ? parseFloat(match[4]) : 1, // Default alpha to 1 if not present
    };
};

// --- Helper: Interpolate between two colors ---
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

// --- Helper: Get Color from Ramp based on Value ---
const getColorForValue = (value, chartColorRamp) => {
    if (value === null || value === undefined || !chartColorRamp || !chartColorRamp.stops || chartColorRamp.stops.length === 0) {
        return 'rgba(128, 128, 128, 0.5)'; // Default grey for no data or invalid ramp
    }

    const stops = chartColorRamp.stops;

    // Find the appropriate segment in the color ramp
    let lowerStop = stops[0];
    let upperStop = stops[stops.length - 1];

    // Handle edge cases: value below first stop or above last stop
    if (value <= lowerStop.value) {
        return lowerStop.color;
    }
    if (value >= upperStop.value) {
        return upperStop.color;
    }

    // Find the two stops the value falls between
    for (let i = 0; i < stops.length - 1; i++) {
        if (value >= stops[i].value && value <= stops[i + 1].value) {
            lowerStop = stops[i];
            upperStop = stops[i + 1];
            break;
        }
    }

    // Parse the colors
    const color1 = parseRgba(lowerStop.color);
    const color2 = parseRgba(upperStop.color);

    if (!color1 || !color2) {
        console.warn("Could not parse stop colors:", lowerStop.color, upperStop.color);
        return 'rgba(128, 128, 128, 0.5)'; // Fallback grey
    }

    // Calculate interpolation factor
    const range = upperStop.value - lowerStop.value;
    const factor = (range === 0) ? 0 : (value - lowerStop.value) / range;

    // Interpolate and return the color
    return interpolateColor(color1, color2, factor);
};

const ChartTwo = () => {
  // --- Context Hooks ---
  const { intervalTimeRange } = useTime();
  const { clickDetails } = useSpatial();
  const { selectedVariable } = useVariable();

  // --- Refs for Chart ---
  const chartContainerRef = useRef(null); // Ref for the canvas element
  const chartInstanceRef = useRef(null); // Ref to store the Chart instance

  // --- State for Loading/Error (Optional but Recommended) ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- State for actual chart data ---
  const [actualChartData, setActualChartData] = useState(null);

  // --- Data Processing Function ---
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
                // --- Format date as "Mon 'YY" ---
                const monthName = date.toLocaleString('default', { month: 'short' });
                const yearShort = date.getFullYear().toString().slice(-2);
                const formattedDate = `${monthName} '${yearShort}`;
                // --- ---

                const numericValue = parseFloat(valueStr);
                if (isNaN(numericValue)) return null;
                return { month: formattedDate, value: numericValue }; // Use formattedDate
            } catch (e) {
                console.error("processData: Error processing sample", sample, e);
                return null;
            }
        }).filter(item => item !== null);

        // Sort by date (using the original StdTime before formatting)
        processedSamples.sort((a, b) => {
             // Need to re-parse or access original time if sorting is critical after formatting
             // For simplicity, assuming the service returns them mostly in order or sorting isn't strictly needed here
             // If strict chronological sort is needed, process needs adjustment
             return 0; // Placeholder - Assuming data is roughly ordered or exact order isn't critical for this chart type
        });

        console.log("ChartTwo: Processed Data for Chart:", processedSamples);
    }
    return processedSamples;
  }, []);

  // --- Fetch Function ---
  const fetchChartData = useCallback(async () => {
      const params = prepareFetchParameters(
          intervalTimeRange,
          selectedVariable?.id,
          clickDetails.location
      );
      if (!params) {
          setActualChartData([]); // Clear data if params invalid
          return;
      }
      // console.log(...) // Logging prepared params

      setIsLoading(true);
      setError(null);
      setActualChartData(null); // Clear previous data before fetch

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
          };
          // console.log("ChartTwo: Calling getSamples with query:", query);
          const result = await layer.getSamples(query);
          console.log("ChartTwo: getSamples Raw Result:", result);

          // --- Process data AND update state ---
          const processed = processData(result, params.layerConfig);
          setActualChartData(processed); // Update state with processed data

      } catch (err) {
          console.error("ChartTwo: Error fetching samples:", err);
          setError(err.message || 'Failed to fetch chart data');
          setActualChartData([]); // Set empty data on error
      } finally {
          setIsLoading(false);
      }
  }, [intervalTimeRange, selectedVariable, clickDetails.location, processData]); // processData is stable

  // --- Effect to Trigger Fetch ---
  useEffect(() => {
      if (selectedVariable && clickDetails.location) {
          fetchChartData();
      } else {
          // console.log("ChartTwo: Skipping fetch - Variable or Location missing.");
          setActualChartData(null); // Clear data if variable/location missing
      }
  }, [fetchChartData, selectedVariable, clickDetails.location]);


  // --- Effect to Create/Update Chart ---
  useEffect(() => {
    // --- Use actualChartData state ---
    const dataToDraw = actualChartData;
    const colorRamp = selectedVariable?.chartColorRamp; // Get the ramp

    // Only proceed if we have a canvas, a selected variable, AND data
    if (chartContainerRef.current && selectedVariable && dataToDraw && colorRamp) {

      // Destroy previous chart instance
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Check if there's actually data to plot
      if (dataToDraw.length > 0) {
          const ctx = chartContainerRef.current.getContext('2d');
          const labels = dataToDraw.map(item => item.month); // Use formatted month
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
                pointRadius: 4,
                pointHoverRadius: 6,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: { 
                  display: true, 
                  text: `Monthly ${selectedVariable.name}`, 
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
                    text: 'Month', 
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
          // Handle empty data case (e.g., clear canvas or show message)
          console.log("ChartTwo: No data available to display for the selected parameters.");
          // Optionally draw a "No Data" message on the canvas
          const ctx = chartContainerRef.current.getContext('2d');
          ctx.clearRect(0, 0, chartContainerRef.current.width, chartContainerRef.current.height); // Clear canvas
          ctx.font = "16px Arial";
          ctx.fillStyle = "#888888";
          ctx.textAlign = "center";
          ctx.fillText("No data available for this selection.", chartContainerRef.current.width / 2, chartContainerRef.current.height / 2);
          chartInstanceRef.current = null; // Ensure no chart instance exists
      }

    } else {
      // Destroy chart if variable is deselected or data is null (still loading/not fetched)
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
       // Optional: Clear canvas explicitly if needed when no variable/data
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
    // --- Update Dependencies ---
    // Now depends on the actual data state and the selected variable
  }, [selectedVariable, actualChartData]); // Removed processData dependency here


  return (
    // Use the base chart-container class for consistent padding/layout
    <div className="chart-container chart-two-container">
      {/* Optional: Display Loading/Error State */}
      {isLoading && <div className="chart-overlay">Loading...</div>}
      {error && <div className="chart-overlay error">Error: {error}</div>}

      {/* Chart Canvas Wrapper */}
      {/* The chart-canvas-wrapper class from App.css handles sizing */}
      <div className="chart-canvas-wrapper">
        <canvas ref={chartContainerRef}></canvas>
      </div>

      {/* Placeholder for data fetching status or errors */}
      {/* <div>Status: { selectedVariable && clickDetails.location ? 'Ready (using mock data)' : 'Waiting for variable/location...' }</div> */}
    </div>
  );
};

export default ChartTwo;
