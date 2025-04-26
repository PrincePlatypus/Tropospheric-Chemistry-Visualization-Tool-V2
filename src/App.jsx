import React from 'react';
import { TimeProvider } from './context/TimeContext';
import { SpatialProvider } from './context/SpatialContext';
import { VariableProvider } from './context/VariableContext';
import MapView from './components/MapView';
import TimeControl from './components/TimeControl';
import LocationInput from './components/LocationInput';
import VariableSelector from './components/VariableSelector';
import AnimationButton from './components/AnimationButton';
import ChartOne from './components/ChartOne';
import ChartTwo from './components/ChartTwo';
import ChartThree from './components/ChartThree';
import './App.css';
import './styles/TimeControl.css';
import './styles/LocationInput.css';
import './styles/VariableSelector.css';

function App() {
  return (
    <TimeProvider>
      <SpatialProvider>
        <VariableProvider>
          <div className="app-container">
            <div className="main-content-area">
              <div className="left-column">
                <div className="controls-wrapper">
                  <TimeControl />
                  <div className="location-variable-row">
                    <LocationInput />
                    <VariableSelector />
                    <AnimationButton />
                  </div>
                </div>
                <div className="component-wrapper" id="chart-one-wrapper">
                  <ChartOne />
                </div>
                <div className="component-wrapper" id="chart-two-wrapper">
                  <ChartTwo />
                </div>
              </div>
              <div className="right-column">
                <div className="component-wrapper" id="map-view-wrapper">
                  <MapView />
                </div>
                <div className="component-wrapper" id="chart-three-wrapper">
                  <ChartThree />
                </div>
              </div>
            </div>
          </div>
        </VariableProvider>
      </SpatialProvider>
    </TimeProvider>
  );
}

export default App;
