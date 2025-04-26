import React from 'react';
import { TimeProvider } from './context/TimeContext';
import { SpatialProvider } from './context/SpatialContext';
import { VariableProvider } from './context/VariableContext';
import { ChartThreeProvider } from './context/ChartThreeContext';
import MapView from './components/MapView';
import TimeControl from './components/TimeControl';
import LocationInput from './components/LocationInput';
import VariableSelector from './components/VariableSelector';
import AnimationButton from './components/AnimationButton';
import ChartOne from './components/ChartOne';
import ChartTwo from './components/ChartTwo';
import ChartThree from './components/ChartThree';
import Legend from './components/Legend';
import Value from './components/Value';
import './App.css';
import './styles/TimeControl.css';
import './styles/LocationInput.css';
import './styles/VariableSelector.css';
import './styles/Legend.css';
import './styles/Value.css';

function App() {
  return (
    <TimeProvider>
      <SpatialProvider>
        <VariableProvider>
          <ChartThreeProvider>
            <div className="app-container">
              <VariableSelector />
              <div className="main-content-area">
                <div className="left-column">
                  <div className="controls-wrapper">
                    <h3 className="controls-title">Tropospheric Chemistry Visualization Tool V2 </h3>
                    <h3 className="controls-subtitle">By: Project</h3>
                    <h3 className="controls-subtitle">----</h3>
                    <TimeControl />
                    <div className="location-variable-row">
                      <LocationInput />
                      <AnimationButton />
                    </div>
                    <Value />
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
                    <Legend />
                  </div>
                  <div className="component-wrapper" id="chart-three-wrapper">
                    <ChartThree />
                  </div>
                </div>
              </div>
            </div>
          </ChartThreeProvider>
        </VariableProvider>
      </SpatialProvider>
    </TimeProvider>
  );
}

export default App;
