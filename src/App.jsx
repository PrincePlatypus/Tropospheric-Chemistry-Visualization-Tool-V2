import React from 'react';
import MapComponent from './components/MapView';
import ChartOne from './components/ChartOne';
import ChartTwo from './components/ChartTwo';
import ChartThree from './components/ChartThree';
import { UI_CONFIG } from './config/uiConfig';
import './App.css';
import { MapProvider } from './context/MapContext';

function App() {
  return (
    <MapProvider>
      <div className="App">
        <div className="grid-container">
          <div className="grid-item top-left">
            <ChartOne />
          </div>
          <div className="grid-item top-right">
            <MapComponent />
          </div>
          <div className="grid-item bottom-left">
            <ChartTwo />
          </div>
          <div className="grid-item bottom-right">
            <ChartThree />
          </div>
        </div>
      </div>
    </MapProvider>
  );
}

export default App;
