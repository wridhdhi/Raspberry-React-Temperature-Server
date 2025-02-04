import React from 'react';
import TemperatureCard from './TemperatureCard';
import TemperatureChart from './TemperatureChart';
import './App.css';

const App = () => {
  const cards = [
    <TemperatureCard key="current" />,
    <TemperatureChart key="history" />,
    ...Array(4).fill(null).map((_, i) => (
      <div key={`placeholder-${i}`} className="card placeholder">
        <span>Sensor {i+3}</span>
        <p>Coming Soon</p>
      </div>
    ))
  ];

  return (
    <div className="App">
      <h1>Environment Monitoring Dashboard</h1>
      <div className="card-grid">{cards}</div>
    </div>
  );
};

export default App;