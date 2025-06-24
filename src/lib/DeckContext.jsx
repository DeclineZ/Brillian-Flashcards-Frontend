// src/lib/DeckContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import decksJson from '../data/decks.json';

const DeckCtx = createContext();

export const useDecks = () => useContext(DeckCtx);

export function DeckProvider({ children }) {

  const [decks, setDecks] = useState(() => {
    const localDecks = localStorage.getItem('decks');
    return localDecks ? JSON.parse(localDecks) : decksJson;
  });


  useEffect(() => {
    localStorage.setItem('decks', JSON.stringify(decks));
  }, [decks]);

  return (
    <DeckCtx.Provider value={{ decks, setDecks }}>
      {children}
    </DeckCtx.Provider>
  );
}
