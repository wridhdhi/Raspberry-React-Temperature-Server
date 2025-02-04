// CardConfigDialog.js (updated)
import React, { useState } from 'react';
import './CardConfigDialog.css';

const CardConfigDialog = ({ onClose, onSubmit }) => {
  const [apiIp, setApiIp] = useState('');
  const [cardType, setCardType] = useState('temperature');

  const isValidIP = (ip) => /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);

  return (
    <div className="config-dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <h3>Configure Card</h3>
        <div className="form-group">
          <label>API IP Address:</label>
          <input
            type="text"
            value={apiIp}
            onChange={(e) => setApiIp(e.target.value)}
            placeholder="10.22.197.55"
          />
        </div>
        <div className="form-group">
          <label>Card Type:</label>
          <select value={cardType} onChange={(e) => setCardType(e.target.value)}>
            <option value="temperature">Temperature Sensor</option>
            <option value="chart">Temperature Chart</option>
            <option value="carousel">Switch Control</option>
          </select>
        </div>
        <div className="dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button 
            onClick={() => onSubmit({ apiIp, type: cardType })}
            disabled={!isValidIP(apiIp)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardConfigDialog;