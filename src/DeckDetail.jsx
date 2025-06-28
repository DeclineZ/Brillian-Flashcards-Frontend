// src/pages/DeckDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useDecks } from './lib/DeckContext.jsx';
import { BarChart, Settings, Play,Layers,  Share2, BookOpen, List, Pencil, Check, PlusCircle, Plus, Trash2, ListIcon, NotebookText} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid'
import StatsPopup from './StatsPopup';

import SummaryTab     from './SummaryTab'
import FlashcardsTab  from './FlashcardsTab'
import QuizTab        from './QuizTab'

import openDiagramInNewTab from './lib/openDiagram';

export default function DeckDetail() {
  const [viewMode,       setViewMode]       = useState('summary');
  const [pulse, setPulse] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  
  
  
  const [taxonomyCounts, setTaxonomyCounts] = useState({});
  const [quizCount,       setQuizCount]       = useState(0);

  const handlePopUpAction = (action) => {
    if (action === 'quiz') {
      navigate(`/deck/${deck.id}/quiz/0`);
    } else if (action === 'summary') {
      setViewMode('summary');
    } else if (action === 'cards') {
      navigate(`/deck/${deck.id}/play`);
    }
    setShowPopUp(false);
  };

  const [showStats, setShowStats] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showSettings,   setShowSettings]   = useState(false);
  const { decks, setDecks } = useDecks();
  const { id }              = useParams();
  const deck = decks.find((d) => String(d.id) === id);
  const navigate            = useNavigate();

  function handleShareClick() {
    setShowSharePopup(true);
  }

  function resetPoints() {
    setDecks(prevDecks =>
      prevDecks.map(d =>
        d.id === deck.id
          ? {
              ...d,
              cards: d.cards.map(card => ({ ...card, point: 0 }))  
            }
          : d
      )
    );
  }

  const handlePlay = () => {
  if (viewMode === 'summary') {
  const svg = document.querySelector('.mermaid svg');
  if (svg) openDiagramInNewTab(svg);
  else alert('ยังไม่มีไดอะแกรมที่ถูกเรนเดอร์บนหน้านี้');

  }  else if (viewMode === 'cards') {
    const now = Date.now();
    const dueCount = deck.cards.filter(
      c => new Date(c.nextReview).getTime() <= now
    ).length;
    if (dueCount === 0) {
      return alert('No cards due for review right now. Come back tomorrow!');
    }
    navigate(`/deck/${deck.id}/play`);
  } else if (viewMode === 'quiz') {
    navigate(`/deck/${deck.id}/quiz/0`);
  }
};

  const [newQ, setNewQ]           = useState('')
  const [newA, setNewA]           = useState('')
  const [adding, setAdding]       = useState(false)
  const newFileRef                = useRef()
  const [newFileObj, setNewFileObj] = useState(null)
  const [newImgUrl, setNewImgUrl] = useState('')

  

  function cancelAdd() {
    setAdding(false)
    setNewQ('')
    setNewA('')
    setNewImgUrl('')
    setNewFileObj(null)
  }

  function saveNewCard() {
      if (!newQ.trim() || !newA.trim()) {
        return alert('Q and A are required')
      }
      const card = {
        id:       uuid(),
        question: newQ.trim(),
        answer:   newA.trim(),
        keyword:  '',          
        needs_image: !!newImgUrl,
        image:    newImgUrl,
        point:     0,
        repetitions: 0,
        interval:  0,
        ef:        2.5,
        due:       new Date().toISOString().slice(0,10),
        taxonomy: 'Manual'
      }
      const updated = decks.map(d =>
        d.id !== deck.id
          ? d
          : { ...d, cards: [card, ...d.cards], total: d.total + 1, due: d.due + 1 }
      )
      setDecks(updated)
      localStorage.setItem('decks', JSON.stringify(updated))
      cancelAdd()
    }

    const shareLink = `https://relian.com/deck/${deck.id}?share=true`;

    function copyLink() {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  }

  function resetDueDates() {
    const nowISO = new Date().toISOString();
    const updatedDecks = decks.map(d =>
      d.id !== deck.id
        ? d
        : {
            ...d,
            cards: d.cards.map(card => ({
              ...card,
              nextReview: nowISO,
              repetition: 0,
              interval:   0,
              efactor:    2.5,
            })),
            due: d.cards.length, 
          }
    );
    setDecks(updatedDecks);
    localStorage.setItem('decks', JSON.stringify(updatedDecks));
    setShowSettings(false);
  }

  function handleDeleteDeck() {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this deck? This action cannot be undone.'
    );
    if (confirmDelete) {
      const updatedDecks = decks.filter((d) => d.id !== deck.id);
      setDecks(updatedDecks);
      localStorage.setItem('decks', JSON.stringify(updatedDecks));
      navigate('/');
    }
    setShowSettings(false);
  }

  function handleEditDetails() {
    const newDescription = prompt('Enter new description for the deck:', deck.description);
    if (newDescription !== null) {
      const updatedDecks = decks.map((d) => (d.id === deck.id ? { ...d, description: newDescription } : d));
      setDecks(updatedDecks);
      localStorage.setItem('decks', JSON.stringify(updatedDecks));
    }
    setShowSettings(false);
  }

  function handleRename() {
    const newName = prompt('Enter new name for the deck:', deck.name);
    if (newName) {
      const updatedDecks = decks.map((d) => (d.id === deck.id ? { ...d, name: newName } : d));
      setDecks(updatedDecks);
      localStorage.setItem('decks', JSON.stringify(updatedDecks));
    }
    setShowSettings(false);
  }

  useEffect(() => {
  setPulse(true);                
  const t = setTimeout(() => setPulse(false), 2000); 
  return () => clearTimeout(t);
}, [viewMode]);               

useEffect(() => {
  if (!deck) return;                  

  const counts = deck.cards.reduce((acc, c) => {
    const lvl = c.taxonomy || 'Uncategorised';
    acc[lvl]  = (acc[lvl] || 0) + 1;
    return acc;
  }, {});
  setTaxonomyCounts(counts);

  setQuizCount(deck.quiz?.length ?? 0);

  const seenKey = `deck-${deck.id}-overviewSeen`;
  if (!localStorage.getItem(seenKey)) {
    setShowPopUp(true);
    localStorage.setItem(seenKey, 'true');
  }
}, [deck]);


  return (
    <div className="p-6 md:p-10 min-h-full bg-blue-50 w-full relative flex flex-col ">
       {showPopUp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-xl text-black space-y-4 max-w-sm w-full">
           <h2 className="text-xl font-bold">🎉 Deck ready!</h2>
 <p className="text-sm text-gray-600 mb-2">
   <strong>{deck.cards.length}</strong> flashcards &nbsp;|&nbsp;
   <strong>{quizCount}</strong> quiz&nbsp;questions
 </p>

 <p className="text-sm text-gray-600">Bloom's-taxonomy spread:</p>
 <ul className="space-y-1 text-sm ml-2 list-disc">
   {Object.entries(taxonomyCounts).map(([lvl, n]) => (
     <li key={lvl}>
       {lvl}: {n}
     </li>
   ))}
 </ul>

            <div className="flex justify-between gap-4 mt-4">
              
              <button
                onClick={() => handlePopUpAction('summary')}
                className="w-full px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
              >
                Summary
              </button>
              <button
                onClick={() => handlePopUpAction('cards')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Flashcards
              </button>
              <button
                onClick={() => handlePopUpAction('quiz')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Quiz
              </button>
            </div>
          </div>
        </div>
      )}
      {showStats && (
   <>
     <div
       className="fixed inset-0 z-40 backdrop-blur-sm"
       onClick={() => setShowStats(false)}
     />
     <StatsPopup
       onClose={() => setShowStats(false)}
       deckId={deck.id}
     />
   </>
 )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-black">
            {deck.name} ({deck.total}) 
            <button
              className="text-base text-gray-600 hover:text-black transition"
              onClick={handleShareClick}
            >
              <Share2 size={20} />
            </button>
          </h1>
          <p className="text-gray-600 mt-1">{deck.description}</p>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <button className="p-2 hover:bg-gray-400/70 rounded transition bg-gray-200" onClick={() => setShowStats(true)}>
            <BarChart size={20} />
          </button>
          <button
            className="p-2 hover:bg-gray-400/70 rounded transition bg-gray-200"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={20} />
          </button>
<button
  key={viewMode}                     
   className={`play-button ${pulse ? 'heartbeat' : ''}
              p-3 rounded-md text-white shadow-md
              focus:outline-none
              focus:ring-2 focus:ring-blue-400 transition hover:scale-110 animated-gradient`}
  onClick={handlePlay}
  title="Start this mode"
>
  {{
    summary:   <NotebookText size={20}/>,
    cards:     <Layers        size={20}/>,
    quiz:      <Play          size={20}/>
  }[viewMode]}
</button>
        </div>
        
      </div>
      <div className="border-b mb-4">
        <nav className="-mb-px flex space-x-8 text-sm font-medium">
          <button
            className={`pb-3 ${
              viewMode === 'summary'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setViewMode('summary')}
          >
            <NotebookText size={16} className="inline-block mr-1" />
            Summary
          </button>
          <button
            className={`pb-3 ${
              viewMode === 'cards'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setViewMode('cards')}
          >
            <Layers size={16} className="inline-block mr-1" />
            Flashcards
          </button>
          <button
            className={`pb-3 ${
              viewMode === 'quiz'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setViewMode('quiz')}
          >
            <Play size={16} className="inline-block mr-1" />
            SmartQuiz
          </button>
        </nav>
      </div>

      
      {viewMode === 'summary' && <SummaryTab />}
      {viewMode === 'cards'   && <FlashcardsTab />}
      {viewMode === 'quiz'    && <QuizTab />}

      {showSharePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-xl text-black space-y-4 max-w-sm w-full">
            <h2 className="text-xl font-bold">Share this Deck</h2>
            <p>Send this link to friends or colleagues:</p>
            <div className="flex items-center">
            <input
    type="checkbox"
    className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
  />
  <span className="text-gray-700 text-sm ml-1">Include PDF file</span>
  </div>
            <div className="flex items-center justify-between border rounded px-2 py-1">
              <span className="text-sm text-gray-800 truncate">{shareLink}</span>
              <button
                onClick={copyLink}
                className="ml-2 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowSharePopup(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl text-black space-y-4 max-w-sm w-full">
            <h2 className="text-xl font-bold">Deck Settings</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Rename Deck
              </button>
              <button
                onClick={handleEditDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Deck Details
              </button>
              <button
                onClick={handleDeleteDeck}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Deck
              </button>
              <button
          onClick={resetDueDates}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Reset Due Dates
        </button>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="mt-4 w-full bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
