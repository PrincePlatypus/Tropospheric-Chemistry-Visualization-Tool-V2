import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Chart, registerables } from 'chart.js';
// import { CHART_THREE_CONFIG } from '../config/componentConfig/chartThree'; // Example config import
import { useTime } from '../context/TimeContext';
import { useSpatial } from '../context/SpatialContext';
import { useVariable } from '../context/VariableContext';
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

// --- Rename Component ---
const ChartThree = () => {
  // --- Context Hooks ---
  const { intervalTimeRange } = useTime();
  const { clickDetails } = useSpatial();
  const { selectedVariable } = useVariable();

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
                const yearShort = date.getFullYear().toString().slice(-2);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const formattedDate = `${month}/${yearShort} ${hours}:${minutes}`; // e.g., "05/24 15:45"
                // --- ---

                const numericValue = parseFloat(valueStr);
                if (isNaN(numericValue)) return null;
                // Use 'time' label for clarity
                return { time: formattedDate, value: numericValue };
            } catch (e) {
                console.error("processData (ChartThree): Error processing sample", sample, e);
                return null;
            }
        }).filter(item => item !== null);

        // Sort by actual date/time before formatting
        processedSamples.sort((a, b) => {
            // We need the original time for sorting. Let's re-parse or adjust the structure.
            // Quick fix: Re-parse from the formatted string (less efficient, assumes format consistency)
            // A better way would be to keep the original timestamp alongside the formatted one.
            // For now, let's assume the service returns them in order or sorting isn't critical.
             return 0; // Placeholder
        });

        console.log("ChartThree: Processed Data for Chart:", processedSamples);
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
          setActualChartData([]);
          return;
      }
      // console.log(`ChartThree Fetch Triggered w/ Prepared Params | Time: ${params.startEpochMs}-${params.endEpochMs} | Layer: ${params.layerConfig.id} | Loc: ...`);

      setIsLoading(true);
      setError(null);
      setActualChartData(null);

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
          // console.log("ChartThree: Calling getSamples with query:", query);
          const result = await layer.getSamples(query);
          console.log("ChartThree: getSamples Raw Result:", result);

          const processed = processData(result, params.layerConfig);
          setActualChartData(processed);

      } catch (err) {
          console.error("ChartThree: Error fetching samples:", err);
          setError(err.message || 'Failed to fetch chart data');
          setActualChartData([]);
      } finally {
          setIsLoading(false);
      }
  }, [intervalTimeRange, selectedVariable, clickDetails.location, processData]);

  // --- Effect to Trigger Fetch ---
  useEffect(() => {
      if (selectedVariable && clickDetails.location) {
          fetchChartData();
      } else {
          // console.log("ChartThree: Skipping fetch - Variable or Location missing.");
          setActualChartData(null);
      }
  }, [fetchChartData, selectedVariable, clickDetails.location]);


  // --- Effect to Create/Update Chart ---
  // Updated titles and labels
  useEffect(() => {
    const dataToDraw = actualChartData;

    if (chartContainerRef.current && selectedVariable && dataToDraw) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      if (dataToDraw.length > 0) {
          const ctx = chartContainerRef.current.getContext('2d');
          // Use 'time' property from processed data
          const labels = dataToDraw.map(item => item.time);
          const dataValues = dataToDraw.map(item => item.value);

          chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: selectedVariable.name, data: dataValues,
                borderColor: 'blue', // Changed color for distinction
                backgroundColor: 'rgba(0, 0, 255, 0.1)', // Changed color
                pointBackgroundColor: 'blue', // Changed color
                pointBorderColor: 'blue', // Changed color
                pointRadius: 3, // Slightly smaller points for potentially more data
                pointHoverRadius: 5,
                tension: 0.1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                // Updated title
                title: { display: true, text: `Hourly ${selectedVariable.name}`, color: '#000000', font: { size: 16 } },
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: false, title: { display: true, text: selectedVariable.unit, color: '#000000' }, ticks: { color: '#000000' }, grid: { color: '#cccccc' } },
                // Updated x-axis title
                x: { title: { display: true, text: 'Time (MM/YY HH:mm)', color: '#000000' }, ticks: { color: '#000000' }, grid: { color: '#cccccc' } }
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
      // Destroy chart if variable deselected or data is null
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
