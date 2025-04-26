import React from 'react';
import { useAnimation } from '../../context/AnimationContext';
import '../../styles/AnimationModal.css'; // Corrected path: Go up two levels

const AnimationModal = () => {
  const {
    showAnimationModal,
    closeAnimationModal,
    startAnimation,
    availableAnimationTypes
  } = useAnimation();

  if (!showAnimationModal) {
    return null; // Don't render if not visible
  }

  const handleTypeSelect = (type) => {
    startAnimation(type);
  };

  return (
    <div className="animation-modal-overlay">
      <div className="animation-modal-content">
        <h3>Select Animation Type</h3>
        <div className="animation-modal-options">
          {availableAnimationTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="animation-modal-button"
            >
              {type}
            </button>
          ))}
        </div>
        <button
          onClick={closeAnimationModal}
          className="animation-modal-button cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AnimationModal; 