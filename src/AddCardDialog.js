// AddCardDialog.js
import React, { useState } from 'react';

const AddCardDialog = ({ open, onClose, onSave }) => {
  const [apiIp, setApiIp] = useState('');
  const [cardType, setCardType] = useState('temperature');

  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>Configure New Card</h3>
        <div className="form-group">
          <label>API IP Address:</label>
          <input
            type="text"
            value={apiIp}
            onChange={(e) => setApiIp(e.target.value)}
            placeholder="e.g., 192.168.1.100"
          />
        </div>
        <div className="form-group">
          <label>Card Type:</label>
          <select value={cardType} onChange={(e) => setCardType(e.target.value)}>
            <option value="temperature">Temperature</option>
            <option value="chart">History Chart</option>
            <option value="carousel">Selection Carousel</option>
          </select>
        </div>
        <div className="dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSave(apiIp, cardType)}>Save</button>
        </div>
      </div>
    </div>
  );
};