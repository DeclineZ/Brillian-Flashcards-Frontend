// src/pages/FlashcardPlayer.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Lightbulb, ChevronLeft, X, Heart, ThumbsUp, Clock } from 'lucide-react';
import { useDecks } from './lib/DeckContext.jsx';
import confetti from 'canvas-confetti';
import { withTimeout } from './lib/aiTimeout.js';

export default function FlashcardPlayer() {
  const { decks, setDecks } = useDecks();
  const { id } = useParams();
  const navigate = useNavigate();



  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAi, setLoadingAi] = useState(false); 
  const [drawer,    setDrawer]    = useState(false);  
  const [sessionTime, setSessionTime] = useState(0);

  const [isFinished, setFinished] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);
  const [moreCards, setMoreCards] = useState([]);         
  const [checked, setChecked]   = useState([]);        
  const [loadingMore, setLoadingMore] = useState(false);

  const [liked, setLiked] = useState(() => new Set());

  const [cardStartTime, setCardStartTime] = useState(0);
  const [cardElapsedTime, setCardElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);


  const deck = decks.find((d) => String(d.id) === id);
  const card = deck.cards[index];

  const [userXP, setUserXP] = useState(0); 
  const [xpMessage, setXpMessage] = useState(''); 
  const [showXpMessage, setShowXpMessage] = useState(false); 

  const [sessionStudied, setSessionStudied] = useState(0)

  const calculateXP = (isCorrect, timeTaken, isFaster) => {
    let xp = 10; 
  
    if (isCorrect) {
      xp += 10; 
      if (isFaster) {
        xp += 5; 
      }
    } else {
      xp += 2; 
    }

  
    if (isFaster) {
      xp += Math.floor(10 * (1 - (timeTaken / 10))); 
    } else if (timeTaken > 20) { 
      xp -= 2; 
    }
  
    return xp;
  };
  


  
useEffect(() => {
  if (!isFinished) return;

  
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });
}, [isFinished]);

useEffect(() => {
    setSessionStudied(0)
  }, [id])

useEffect(() => {
  setCardStartTime(Date.now()); 
  setIsTimerRunning(true); 
}, [index]);

useEffect(() => {
  const storedTime = localStorage.getItem(`card-${card.id}-time`);
  if (storedTime) {
    setCardElapsedTime(storedTime);
  }
}, [card.id]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  
  if (!deck || !deck.cards?.length) {
    return (
      <div className="p-8">
        <button onClick={() => navigate(-1)} className="text-blue-600">
          ← Back
        </button>
        <p className="mt-4 text-lg font-semibold">Deck not found.</p>
      </div>
    );
  }

 

  const getTaxonomyColorClass = (taxonomy) => {
    switch (taxonomy) {
      case "Remembering":
        return "text-blue-500"; 
      case "Understanding":
        return "text-green-500";
      case "Applying":
        return "text-yellow-500"; 
      default:
        return "text-gray-500";
    }
  };


  function handleShowAnswer() {
    setShowAnswer(true);
    if (isTimerRunning) {
      const timeTaken = (Date.now() - cardStartTime) / 1000; 
      setCardElapsedTime(timeTaken);
  
      // Save the fastest time to localStorage
      const previousTime = localStorage.getItem(`card-${card.id}-time`);
      if (!previousTime || timeTaken < previousTime) {
        localStorage.setItem(`card-${card.id}-time`, timeTaken.toFixed(2));
      }
  
      setIsTimerRunning(false); 
    }
  }

  function toggleLike(id) {
     setLiked(prev => {
       const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
         return next;
         });
        }

  async function handleAiExplanation() {
    setLoadingAi(true);
    try {
      const { data } = await withTimeout(
              axios.post('https://brillian-flashcard-backend.onrender.com/api/explanation', { question: card.question, answer: card.answer }),
              20_000,
              { explanation: 'หินอัคนีพุ คือ หินที่เกิดจากการเย็นตัวและแข็งตัวของแมกมาใต้ผิวโลก โดยแมกมาเหล่านี้ถูกขับพุ่งออกมาจากใต้พื้นโลกผ่านกระบวนการภูเขาไฟระเบิด หรือการปะทุของภูเขาไฟ เมื่อแมกมาเหล่านี้สัมผัสกับอากาศหรือน้ำ อุณหภูมิและความดันที่ลดลงทำให้แร่ธาตุต่างๆ ในแมกมาเริ่มแข็งตัวและตกผลึก กลายเป็นหินอัคนีพุที่มีเนื้อละเอียดและโครงสร้างที่มีลักษณะเฉพาะ หินบะซอลต์ หินไรโอไลต์ และหินแอนดีไซต์ เป็นตัวอย่างของหินอัคนีพุที่พบได้ทั่วไป หินเหล่านี้มีลักษณะเนื้อละเอียดและมักจะมีสีเข้ม หินบะซอลต์มักพบในบริเวณที่มีการปะทุของภูเขาไฟใต้มหาสมุทร หินไรโอไลต์และหินแอนดีไซต์มักพบในบริเวณที่มีภูเขาไฟบนพื้นทวีป การเกิดของหินเหล่านี้จึงเกี่ยวข้องกับกระบวนการเคลื่อนที่ของแผ่นธรณีภาคและกระบวนการภูเขาไฟ ซึ่งทำให้เราเข้าใจถึงการเปลี่ยนแปลงของพื้นโลกและประวัติศาสตร์ของโลกเราได้ดีขึ้น' }
            );

    const xp = calculateXP(true, 0, false, true, false); 
    setUserXP(prevXP => prevXP + xp);
    setXpMessage(`+${xp} XP for the explantion!`);
    setShowXpMessage(true);

    setTimeout(() => {
      setShowXpMessage(false);
    }, 2000); 

    setAiExplanation(data.explanation); 
    setDrawer(true);                    
    } catch (err) {
      console.error(err);
      alert('Failed to fetch AI explanation');
    } finally {
      setLoadingAi(false); 
    }
  }

  function handleExit() {
    navigate(`/deck/${deck.id}`);
  }

  function handleNext() {
    if (index < deck.cards.length - 1) {
      setIndex(index + 1);
      setShowAnswer(false);
      setDrawer(false);
    } else {
      setFinished(true);
    }

  }

 function rate(isCorrect) {
  const timeTaken   = (Date.now() - cardStartTime) / 1000;
  const previousTime = localStorage.getItem(`card-${card.id}-time`);
  const isFaster     = previousTime ? timeTaken < previousTime : false;

  const xp = calculateXP(isCorrect, timeTaken, isFaster, false, false);
  setUserXP(x => x + xp);
  setXpMessage(`Nice job! +${xp} XP`);
  setShowXpMessage(true);
  setTimeout(() => setShowXpMessage(false), 2000);

  const quality = isCorrect ? 5 : 1;
  const updated = sm2({ ...card }, quality);

  const previousPoint = card.point;
  let newPoint = updated.point + (isCorrect ? 6 : -2);
  updated.point = newPoint;

  const justLearned = previousPoint <= 5 && newPoint > 5;
  if (justLearned) {
    console.log(`Card ${card.id} just graduated!`);
    setSessionStudied(s => s + 1);
  }

  setDecks(prev =>
    prev.map(d => {
      if (d.id !== deck.id) return d;

      let cards = [...d.cards];
      if (newPoint < 3) {
        // Hard → to back
        cards.splice(index, 1);
        cards.push(updated);
      } else {
        // Not-hard → in place
        cards[index] = updated;
      }

      const learned = justLearned ? d.learned + 1 : d.learned;
      const due     = justLearned ? Math.max(0, d.due - 1) : d.due;

      return { ...d, cards, learned, due };
    })
  );

  setShowAnswer(false);
  setAiExplanation('');
  if (newPoint < 3) {
    if (index >= deck.cards.length - 1) {
      navigate(`/deck/${deck.id}`);
    }
  } else {
    handleNext();
  }
}

  
  function sm2(card, quality) {
    const c = { ...card };
  
    if (quality < 3) {
      c.repetitions = 0;
      c.interval = 1;
    } else {
      if (c.repetitions === 0) c.interval = 1;
      else if (c.repetitions === 1) c.interval = 6;
      else c.interval = Math.round(c.interval * c.ef);
  
      c.repetitions += 1;
  
      const efPrime =
        c.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      c.ef = Math.max(1.3, efPrime);
    }
  
    const nextDueTimestamp = Date.now() + c.interval * 864e5;
  
    if (isNaN(nextDueTimestamp)) {
      console.error("Invalid due timestamp:", nextDueTimestamp);
      return c; 
    }
  
    const nextDueDate = new Date(nextDueTimestamp);
  
    if (isNaN(nextDueDate.getTime())) {
      console.error("Invalid date:", nextDueDate);
      return c; 
    }
  
    c.due = nextDueDate.toISOString().slice(0, 10);
  
    return c;
  }
  

  async function openAddMore() {
    setLoadingMore(true);
    setMoreOpen(true);
    try {
      const { data } = await withTimeout(
              axios.post('https://brillian-flashcard-backend.onrender.com/api/related-cards', { question: card.question, answer: card.answer }),
              2500_000,
              { cards: [
                  { id:'mock1', question:'หินแอนดีไซต์มีลักษณะอย่างไร', answer:'เป็นหินอัคนีพุที่มีเนื้อละเอียดและสีเข้ม', keyword:'', needs_image:false },
                  { id:'mock2', question:'หินอัคนีพุสามารถนำไปใช้ประโยชน์อย่างไร', answer:'สามารถนำไปใช้เป็นวัสดุก่อสร้างและวัสดุในการทำถนน', keyword:'', needs_image:false },
                  { id:'mock3', question:'หินอัคนีพุคืออะไร', answer:'หินที่เกิดจากการเย็นตัวของแมกมาใต้ผิวโลก', keyword:'', needs_image:false }

                ]
              }
            );


      setMoreCards(data.cards);
      setChecked(data.cards.map((c) => c.id));

    const xp = calculateXP(true, 0, false, false, true); 
    setUserXP(prevXP => prevXP + xp);
    setXpMessage(`+${xp} XP for exploring more!`);
    setShowXpMessage(true);

    setTimeout(() => {
      setShowXpMessage(false);
    }, 2000); 
    } catch {
      alert('AI failed to generate extra cards');
      setMoreOpen(false);
    } finally { setLoadingMore(false); }
  }

  function toggleCheck(id) {
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function confirmAdd() {
    if (checked.length === 0) return setMoreOpen(false);
    const selected = moreCards.filter((c) => checked.includes(c.id));
    setDecks((prev) =>
      prev.map((d) =>
        d.id === deck.id ? { ...d, cards: [...d.cards, ...selected], total: d.cards.length + selected.length } : d,
      ),
    );
    setMoreOpen(false);
  }


  return (
    
    <div className="flex flex-col items-center min-h-screen bg-gray-50 w-full relative">
      
      {isFinished && (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="rounded-xl bg-white p-8 shadow-xl text-center space-y-4">
      <h2 className="text-2xl font-bold text-black">🎉 Great job!</h2>
      <p className="text-gray-600">You've reviewed every card due today!</p>
      <p className="text-gray-600">Check back tomorrow for the next, perfectly-timed round.</p>
      <button
        onClick={() => navigate(`/deck/${deck.id}`)}        
        className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Back to decks
      </button>
    </div>
  </div>
)}
      {/* top bar */}
      <header className="flex justify-between items-center w-full max-w-6xl px-4 py-6">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 text-blue-600"
        >
          <ArrowLeft size={20} color="blue"/>
          Exit
        </button>
        <span className="text-sm text-gray-700 ">
  Card {index + 1} / {deck.cards.length} | Elapsed Time: {sessionTime} sec
</span>
      </header>

      {/* card + controls */}
      <section className="flex flex-col items-center gap-8 flex-1 w-full px-4 pb-6 justify-center">
      {showXpMessage && (
  <div className="xp-message">
    {xpMessage}
  </div>
)}

      <span className="text-xl text-gray-700 flex justify-center gap-2 font-bold">
        <Clock size={26}/>
    {isTimerRunning ? ((Date.now() - cardStartTime) / 1000).toFixed(2) : cardElapsedTime} sec
  </span>
        {/* Larger flipping card */}
        <div className="perspective card w-full" onClick={handleShowAnswer}>
          <div
            className={`card-3d ${showAnswer ? 'rotate-x-180' : ''} w-full h-full`}
          >
            {/* front (question) */}
            
            <div className="card-face flex items-center justify-center bg-white rounded shadow p-6 border border-gray-200 front">
            <p  className="absolute top-4 left-4 text-6xl font-bold text-gray-300">Q</p>
            <div className={`absolute top-6 text-sm font-medium ${getTaxonomyColorClass(card.taxonomy)}`}>
               <strong>({card.taxonomy})</strong>
            </div>
              <p className="text-center text-xl font-semibold text-black">
                {card.question}
              </p>
            </div>
            {/* back (answer) */}
            <div className="card-face rotate-y-180 flex items-center justify-center bg-white rounded shadow p-6 border border-gray-200 back">
            <p  className="absolute top-4 left-4 text-6xl font-bold text-gray-300">A</p>
            <div className={`absolute top-6 text-sm font-medium ${getTaxonomyColorClass(card.taxonomy)}`}>
              <strong>({card.taxonomy})</strong>
            </div>
            <button
             onClick={(e) => { e.stopPropagation(); toggleLike(card.id); }}
              className="absolute top-3 right-3 rounded-full p-1 transition hover:bg-gray-100"
              >
                 <ThumbsUp
                  size={20}
                   className={liked.has(card.id) ? 'text-blue-500 fill-blue-500' : 'text-gray-400'}
                    />
                    </button>
            <div className="flex flex-col items-center gap-1 h-full w-full justify-center">
            {card.image && card.needs_image && (
              <div className="h-50 w-80 overflow-hidden rounded-lg sm:h-50 sm:w-70 overflow-hidden mb-4"><img
                src={card.image}
                alt={card.keyword || 'illustration'}
                className="mt-4 object-contain"
              /></div>
      )}
              <p className="text-center text-xl font-semibold mb-4 text-black">
                {card.answer}
              </p>

      </div>
            </div>
          </div>
        </div>

        {/* buttons */}
        {!showAnswer ? (
          <button
            onClick={handleShowAnswer}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Show Answer
          </button>
        ) : (
          <div className="flex flex-wrap justify-between tabby">
              <div className="flex flex-wrap justify-center gap-2">
    <button
      onClick={() => rate(true)} 
      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Remembered
    </button>
    <button
      onClick={() => rate(false)} 
      className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Try Again
    </button>
  </div>
            {/* AI Explanation */}
            <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={handleAiExplanation}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2 ai-x-button button animated-gradient"
            >
              <Lightbulb size={20} /> 
              AI Explanation
              
            </button>
            {/* Add more like this */}
            <button
              onClick={openAddMore}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 add-more-button button"
            >
              Add More Like This
            </button>

            {moreOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className='flex flex-col'>
              <h3 className="text-lg font-bold text-black">New flashcards</h3>
              <p className='text-gray-600'>Cards will be added to the back of the deck</p>
              </div>
              <button onClick={() => setMoreOpen(false)} className="rounded p-1 hover:bg-gray-100"><X size={18}/></button>
            </div>

            {loadingMore ? (
              <div className="flex flex-col items-center gap-3 py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"/><p>Generating…</p></div>
            ) : (
              <div className="max-h-80 space-y-3 overflow-y-auto p-4">
                {moreCards.map((c) => (
                  <label key={c.id} className="flex cursor-pointer gap-3 rounded border p-3 hover:bg-gray-50">
                    <input type="checkbox" checked={checked.includes(c.id)} onChange={() => toggleCheck(c.id)} className="mt-1"/>
                    <div>
                      <p className="font-medium text-black">{c.question}</p>
                      <p className="text-sm text-gray-600">{c.answer}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 border-t px-4 py-3">
              <button onClick={() => setMoreOpen(false)} className="rounded border px-4 py-2 text-gray-700 hover:bg-gray-100">Cancel</button>
              <button onClick={confirmAdd} disabled={checked.length === 0} className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">Add to deck</button>
            </div>
          </div>
        </div>
      )}
      
            </div>
          </div>
        )}

      </section>

      {/* Loading Overlay for AI Explanation */}
      {loadingAi && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded shadow ">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
      <p className="text-black">Fetching AI Explanation...</p>
    </div>
  </div>
)}

<aside
  className={`fixed inset-y-0 right-0 w-80 md:w-96 bg-white border-l shadow-lg
              transform transition-transform duration-300
              ${drawer ? 'translate-x-0' : 'translate-x-full'}`}
>
  <div className="flex items-center gap-2 px-4 py-3 border-b">
    <button
      onClick={() => setDrawer(false)}
      className="p-1 rounded hover:bg-gray-100"
    >
      <ChevronLeft size={20} color="black"/>
    </button>
    <h2 className="font-bold text-lg text-black">AI Explanation</h2>
  </div>

  <div className="p-4 overflow-y-auto text-black space-y-4">
    <p><span className="font-semibold">Q:</span> {card.question}</p>
    <p><span className="font-semibold">A:</span> {card.answer}</p>
    <hr />
    {loadingAi ? (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
        <p>Fetching explanation…</p>
      </div>
    ) : (
      <p className="whitespace-pre-wrap leading-relaxed">{aiExplanation}</p>
    )}
  </div>
</aside>
    </div>
  );
}
