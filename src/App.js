// App.js
import React from 'react';
import TemperatureCard from './TemperatureCard';
import './App.css';

const App = () => {
  // Create an array of 6 items (1 real card + 5 placeholders)
  const cards = [...Array(6)].map((_, i) => i === 0 ? 
    <TemperatureCard key="temperature" /> : 
    <div key={i} className="card placeholder"><span>Coming Soon</span></div>
  );

  return (
    <div className="App">
      <h1>Environment Monitoring Dashboard</h1>
      <div className="card-grid">{cards}</div>
    </div>
  );
};

export default App;