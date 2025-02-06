import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SwitchPopup.css';

const SwitchIdPopup = ({ currentId, onConfirm, onCancel }) => {
  const [newId, setNewId] = useState(currentId.toString());
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const numericId = parseInt(newId, 10);
    if (numericId > 0 && numericId <= 100) {
      onConfirm(numericId);
    } else {
      setError('Please enter a valid ID between 1-100');
    }
  };

  return (
    <div className="switchid-modal-overlay">
      <div className="switchid-modal">
        <div className="switchid-header">
          <h3>Configure Switch ID</h3>
          <button className="switchid-close" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="switchid-content">
          <input
            type="number"
            value={newId}
            onChange={(e) => {
              setNewId(e.target.value);
              setError('');
            }}
            min="1"
            max="100"
            className="switchid-input"
            placeholder="Enter Switch ID"
          />
          {error && <div className="switchid-error">{error}</div>}
        </div>

        <div className="switchid-actions">
          <button 
            className="switchid-button confirm"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
          <button 
            className="switchid-button cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

SwitchIdPopup.propTypes = {
  currentId: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default SwitchIdPopup;