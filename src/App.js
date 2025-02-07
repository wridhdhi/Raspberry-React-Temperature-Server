// Updated App.js
import React, { useState, useEffect } from 'react';
import { loadConfig, saveConfig ,validateCache} from './services/configService';
import CardManager from './CardManager';
import './App.css';

// Initial state with default cards
const INITIAL_CARDS = [
  { id: 1, configured: true, type: 'temperature', apiIp: '10.22.197.212' },
  { id: 2, configured: true, type: 'chart', apiIp: '192.168.1.100' },
  { id: 3, configured: true, type: 'carousel', apiIp: '192.168.1.100' },
  { id: 4, configured: false }
];




const App = () => {
  const [cards, setCards] = useState(() => {
    const savedConfig = loadConfig();
    const validatedCards = validateCache(savedConfig?.cards || INITIAL_CARDS);
    return validatedCards.length > 0 ? validatedCards : INITIAL_CARDS;
  });

    // Save to localStorage whenever cards change
    useEffect(() => {
      saveConfig({ cards });
    }, [cards]);
  

  const handleUpdateCard = (updatedCard) => {
    setCards(cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
    
    // Add new placeholder if needed
    if(!cards.some(c => !c.configured)) {
      setCards(prev => [...prev, { id: Date.now(), configured: false }]);
    }
  };

  const handleRemoveCard = (cardId) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  return (
    <div className="App">
      <h1>Chilled Water and Switch Dashboard</h1>
      <div className="card-grid">
        {cards.map((card, index) => (
          <CardManager
            key={card.id}
            card={card}
            onUpdate={(updated) => handleUpdateCard({ ...updated, id: card.id })}
            onRemove={() => handleRemoveCard(card.id)}
            canRemove={index >= 3} // Only allow removal beyond initial 3
          />
        ))}
      </div>
    </div>
  );
};

export default App;