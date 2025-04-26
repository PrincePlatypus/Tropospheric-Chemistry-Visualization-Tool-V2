import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
// import { Chart, registerables } from 'chart.js'; // Example config import
import { useTime } from '../context/TimeContext';
import { useSpatial } from '../context/SpatialContext';
import { useVariable } from '../context/VariableContext';
import { MAP_LAYERS } from '../config/layers';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import Point from '@arcgis/core/geometry/Point';

// --- Helper Function to Prepare Parameters ---
const prepareFetchParameters = (intervalTimeRange, selectedVariableId, clickLocation) => {
    if (!intervalTimeRange || !selectedVariableId || !clickLocation) {
        console.warn("prepareFetchParameters (ChartOne): Missing required inputs.");
        return null;
    }

    // 1. Process Time Interval - Calculate Start and End of the Year from interval start
    const startDate = intervalTimeRange.start;
    const year = startDate.getFullYear();

    // --- Calculate Start of the Year ---
    const yearStart = new Date(year, 0, 1, 0, 0, 0, 0); // January is month 0

    // --- Calculate End of the Year ---
    const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999); // December is month 11

    const startEpochMs = yearStart.getTime();
    const endEpochMs = yearEnd.getTime() + 86400000;
    // --- ---

    // 2. Find the correct "Daily" Layer Config
    const targetLayerConfig = Object.values(MAP_LAYERS).find(layer =>
        layer.title.includes('Daily') && layer.variableLabel === selectedVariableId
    );

    if (!targetLayerConfig) {
        console.warn(`prepareFetchParameters (ChartOne): Could not find Daily layer config for variableLabel: ${selectedVariableId}`);
        return null;
    }

    // 3. Location is already prepared
    const location = clickLocation;

    return {
        startEpochMs, // Start of the year
        endEpochMs,   // End of the year
        layerConfig: targetLayerConfig,
        location,
        year,
    };
};

// --- Helper: Check for Leap Year ---
const isLeap = (year) => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

// --- Helper: Get Day of Year (1-366) ---
const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

// --- Component Name: ChartOne ---
const ChartOne = () => {
  // --- Context Hooks ---
  const { intervalTimeRange } = useTime();
  const { clickDetails } = useSpatial();
  const { selectedVariable } = useVariable();

  // --- Ref for Container (optional) ---
  const containerRef = useRef(null); // Changed from svgContainerRef

  // --- State ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actualChartData, setActualChartData] = useState(null); // Array of {dayOfYear, value, date}

  // --- Data Processing Function ---
  const processData = useCallback((rawData, layerConfig, targetYear) => {
    const processedDataForYear = [];
    const daysInYear = isLeap(targetYear) ? 366 : 365;

    // 1. Create a lookup map from the fetched samples
    const samplesMap = new Map();
    if (rawData?.samples && layerConfig?.variableName) {
        const variableKey = layerConfig.variableName;
        rawData.samples.forEach(sample => {
            const stdTime = sample.attributes?.StdTime;
            const valueStr = sample.attributes?.[variableKey];
            if (stdTime === undefined || valueStr === undefined) return; // Skip incomplete samples

            try {
                const date = new Date(stdTime);
                // Ensure sample belongs to the target year before processing
                if (date.getFullYear() !== targetYear) {
                    // console.warn(`processData (ChartOne): Sample date ${date.toISOString()} outside target year ${targetYear}. Skipping.`);
                    return;
                }

                const dayIndex = getDayOfYear(date); // Get day number (1-366)
                const numericValue = parseFloat(valueStr);

                // Store valid, non-negative values in the map
                if (!isNaN(numericValue) && numericValue >= 0) {
                    samplesMap.set(dayIndex, numericValue);
                } else {
                    // Optionally mark invalid/negative days specifically if needed later
                    // samplesMap.set(dayIndex, 'invalid'); // Example
                    console.warn(`processData (ChartOne): Invalid or negative value (${valueStr}) for day ${dayIndex}. Marking as null.`);
                    samplesMap.set(dayIndex, null); // Treat as missing if negative/invalid
                }
            } catch (e) {
                console.error("processData (ChartOne): Error processing sample", sample, e);
            }
        });
    }

    // 2. Generate the full year array
    for (let day = 1; day <= daysInYear; day++) {
        const currentDate = new Date(targetYear, 0, day); // Date object for the current day of the year
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const dayOfMonth = currentDate.getDate().toString().padStart(2, '0');
        const yearShort = targetYear.toString().slice(-2);
        const formattedDate = `${month}/${dayOfMonth}/${yearShort}`; // "MM/DD/YY"

        const value = samplesMap.has(day) ? samplesMap.get(day) : null; // Get value or null

        processedDataForYear.push({
            dayOfYear: day,       // Day number (1-366)
            value: value,         // Numeric value or null
            date: formattedDate   // Formatted date string "MM/DD/YY"
        });
    }

    console.log(`ChartOne: Processed Data for Year ${targetYear}:`, processedDataForYear);
    return processedDataForYear;

  }, []);

  // --- Fetch Function ---
  const fetchChartData = useCallback(async () => {
      // Need intervalTimeRange to determine the target year *before* calling prepare
      if (!intervalTimeRange) {
          console.warn("ChartOne Fetch Aborted: intervalTimeRange is not available yet.");
          setActualChartData([]);
          return;
      }
      const targetYear = intervalTimeRange.start.getFullYear(); // Get year from context

      const params = prepareFetchParameters(
          intervalTimeRange,
          selectedVariable?.id,
          clickDetails.location
      );
      if (!params) {
          setActualChartData([]);
          return;
      }
      // console.log(`ChartOne Fetch Triggered w/ Year Params | Time: ${new Date(params.startEpochMs).toISOString()}-${new Date(params.endEpochMs).toISOString()} | Layer: ${params.layerConfig.id} | Loc: ...`);

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
          const result = await layer.getSamples(query);
          console.log("ChartOne: getSamples Raw Result:", result);

          // --- Pass the targetYear to processData ---
          const processed = processData(result, params.layerConfig, targetYear);
          setActualChartData(processed);

      } catch (err) {
          console.error("ChartOne: Error fetching samples:", err);
          setError(err.message || 'Failed to fetch chart data');
          setActualChartData([]);
      } finally {
          setIsLoading(false);
      }
      // Add intervalTimeRange to dependencies as we read targetYear from it
  }, [intervalTimeRange, selectedVariable, clickDetails.location, processData]);

  // --- Effect to Trigger Fetch ---
  useEffect(() => {
      if (selectedVariable && clickDetails.location && intervalTimeRange) { // Ensure intervalTimeRange exists
          fetchChartData();
      } else {
          // console.log("ChartOne: Skipping fetch - Variable, Location or Time missing.");
          setActualChartData(null);
      }
      // Add intervalTimeRange here too
  }, [fetchChartData, selectedVariable, clickDetails.location, intervalTimeRange]);

  // --- Prepare data map for efficient lookup ---
  const { dayDataMap, minValue, maxValue } = useMemo(() => {
    if (!actualChartData) return { dayDataMap: new Map(), minValue: null, maxValue: null };

    let min = Infinity;
    let max = -Infinity;
    const map = new Map();

    actualChartData.forEach(item => {
      map.set(item.dayOfYear, item);
      if (item.value !== null) {
        if (item.value < min) min = item.value;
        if (item.value > max) max = item.value;
      }
    });

    // Handle cases where no valid data exists or only one value exists
    if (min === Infinity) min = null;
    if (max === -Infinity) max = null;
    if (min !== null && max !== null && min > max) { // Should not happen with >=0 check, but safe guard
        min = max = null;
    }

    return { dayDataMap: map, minValue: min, maxValue: max };
  }, [actualChartData]);

  // --- Get current year and layout info ---
  const currentYear = intervalTimeRange?.start.getFullYear();
  const yearStartDay = currentYear ? new Date(currentYear, 0, 1).getDay() : 0; // 0=Sun, 1=Mon, ..., 6=Sat
  const weekOffset = yearStartDay === 0 ? 6 : yearStartDay - 1; // 0=Mon, 1=Tue, ..., 6=Sun
  const daysInYear = currentYear ? (isLeap(currentYear) ? 366 : 365) : 0;

  // --- Placeholder Interaction Handlers ---
  const handleDayClick = (dayData) => {
    if (!dayData) return;
    console.log("Clicked:", dayData.date, "Value:", dayData.value);
    // TODO: Implement click interaction (e.g., trigger animation)
  };

  // --- Define Styles ---
  const DAY_LABEL_WIDTH_PX = 25; // Adjust as needed
  const PADDING_RIGHT_PX = 5; // Adjust as needed

  const gridContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%', // Take full width of parent
    height: '100%', // Take full height of parent
    color: '#000000', // Use app's text color
    gap: '2px',
    padding: '4px',
    boxSizing: 'border-box',
  };

  const headerStyle = {
    fontSize: '14px', // Adjust size
    padding: '2px 0 4px 0',
    textAlign: 'center',
    fontWeight: '500',
    flexShrink: 0, // Prevent header from shrinking
  };

  const gridStyle = {
    flex: 1, // Allow grid to grow and fill space
    display: 'grid',
    // Rows: 1 for week labels, 1 for the main grid content
    gridTemplateRows: 'auto 1fr',
    gap: '4px', // Gap between week labels and main grid
    overflow: 'hidden', // Prevent overflow issues
    minHeight: 0, // Necessary for flex item to shrink properly
  };

  const weekLabelsStyle = {
    display: 'grid',
    // Columns: 1 for day label spacer, 53 for weeks
    gridTemplateColumns: `${DAY_LABEL_WIDTH_PX}px repeat(53, 1fr)`,
    gap: '1px', // Fine gap between week labels
    fontSize: '10px',
    textAlign: 'center',
    color: '#555555', // Use app's secondary text color
    paddingRight: `${PADDING_RIGHT_PX}px`, // Match padding
    boxSizing: 'border-box',
    flexShrink: 0,
  };

  const mainGridStyle = {
    display: 'grid',
    // Columns: 1 for day labels, 53 for week data columns
    gridTemplateColumns: `${DAY_LABEL_WIDTH_PX}px repeat(53, 1fr)`,
    gap: '1px', // Fine gap between columns
    overflow: 'hidden', // Important for nested grid sizing
    minHeight: 0, // Important for nested grid sizing
    paddingRight: `${PADDING_RIGHT_PX}px`, // Match padding
    boxSizing: 'border-box',
  };

  const dayLabelsContainerStyle = {
    display: 'grid',
    // 7 rows for 7 days
    gridTemplateRows: 'repeat(7, 1fr)',
    gap: '1px', // Fine gap between day labels
    height: '100%', // Ensure it takes full height of its grid cell
  };

  const dayLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center the day letter
    fontSize: '10px',
    color: '#555555', // Use app's secondary text color
    boxSizing: 'border-box',
    padding: '0 2px', // Minimal padding
  };

  const weekColumnStyle = {
    display: 'grid',
    gridTemplateRows: 'repeat(7, 1fr)', // 7 days per week
    gap: '1px', // Fine gap between cells in a week
    minWidth: 0, // Prevent week columns from expanding unexpectedly
    minHeight: 0, // Ensure proper sizing within the grid
  };

  // --- Color Gradient Function ---
  // Define default colors (can be overridden by config/props later)
  // Example: Light Yellow to Dark Blue
  const COLOR_START = [255, 255, 204]; // R, G, B for light yellow
  const COLOR_END = [37, 52, 148];    // R, G, B for dark blue
  const NO_DATA_COLOR = '#eeeeee';

  const getCellColor = useCallback((value) => {
    if (value === null || value === undefined || minValue === null || maxValue === null) {
      return NO_DATA_COLOR; // Use the 'no data' color
    }

    // Handle case where min and max are the same
    if (minValue === maxValue) {
      // Return a middle color or the start/end color
      return `rgb(${Math.round((COLOR_START[0] + COLOR_END[0]) / 2)}, ${Math.round((COLOR_START[1] + COLOR_END[1]) / 2)}, ${Math.round((COLOR_START[2] + COLOR_END[2]) / 2)})`;
    }

    // Normalize the value to a 0-1 range
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    // Clamp just in case, though should not be needed with calculated min/max
    const clampedValue = Math.max(0, Math.min(1, normalizedValue));

    // Interpolate between start and end colors
    const r = Math.round(COLOR_START[0] + clampedValue * (COLOR_END[0] - COLOR_START[0]));
    const g = Math.round(COLOR_START[1] + clampedValue * (COLOR_END[1] - COLOR_START[1]));
    const b = Math.round(COLOR_START[2] + clampedValue * (COLOR_END[2] - COLOR_START[2]));

    return `rgb(${r}, ${g}, ${b})`;
  }, [minValue, maxValue]); // Depend on calculated min/max

  const cellStyle = (value, isValidDate) => ({
    backgroundColor: getCellColor(value), // Use the gradient color
    width: '100%',
    height: '100%',
    borderRadius: '1px',
    cursor: isValidDate ? 'pointer' : 'default',
    opacity: isValidDate ? 1 : 0.3,
    minWidth: 0,
    minHeight: 0,
    boxSizing: 'border-box',
  });

  const dayAbbreviations = ["M", "T", "W", "T", "F", "S", "S"]; // Monday first

  return (
    <div className="chart-container chart-one-container">
      {isLoading && <div className="chart-overlay">Loading...</div>}
      {error && <div className="chart-overlay error">Error: {error}</div>}

      {/* Main container for the CSS Grid heatmap */}
      <div ref={containerRef} style={gridContainerStyle}>
        {!isLoading && !error && actualChartData && currentYear && (
          <>
            {/* Header */}
            <div style={headerStyle}>
              {`Daily ${selectedVariable?.name || ''} - ${currentYear}`}
            </div>

            {/* Grid Layout (Week Labels + Main Grid) */}
            <div style={gridStyle}>
              {/* Week Labels Row */}
              <div style={weekLabelsStyle}>
                <div /> {/* Spacer for day labels column */}
                {Array.from({ length: 53 }).map((_, weekIndex) => (
                  <div key={`wl-${weekIndex}`}>
                    {/* Basic week label logic (e.g., every 4 weeks) */}
                    {(weekIndex + 1) % 4 === 0 ? weekIndex + 1 : ''}
                  </div>
                ))}
              </div>

              {/* Main Grid Content Row (Day Labels + Cells) */}
              <div style={mainGridStyle}>
                {/* Day Labels Column */}
                <div style={dayLabelsContainerStyle}>
                  {dayAbbreviations.map((day, index) => (
                    <div key={`dl-${index}`} style={dayLabelStyle}>
                      {/* Show labels only for M, W, F */}
                      {index === 0 || index === 2 || index === 4 ? day : ''}
                    </div>
                  ))}
                </div>

                {/* Data Cells Grid (53 Weeks) */}
                {Array.from({ length: 53 }).map((_, weekIndex) => (
                  <div key={`wc-${weekIndex}`} style={weekColumnStyle}>
                    {/* 7 Days per Week */}
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      // Calculate day of year (1-based)
                      const dayOfYear = weekIndex * 7 + dayIndex - weekOffset + 1;
                      const isValidDay = dayOfYear > 0 && dayOfYear <= daysInYear;
                      const dayData = isValidDay ? dayDataMap.get(dayOfYear) : null;
                      const value = dayData ? dayData.value : null;
                      const dateStr = dayData ? dayData.date : '';

                      return (
                        <div
                          key={`c-${weekIndex}-${dayIndex}`}
                          style={cellStyle(value, isValidDay && !!dayData)}
                          onClick={() => handleDayClick(dayData)}
                          title={isValidDay && dayData ? `${dateStr}: ${value !== null ? value.toExponential(2) : 'N/A'}` : (isValidDay ? 'No data' : '')}
                        />
                      );
                    })}
                  </div>
                ))}
              </div> {/* End Main Grid Content Row */}
            </div> {/* End Grid Layout */}
          </>
        )}
        {/* No Data Message */}
        {!isLoading && !error && actualChartData && actualChartData.length === 0 && (
             <div style={{ textAlign: 'center', padding: '20px', color: '#888', alignSelf: 'center' }}>
                 No valid data available for {currentYear || 'the selected year'}.
             </div>
         )}
      </div> {/* End Main Container */}
    </div> // End chart-container
  );
};

// --- Export ChartOne ---
export default ChartOne;
