import React from 'react';
import { useAnimation } from '../../context/AnimationContext';
// Optional: Add some basic styling
import '../../styles/AnimationButton.css';

const AnimationButton = () => {
  const { startAnimation, isAnimating } = useAnimation();

  const handleClick = () => {
    startAnimation();
  };

  return (
    <button
      className="animation-button" // Add a class for styling
      onClick={handleClick}
      disabled={isAnimating}
      title={isAnimating ? "Animation in progress..." : "Start Hourly Animation"}
    >
      {isAnimating ? "Animating..." : "Animate Interval"}
    </button>
  );
};

export default AnimationButton;
