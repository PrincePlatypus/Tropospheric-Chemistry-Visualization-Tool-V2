import React from 'react';
import { useVariable } from '../context/VariableContext';
// Import the CSS for styling the buttons
import '../styles/VariableSelector.css';

const VariableSelector = () => {
  const {
    availableVariables,
    selectedVariableId,
    updateSelectedVariable
  } = useVariable();

  // The handler now directly receives the variable ID
  const handleClick = (variableId) => {
    updateSelectedVariable(variableId);
  };

  // Handle case where context might not be ready or has no variables
  if (!availableVariables || availableVariables.length === 0) {
    // Return null or a minimal placeholder for floating element
    return null;
  }

  return (
    // Container will be positioned via CSS
    <div className="variable-selector-container">
      {/* Label removed */}
      {/* Wrapper for the buttons */}
      <div className="variable-buttons-wrapper">
        {availableVariables.map((variable) => (
          <button
            key={variable.id}
            className={`variable-button ${selectedVariableId === variable.id ? 'active' : ''}`} // Apply 'active' class if selected
            onClick={() => handleClick(variable.id)} // Call handler with the variable ID
            type="button" // Explicitly set type to prevent form submission if ever nested
          >
            {variable.id} {/* Display variable ID (e.g., NO2) */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariableSelector; 