import React, { useState } from 'react';
import TemperatureCard from './TemperatureCard';
import TemperatureChart from './TemperatureChart';
import NumberCarousel from './SwitchCarousel';
import NumberProtectedCarousel from './SwitchProtectedCarousel';

import CardConfigDialog from './CardConfigDialog';
import './CardManager.css';

const CardManager = ({ card, canRemove, onRemove, onUpdate }) => {
  const [showConfig, setShowConfig] = useState(false);

  const handleConfigSubmit = (config) => {
    onUpdate({ ...card, ...config, configured: true });
    setShowConfig(false);
  };

  const handleCloseDialog = () => {
    setShowConfig(false);
  };

  return (
    <>
      <div className="card-container">
        {card.configured ? (
          <>
            <button className="close-btn" onClick={() => canRemove ? onRemove() : onUpdate({ ...card, configured: false })}>
              ×
            </button>
            {card.type === 'temperature' && <TemperatureCard apiUrl={`http://${card.apiIp}:5000`} />}
            {card.type === 'chart' && <TemperatureChart apiUrl={`http://${card.apiIp}:5000`} />}
            {card.type === 'carousel' && <NumberProtectedCarousel apiUrl={`http://${card.apiIp}:5000`} />}
          </>
        ) : (
          <div className="add-card" onClick={() => setShowConfig(true)}>
            <span className="plus-sign">+</span>
          </div>
        )}
      </div>
      {showConfig && (
        <CardConfigDialog 
          onClose={handleCloseDialog}
          onSubmit={handleConfigSubmit}
        />
      )}
      
    </>
  );
};

export default CardManager;