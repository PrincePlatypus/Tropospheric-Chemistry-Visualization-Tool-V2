import React from 'react';
import MapComponent from './components/MapView';
import ChartOne from './components/ChartOne';
import ChartTwo from './components/ChartTwo';
import ChartThree from './components/ChartThree';
import TimeControl from './components/TimeControl';
import { UI_CONFIG } from './config/uiConfig';
import { MapProvider } from './context/MapContext';
import { TimeProvider } from './context/TimeContext';
import './App.css';
import './styles/TimeControl.css';

function App() {
  return (
    <TimeProvider>
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
          <div className="controls-container">
            <TimeControl />
          </div>
        </div>
      </MapProvider>
    </TimeProvider>
  );
}

export default App;
