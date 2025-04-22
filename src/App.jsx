import React from 'react';
import MapComponent from './components/MapView';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="grid-container">
        <div className="grid-item top-left">
          <h2>Top Left Section</h2>
        </div>
        <div className="grid-item top-right">
          <MapComponent />
        </div>
        <div className="grid-item bottom-left">
          <h2>Bottom Left Section</h2>
        </div>
        <div className="grid-item bottom-right">
          <h2>Bottom Right Section</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
