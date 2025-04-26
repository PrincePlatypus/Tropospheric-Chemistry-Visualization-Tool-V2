import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { useTime } from './TimeContext'; // Import useTime
import { useSpatial } from './SpatialContext'; // Import useSpatial
import { startAnimationSampling } from '../hooks/animate/useAnimations'; // Import the sampling function

// Define available animation types (can be moved to config later)
// const ANIMATION_TYPES = ['Daily', 'Hourly', 'Monthly']; // No longer needed for selection

// Create the context
const AnimationContext = createContext(null);

// Create the provider component
export const AnimationProvider = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(false); // Is an animation loading/running?
  const [animationType, setAnimationType] = useState(null); // Which type was selected?
  // Remove modal state: const [showAnimationModal, setShowAnimationModal] = useState(false);

  // Get time and spatial context needed for sampling
  const { intervalTimeRange } = useTime();
  const { clickDetails } = useSpatial(); // Assuming clickDetails holds the relevant location

  // Remove modal functions: openAnimationModal, closeAnimationModal

  const startAnimation = useCallback(() => {
    // Directly set type to Hourly and start loading
    const type = 'Hourly'; // Hardcode the type
    setAnimationType(type);
    setIsAnimating(true);
    // setShowAnimationModal(false); // No modal to close

    console.log(`Animation started with type: ${type}`);

    // --- Trigger the actual animation data fetching/processing here ---
    // Gather necessary parameters
    const timeParams = { start: intervalTimeRange.start, end: intervalTimeRange.end };
    // Use clickDetails or define default/other spatial params as needed
    const spatialParams = clickDetails ? { location: clickDetails.mapPoint } : {}; // Example: use map click point

    // Call the sampling function (imported from useAnimations.js)
    // Pass the animation type for potential use within the sampling logic
    startAnimationSampling(timeParams, spatialParams, type);

    // Note: The actual display/handling of animation frames will need further implementation
    // likely involving setting state based on the results of startAnimationSampling

  }, [intervalTimeRange, clickDetails]); // Add dependencies

  const cancelAnimation = useCallback(() => {
    setIsAnimating(false);
    setAnimationType(null);
    console.log("Animation cancelled.");
    // --- TODO: Add logic here to stop any ongoing animation processes ---
    // This might involve aborting fetch requests or clearing animation timers.
  }, []);

  // Memoize the context value
  const contextValue = useMemo(() => ({
    isAnimating,
    animationType,
    // Remove modal-related values: showAnimationModal, availableAnimationTypes
    // Remove modal functions: openAnimationModal, closeAnimationModal,
    startAnimation,
    cancelAnimation,
  }), [isAnimating, animationType, startAnimation, cancelAnimation]); // Update dependencies

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

// Custom hook to use the context
export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === null) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};
