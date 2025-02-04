// NumberCarousel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Carousel.css';

const NumberCarousel = () => {
  const [activeNumber, setActiveNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Positions for numbers arranged in a circle
  const numbers = [1, 2, 3, 4, 5, 6];
  const radius = 100; // Distance from center to number centers
  const center = 100; // Center of the 200px container

  useEffect(() => {
    // API call to fetch initial active number
    const fetchActiveNumber = async () => {
      try {
        const response = await axios.get('http://192.168.0.22:5000/switch');
        setActiveNumber(response.data.active_number);
        setLoading(false);
      } catch (err) {
        setError('Failed to load active number');
        setLoading(false);
      }
    };

    fetchActiveNumber();
  }, []);

  const handleNumberClick = async (number) => {
    try {
      await axios.post('http://192.168.0.22:5000/switch', { number });
      setActiveNumber(number);
    } catch (err) {
      setError('Failed to update active number');
    }
  };

  // Calculate positions using polar coordinates
  const getNumberPosition = (index) => {
    const angle = ((index * 60) - 90) * (Math.PI / 180); // 60° steps, offset to start at top
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  return (
    <div className="card carousel-card">
      <div className="card-content">
        <div className="carousel-text">
        <h2>Active Selection</h2>
        {error && <div className="card-content error">{error}</div>}
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
  );
};

export default NumberCarousel;