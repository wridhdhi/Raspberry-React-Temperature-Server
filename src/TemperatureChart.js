import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './ChartCard.css';

const TemperatureChart = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://192.168.0.22:5000/history');
        const formattedData = response.data.map(entry => ({
          time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: entry.temperature_c
        }));
        
        const filteredData = formattedData.filter((_, index) => index % 5 === 0);
        setHistory(filteredData); // Display every 5th item
        console.log(formattedData);
        setError(null);
      } catch (err) {
        setError('Failed to load historical data');
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 60000); // Update every 5-minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card chart-card">
      <div className="card-content">
        <h2>Temperature History</h2>
        <p className="chart-subtitle">Last 60 Minutes</p>
        {error && <div className="error">{error}</div>}
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke= "#f0f0f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#7f8c8d', fontSize: 12 }}
                interval={2}
              />
              <YAxis 
                tick={{ fill: '#7f8c8d', fontSize: 12 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#1423ff" 
                strokeWidth={2}
                dot={{ fill:'-#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;