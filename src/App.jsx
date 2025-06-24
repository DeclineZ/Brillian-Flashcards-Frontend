import './App.css'
import Sidebar from './Sidebar.jsx';
import FlashcardDeckTable from './FlashcardDeckTable.jsx'
import CreateFlashcards from './CreateFlashcards.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useDecks } from './lib/DeckContext.jsx';

import DeckDetail from './DeckDetail.jsx'

import FlashcardPlayer from './FlashcardPlayer';

import CommunityPage from './CommunityPage.jsx';

import LearnerTypePage from './LearnerTypePage.jsx';

import Profile from './Profile.jsx'






function App() {
  const { decks } = useDecks();
  return (
    <BrowserRouter>
    <div className="flex h-screen w-full overflow-hidden">
      
      <Sidebar />                
      <main className="flex h-screen w-full">
        <Routes>
          <Route path="/" element={<FlashcardDeckTable decks={decks}/>} />
          <Route path="/create" element={<CreateFlashcards />} />
          <Route path="/learntogether" element={<CommunityPage />} />
          <Route path="/deck/:id" element={<DeckDetail />} />
          <Route path="/deck/:id/play" element={<FlashcardPlayer />} />
          <Route path="/LTP" element={<LearnerTypePage />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
    </BrowserRouter>
  );
}

export default App
