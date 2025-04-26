import React from 'react';
import { useAnimation } from '../../context/AnimationContext';
import '../../styles/LoadingOverlay.css'; // Corrected path: Go up two levels

const LoadingOverlay = () => {
  const { isAnimating, cancelAnimation, animationType } = useAnimation();

  if (!isAnimating) {
    return null; // Don't render if not animating
  }

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner"></div> {/* Basic CSS spinner */}
        <p>Loading {animationType} Animation...</p>
        <button onClick={cancelAnimation} className="loading-cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoadingOverlay; 