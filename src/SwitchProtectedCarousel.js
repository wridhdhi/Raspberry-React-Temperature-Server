// NumberCarousel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SwitchIdPopup from './SwitchPopup';
import './Carousel.css';
import './SwitchPopup.css'; // Add this line

const PasscodeModal = ({apiUrl, targetNumber, onVerify, onCancel }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleInput = (e) => {
    if (e.key === 'Enter' && input.length === 4) {
      handleSubmit();
    } else if (e.key === 'Backspace') {
      setInput(prev => prev.slice(0, -1));
    } else if (/^\d$/.test(e.key) && input.length < 4) {
      setInput(prev => prev + e.key);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${apiUrl}/verify-passcode`, {
        passcode: input,
        number: targetNumber
      });
      
      if (response.data.success) {
        onVerify();
      } else {
        setError('Invalid passcode');
        setInput('');
      }
    } catch (err) {
      setError('Verification failed');
      setInput('');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleInput);
    return () => window.removeEventListener('keydown', handleInput);
  }, [input]);

  return (
    <div className="modal-overlay">
      <div className="passcode-panel">
        <div className="passcode-header">
          <h3>Enter 4-Digit Passcode to Change to {targetNumber}</h3>
        </div>
        
        <div className="passcode-display">
          {Array(4).fill(0).map((_, i) => (
            <div 
              key={i}
              className={`passcode-square ${i < input.length ? 'filled' : ''}`}
            >
              {i < input.length ? '•' : ''}
            </div>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="panel-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="confirm-btn"
            onClick={handleSubmit}
            disabled={input.length !== 4}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const NumberProtectedCarousel = ({ apiUrl }) => {
  const [activeNumber, setActiveNumber] = useState(1);
  const [lastActiveNumber, setLastActiveNumber] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [targetNumber, setTargetNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //added later
  const [showIdPopup, setShowIdPopup] = useState(false);
  const [switchId, setSwitchId] = useState(1);

  useEffect(() => {
    const fetchActiveNumber = async () => {
      try {
        const response = await axios.get(`${apiUrl}/switch`);
        setSwitchId(response.data.switch_id);
        setActiveNumber(response.data.active_number);
        setLastActiveNumber(response.data.lastActiveNumber);
        setLoading(false);
      } catch (err) {
        setError('Failed to load active number');
        setLoading(false);
      }
    };

    fetchActiveNumber();
  }, [apiUrl]);

  const handleNumberClick = (number) => {
    if (number !== activeNumber) {
      setTargetNumber(number);
      setShowModal(true);
    }
  };

  const handleVerify = async () => {
    try {
      await axios.post(`${apiUrl}/switch`, { 
        switch_id: switchId,
        number: targetNumber 
      });
      setLastActiveNumber(activeNumber);
      setActiveNumber(targetNumber);
      setShowModal(false);
    } catch (err) {
      setError('Failed to update active number');
      setShowModal(false);
    }
  };

  const handleSwitchIdChange = (newId) => {
    setSwitchId(newId);
    setShowIdPopup(false);
    // Add logic here to refresh data if needed
  };

    
  // Positions for numbers arranged in a circle
  const numbers = [1, 2, 3, 4, 5, 6];
  const radius = 100; // Distance from center to number centers
  const center = 100; // Center of the 200px container

// Calculate positions using polar coordinates
  const getNumberPosition = (index) => {
    const angle = ((index * 60) - 90) * (Math.PI / 180); // 60° steps, offset to start at top
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
    <div className="card carousel-card">
      <div className="card-content">
        <div className="carousel-header carousel-text">
          <h1
            className="switch-id-button"
            onClick={() => setShowIdPopup(true)}
          >
            {switchId}
          </h1>
          <h2>Active Switch </h2>
          <div className="last-active">
            Last Position : {loading ? '--' : lastActiveNumber}
          </div>
        </div>
        
        <div className="carousel-container">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <div className="dial-ring"></div>
              <div className="active-center">{activeNumber}</div>
              {numbers.map((number, index) => {
                const { x, y } = getNumberPosition(index);
                return (
                  <button
                    key={number}
                    className="dial-number"
                    style={{
                      left: x,
                      top: y,
                    }}
                    onClick={() => handleNumberClick(number)}
                  >
                    {number}
                  </button>
                );
              })}
            </>
          )}
        </div>
        
        
      </div>
    </div>
    {showModal && (
          <PasscodeModal
            apiUrl={apiUrl}
            targetNumber={targetNumber}
            onVerify={handleVerify}
            onCancel={() => setShowModal(false)}
          />
        )}
      
      {showIdPopup && (
        <SwitchIdPopup
          currentId={switchId}
          onConfirm={handleSwitchIdChange}
          onCancel={() => setShowIdPopup(false)}
        />
      )}
    </>
  );
};

export default NumberProtectedCarousel;