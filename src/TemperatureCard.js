// TemperatureCard.js
import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

const TemperatureCard = ({ apiUrl }) => {
  const [temperature, setTemperature] = useState(null);
  const [temperatures, setTemperatures] = useState([]);
  const [averageTemp, setAverageTemp] = useState(null);
  const [error, setError] = useState(null);

  const calculateProgress = (temp) => ((temp + 10) / 110) * 100;
  const getColor = (temp) => temp > 30 ? '#ffc400' : temp >= 19 ? '#00ff40' : '#ff0000';

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await axios.get(`${apiUrl}/temperature`);
        const temp = parseFloat(response.data.temperature_c);
        setTemperature(temp);
        setTemperatures(prevTemps => [...prevTemps, { value: temp, timestamp: Date.now() }]);
        setError(null);
      } catch (err) {
        setError('Failed to fetch temperature');
      }
    };

    fetchTemperature();
    const interval = setInterval(fetchTemperature, 5000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  useEffect(() => {
    const calculateAverageTemp = () => {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      const recentTemps = temperatures.filter(temp => temp.timestamp >= oneMinuteAgo);
      const sum = recentTemps.reduce((acc, temp) => acc + temp.value, 0);
      const avg = recentTemps.length ? sum / recentTemps.length : null;
      setAverageTemp(avg);
    };

    const interval = setInterval(calculateAverageTemp, 1000);
    return () => clearInterval(interval);
  }, [temperatures]);

  return (
    <div className="card temp-card">
      <div className="card-content">
        <div className="card-text">
          <h2>Live Temperature Sensor</h2>
          <div className="temperature-display">
            <span className="temperature-value" style={{ color: getColor(averageTemp) }}>
              {averageTemp !== null ? averageTemp.toFixed(1) : 'N/A'}°C
            </span>
            <span className="temperature-label">Average (last 1 min)</span>
          </div>
        </div>
        <div className="progress-container">
          <CircularProgressbar
            value={temperature !== null ? calculateProgress(temperature) : 0}
            text={`${temperature !== null ? temperature.toFixed(2) : 'N/A'}°C`}
            styles={buildStyles({
              textColor: getColor(temperature),
              pathColor: getColor(temperature),
            })}
          />
        </div>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default TemperatureCard;