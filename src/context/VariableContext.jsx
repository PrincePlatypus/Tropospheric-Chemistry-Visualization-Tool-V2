import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
// Import the default variable label from the config
import { VARIABLE_DEFINITIONS, DEFAULT_VARIABLE_LABEL } from '../config/layers';

// Define the structure and initial list of variables based on VARIABLE_DEFINITIONS keys
// This makes the context aware of the variables defined in layers.js
const INITIAL_VARIABLES = Object.keys(VARIABLE_DEFINITIONS).map(label => ({
  id: label, // Use the label (e.g., 'NO2') as the ID
  name: `${label} (${VARIABLE_DEFINITIONS[label].dimension})`, // Construct a name
  unit: VARIABLE_DEFINITIONS[label].unit,
  dimension: VARIABLE_DEFINITIONS[label].dimension,
  // Note: We might need a mapping back to specific layer IDs if needed elsewhere,
  // but for selection, the label (ID) is key.
}));


// 1. Create the Context
const VariableContext = createContext();

// 2. Create the Provider Component
export const VariableProvider = ({ children }) => {
  // State for the list of available variables (derived from config)
  const [availableVariables] = useState(INITIAL_VARIABLES);

  // State for the currently selected variable ID
  // Initialize with the DEFAULT_VARIABLE_LABEL from config
  const [selectedVariableId, setSelectedVariableId] = useState(() => {
      // Ensure the default label actually exists in our derived variables
      const defaultExists = INITIAL_VARIABLES.some(v => v.id === DEFAULT_VARIABLE_LABEL);
      if (defaultExists) {
          return DEFAULT_VARIABLE_LABEL;
      }
      // Fallback to the first available variable if the default isn't valid
      return INITIAL_VARIABLES.length > 0 ? INITIAL_VARIABLES[0].id : null;
  });

  // Function to update the selected variable
  const updateSelectedVariable = useCallback((variableId) => {
    const exists = availableVariables.some(v => v.id === variableId);
    if (exists) {
        setSelectedVariableId(variableId);
    } else {
        console.warn(`VariableContext: Attempted to select non-existent variable ID: ${variableId}`);
    }
  }, [availableVariables]);

  // Memoize the currently selected variable object for convenience
  const selectedVariable = useMemo(() => {
    // Find the variable object using the selected ID
    const variableConfig = VARIABLE_DEFINITIONS[selectedVariableId];
    if (variableConfig) {
        return {
            id: selectedVariableId,
            name: `${selectedVariableId} (${variableConfig.dimension})`, // Reconstruct name if needed
            unit: variableConfig.unit,
            dimension: variableConfig.dimension,
        };
    }
    return null; // Return null if the ID doesn't match anything in VARIABLE_DEFINITIONS
  }, [selectedVariableId]);

  // 3. Provide the state and update function to children
  const value = {
    availableVariables, // The list derived for the selector [{id, name, unit, dimension}]
    selectedVariableId, // The ID ('NO2', 'HCHO')
    selectedVariable,   // The full object for the selected variable {id, name, unit, dimension}
    updateSelectedVariable,
  };

  return (
    <VariableContext.Provider value={value}>
      {children}
    </VariableContext.Provider>
  );
};

// 4. Create a custom hook for easy consumption
export const useVariable = () => {
  const context = useContext(VariableContext);
  if (!context) {
    throw new Error('useVariable must be used within a VariableProvider');
  }
  return context;
};

export default VariableContext; 