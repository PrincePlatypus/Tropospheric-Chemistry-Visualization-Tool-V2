import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSpatial } from '../context/SpatialContext';
// Optional: Add some basic styling
// import '../styles/LocationInput.css';

// --- Define Initial Coordinates ---
const INITIAL_LAT = 34.05490771087037;
const INITIAL_LON = -118.24268282333111;

// Helper to format coordinates for display (consistent precision)
const formatCoord = (coord) => {
    return typeof coord === 'number' ? coord.toFixed(6) : '';
};

const LocationInput = () => {
  const { clickDetails, updateClickDetails } = useSpatial();

  // --- Initialize local state with formatted initial values ---
  const [localLat, setLocalLat] = useState(formatCoord(INITIAL_LAT));
  const [localLon, setLocalLon] = useState(formatCoord(INITIAL_LON));
  const [isValid, setIsValid] = useState(true);

  // Refs to store the last componentId and layerId from an external source
  const lastComponentIdRef = useRef(null);
  const lastLayerIdRef = useRef(null);

  // --- Effect to push initial coordinates to context on mount ---
  useEffect(() => {
    updateClickDetails({
        location: { latitude: INITIAL_LAT, longitude: INITIAL_LON },
        componentId: 'initialLoad', // Indicate the source is initial setup
        layerId: null, // No specific layer associated with initial load
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to update local state from context changes (and store external IDs)
  useEffect(() => {
    // Only react to external changes or the initial load setting
    if (clickDetails.componentId !== 'locationInput') {
        // Store the component/layer ID regardless of whether location exists
        lastComponentIdRef.current = clickDetails.componentId;
        lastLayerIdRef.current = clickDetails.layerId;

        if (clickDetails.location) {
            const { latitude, longitude } = clickDetails.location;
            const latStr = formatCoord(latitude); // Use consistent formatting
            const lonStr = formatCoord(longitude); // Use consistent formatting

            // Sync local state only if needed
            if (latStr !== localLat || lonStr !== localLon) {
                setLocalLat(latStr);
                setLocalLon(lonStr);
                setIsValid(true);
            }
        } else {
            // External source cleared the location
             if (localLat !== '' || localLon !== '') {
                setLocalLat('');
                setLocalLon('');
                setIsValid(true);
            }
        }
    }
  }, [clickDetails]); // Only depend on context changes

  // Validate latitude
  const validateLat = (lat) => {
    const num = parseFloat(lat);
    return !isNaN(num) && num >= -90 && num <= 90;
  };

  // Validate longitude
  const validateLon = (lon) => {
    const num = parseFloat(lon);
    return !isNaN(num) && num >= -180 && num <= 180;
  };

  // Handle input changes - These update local state directly
  const handleLatChange = (event) => {
    setLocalLat(event.target.value);
    setIsValid(true); // Reset validation state on change
  };

  const handleLonChange = (event) => {
    setLocalLon(event.target.value);
    setIsValid(true); // Reset validation state on change
  };

  // Commit changes to SpatialContext on blur or Enter
  const handleCommit = useCallback(() => {
    const latNum = parseFloat(localLat);
    const lonNum = parseFloat(localLon);

    if (validateLat(localLat) && validateLon(localLon)) {
      setIsValid(true);
      updateClickDetails({
        location: { latitude: latNum, longitude: lonNum },
        componentId: lastComponentIdRef.current, // Use stored ID
        layerId: lastLayerIdRef.current,     // Use stored ID
      });
    } else {
      setIsValid(false);
    }
  }, [localLat, localLon, updateClickDetails]); // Dependencies: local values and the update function

  // Handle Enter key press in inputs to trigger commit
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleCommit(); // Trigger the commit logic
      event.target.blur(); // Optionally remove focus
    }
  };


  return (
    <div className={`location-input-container ${!isValid ? 'invalid' : ''}`}>
      <label htmlFor="latitude">Lat:</label>
      <input
        type="number"
        id="latitude"
        name="latitude"
        value={localLat}
        onChange={handleLatChange} // Updates local state
        onBlur={handleCommit} // Commits local state to context
        onKeyDown={handleKeyDown} // Commits local state to context
        placeholder="Latitude (-90 to 90)"
        step="any"
        aria-invalid={!isValid}
      />
      <label htmlFor="longitude">Lon:</label>
      <input
        type="number"
        id="longitude"
        name="longitude"
        value={localLon}
        onChange={handleLonChange} // Updates local state
        onBlur={handleCommit} // Commits local state to context
        onKeyDown={handleKeyDown} // Commits local state to context
        placeholder="Longitude (-180 to 180)"
        step="any"
        aria-invalid={!isValid}
      />
      {!isValid && <span className="error-message">Invalid coords</span>}
    </div>
  );
};

export default LocationInput; 