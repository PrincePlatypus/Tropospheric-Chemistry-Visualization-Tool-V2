import React from 'react';
import { useVariable } from '../context/VariableContext';
// Optional: Add some basic styling
// import '../styles/VariableSelector.css';

const VariableSelector = () => {
  const {
    availableVariables,
    selectedVariableId,
    updateSelectedVariable
  } = useVariable();

  const handleChange = (event) => {
    updateSelectedVariable(event.target.value);
  };

  // Handle case where context might not be ready or has no variables
  if (!availableVariables || availableVariables.length === 0) {
    return <div>Loading variables...</div>; // Or some other placeholder
  }

  return (
    <div className="variable-selector-container">
      <label htmlFor="variable-select">Variable:</label>
      <select
        id="variable-select"
        value={selectedVariableId || ''}
        onChange={handleChange}
      >
        {/* Optional: Add a default disabled option */}
        {/* <option value="" disabled>-- Select Variable --</option> */}

        {availableVariables.map((variable) => (
          <option key={variable.id} value={variable.id}>
            {variable.name} {/* Display user-friendly name */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VariableSelector; 