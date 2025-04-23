import React from 'react';
import { useTime } from '../context/TimeContext';
import { startAnimationSampling } from '../hooks/animate/animateSamples';
// Optional: Add some basic styling
// import './AnimationButton.css';

const AnimationButton = ({ callerType = 'map', disabled = false }) => {
  const { intervalTimeRange } = useTime();

  const handleClick = () => {
    // For now, spatialParams is empty. This will need to be gathered
    // from the map context or other sources depending on the desired interaction.
    const spatialParams = {};

    startAnimationSampling(
      { start: intervalTimeRange.start, end: intervalTimeRange.end },
      spatialParams,
      callerType
    );
  };

  return (
    <button
      className="animation-button" // Add a class for styling
      onClick={handleClick}
      disabled={disabled}
      title="Start animation based on current time interval"
    >
      Animate Interval
    </button>
  );
};

export default AnimationButton;
