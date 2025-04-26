import React from 'react';
import MapComponent from './components/MapView';
import ChartOne from './components/ChartOne';
import ChartTwo from './components/ChartTwo';
import ChartThree from './components/ChartThree';
import TimeControl from './components/TimeControl';
import AnimationButton from './components/AnimationButton';
import LocationInput from './components/LocationInput';
import VariableSelector from './components/VariableSelector';
import { MapProvider } from './context/MapContext';
import { TimeProvider } from './context/TimeContext';
import { SpatialProvider } from './context/SpatialContext';
import { VariableProvider } from './context/VariableContext';
import './App.css';
import './styles/TimeControl.css';
import './styles/LocationInput.css';
import './styles/VariableSelector.css';

function App() {
  return (
    <TimeProvider>
      <SpatialProvider>
        <VariableProvider>
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
                <LocationInput />
                <VariableSelector />
                <AnimationButton />
              </div>
            </div>
          </MapProvider>
        </VariableProvider>
      </SpatialProvider>
    </TimeProvider>
  );
}

export default App;
