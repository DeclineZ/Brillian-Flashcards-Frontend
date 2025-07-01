// src/pages/CreateFlashcards.jsx
import { useState, useRef } from 'react';
import { Upload, Sparkles, PenLine, Settings, Plus, Trash2, ImagePlus } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useDecks } from './lib/DeckContext.jsx';
import { withTimeout } from './lib/aiTimeout.js';

function ModeButton({ children, icon, active, onClick, ...rest }) {
  return (
    <button
      className={`px-4 py-1 rounded-full flex items-center gap-2 text-sm ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      }`}
      onClick={onClick}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export default function CreateFlashcards() {

  const BASE = 'https://brillian-flashcard-backend.onrender.com';

  const navigate = useNavigate();
  const { setDecks, learningPrefs } = useDecks();
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState('ai'); 
  const [files, setFiles] = useState([]);
  const inputRef = useRef();

  const handleFiles = (fileList) => {
    const accepted = [...fileList].filter((file) => file.type === 'application/pdf');
    if (accepted.length) setFiles(accepted.slice(0, 1));
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const [activeTab, setActiveTab] = useState('summary');
  const [summary, setSummary] = useState('');
  const blankQuiz = { question: '', answer: '', key_points: [] };
  const [quizzes, setQuizzes]   = useState([{ ...blankQuiz }]);

  
  const updateQuiz = (idx, field, value) =>
    setQuizzes(qs => qs.map((q,i) => i===idx ? { ...q, [field]: value } : q));

  const addQuiz    = () => setQuizzes(qs => [...qs, { ...blankQuiz }]);
  const removeQuiz = (idx) => setQuizzes(qs => qs.filter((_,i)=>i!==idx));

  const generateFromPdf = async () => {
    if (!files.length) return alert('Please choose a PDF first');
    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', files[0]);
    formData.append('learningPrefs', JSON.stringify(learningPrefs));
    
    try {
    const { data: newDeck } = await withTimeout(
        axios.post(`${BASE}/api/generate-deck`, formData),
        1200_000,
        {
          id: 'mock-deck',
          name: '⏱️ Mock Deck',
          description: 'Offline fallback flashcards',
          studied: false,
          total: 25,
          learned: 0,
          due: 25,
          cards: [
  {
    "id": "242090ec-150b-4d41-bc45-900daf84d994",
    "question": "หินเกิดจากอะไร",
    "answer": "การรวมตัวและแข็งตัวของแร่ต่างๆ",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Understanding",
    "point": 6,
    "repetitions": 7,
    "interval": 1218,
    "ef": 3.2000000000000006,
    "due": "2028-09-09"
  },
  {
    "id": "7cdcba7b-2c3c-4a94-8aa7-4283567658bc",
    "question": "ตัวอย่างหินอัคนีพุ",
    "answer": "หินบะซอลต์, หินไรโอไลต์, หินแอนดีไซต์",
    "keyword": "basalt",
    "needs_image": true,
    "image": "https://geology.ecu.edu/geol1501/wp-content/pv-uploads/sites/351/2020/06/porphyritic-basalt.gif",
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 3,
    "interval": 16,
    "ef": 2.8000000000000003,
    "due": "2025-05-26"
  },
  {
    "id": "44c39b44-583b-4518-b856-a8db69fdb12e",
    "question": "ตัวอย่างหินอัคนีแทรกซ้อน",
    "answer": "หินแกรนิต, หินไดออไรต์, หินแกบโบร",
    "keyword": "granite",
    "needs_image": true,
    "image": "https://www.geologysuperstore.com/wp-content/uploads/2023/03/Pink_Granite_2-removebg-preview.png",
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 2,
    "interval": 6,
    "ef": 2.7,
    "due": "2025-05-16"
  },
  {
    "id": "2279e940-cfff-4285-bec6-af2922c0719b",
    "question": "หินอัคนีแบ่งออกเป็นกี่ชนิด",
    "answer": "2 ชนิด",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "d2ff60c7-ee5f-45fa-92c1-eb974f0269be",
    "question": "หินตะกอนเกิดจากอะไร",
    "answer": "การทับถมของตะกอน เศษหิน แร่ ดิน กรวด หรือทราย",
    "keyword": "sediment",
    "needs_image": true,
    "image": "https://stormwater.pca.state.mn.us/images/thumb/a/a3/Small_Sediment_Trap.jpg/300px-Small_Sediment_Trap.jpg",
    "taxonomy": "Understanding",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "c66e0fbf-869c-48a9-960b-f413804a4cd8",
    "question": "ตะกอนต่างๆ ถูกพัดพาโดยอะไร",
    "answer": "ธารน้ำ, ลม, คลื่นทะเล",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "6c9f5c16-650f-4886-a722-31b8443c98e5",
    "question": "หินตะกอนแบ่งออกเป็นกี่ชนิด",
    "answer": "2 ชนิด",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "d7e55d13-1530-47ee-8b8e-349641b85261",
    "question": "หินเนื้อประสานมีลักษณะอย่างไร",
    "answer": "เนื้อละเอียดมาก จําแนกองค์ประกอบไม่ได้",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Understanding",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "97073b1a-f18c-487f-985e-ee9715aa5cdb",
    "question": "หินเนื้อประสมมีลักษณะอย่างไร",
    "answer": "เนื้อละเอียดไม่มาก จําแนกองค์ประกอบได้",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Understanding",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "4ca08c23-8cf9-4e18-bf19-c05a9b0f68d8",
    "question": "ตัวอย่างหินตะกอนเนื้อประสาน",
    "answer": "หินปูน, ถ่านหิน",
    "keyword": "limestone",
    "needs_image": true,
    "image": "https://dnr.mo.gov/sites/dnr/files/styles/medium/public/media/image/2020/10/mgs-calcitic-limestone.jpg?itok=nl2sWxW9",
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "e0f49106-e26e-47b8-8665-3454fe192bf0",
    "question": "ตัวอย่างหินตะกอนเนื้อประสม",
    "answer": "หินดินดาน, หินกรวดมน",
    "keyword": "conglomerate",
    "needs_image": true,
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Ferruginous_quartz-pebble_conglomerate_%28derived_from_boulder_in_%22Sharon_Conglomerate%22%2C_Lower_Pennsylvanian%3B_Jackson_North_roadcut%2C_Ohio%2C_USA%29_30.jpg/330px-Ferruginous_quartz-pebble_conglomerate_%28derived_from_boulder_in_%22Sharon_Conglomerate%22%2C_Lower_Pennsylvanian%3B_Jackson_North_roadcut%2C_Ohio%2C_USA%29_30.jpg",
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "28b8eaee-7054-4997-824f-2d4e11227b5b",
    "question": "หินแปรเกิดจากอะไร",
    "answer": "การแปรสภาพจากความร้อน ความดัน และปฏิกิริยาเคมี",
    "keyword": "metamorphism",
    "needs_image": true,
    "image": "https://www.geolsoc.org.uk/ks3/webdav/site/GSL/shared/images/education_and_careers/RockCycle/Processes/Deformation/Deformation.jpg",
    "taxonomy": "Understanding",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "6fb13329-cae0-4a2c-8148-5ea4f35c5465",
    "question": "หินแปรแบ่งออกเป็นกี่ชนิด",
    "answer": "2 ชนิด",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "fe96418d-10fb-4606-b20b-87b37dbf68e8",
    "question": "การแปรสภาพบริเวณไพศาลเกิดจากอะไร",
    "answer": "ความร้อนและความดันสูงมาก",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Understanding",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "1e143d3d-0024-4e49-ba86-d892025f2e35",
    "question": "การแปรสภาพสัมผัสเกิดจากอะไร",
    "answer": "ความร้อนและปฏิกิริยาเคมีที่ไม่มาก",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Understanding",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "a040e8b0-cdc0-44ba-910f-d5d80598c4f0",
    "question": "ตัวอย่างหินแปรจากการแปรสภาพบริเวณไพศาล",
    "answer": "หินไนส์, หินชนวน",
    "keyword": "gneiss",
    "needs_image": true,
    "image": "https://www.geologysuperstore.com/wp-content/uploads/2023/03/Hornblende_Gneiss-removebg-preview.png",
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "a4f08167-5466-4cff-8ab3-05fdedabc795",
    "question": "ตัวอย่างหินแปรจากการแปรสภาพสัมผัส",
    "answer": "หินอ่อน",
    "keyword": "marble",
    "needs_image": true,
    "image": "https://marble.com/uploads/materials/1175/300X300/thumbnail/Carrara-Silver-Honed_BZ2Hi3iiXMb9u0Ki4WQb.jpg",
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "0acdf5e8-15b4-4a3e-9d42-99916c068f4b",
    "question": "ถ้าเราพบหินที่มีลักษณะเนื้อละเอียดมากและไม่สามารถจําแนกองค์ประกอบได้ หินนั้นน่าจะเป็นหินประเภทใด",
    "answer": "หินตะกอนเนื้อประสาน",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Applying",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "c7f56102-6b13-430b-a7f9-ec352ef6f815",
    "question": "ถ้าเราพบหินที่เกิดจากการเย็นตัวของลาวา หินนั้นน่าจะเป็นหินประเภทใด",
    "answer": "หินอัคนีพุ",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Applying",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "80212ed3-d08c-482f-9aa8-d7d1f15043ea",
    "question": "ถ้าเราพบหินที่เกิดจากการแปรสภาพของหินเดิมโดยมีความร้อนและความดันสูงมาก หินนั้นน่าจะเป็นหินประเภทใด",
    "answer": "หินแปรจากการแปรสภาพบริเวณไพศาล",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Applying",
    "point": 0,
    "repetitions": 0,
    "interval": 0,
    "ef": 2.5,
    "due": "2025-05-09"
  },
  {
    "id": "8fea4eb3-2db1-4383-9850-967924bec752",
    "question": "หินแบ่งออกเป็นกี่ประเภท",
    "answer": "3 ประเภท",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 0,
    "interval": 1,
    "ef": 2.5,
    "due": "2025-05-10"
  },
  {
    "id": "e82ff6e3-3316-4eab-8b04-e285d9f22368",
    "question": "หิน 3 ประเภทคืออะไรบ้าง",
    "answer": "หินอัคนี, หินแปร, หินตะกอน",
    "keyword": "",
    "needs_image": false,
    "image": null,
    "taxonomy": "Remembering",
    "point": 0,
    "repetitions": 0,
    "interval": 1,
    "ef": 2.5,
    "due": "2025-05-10"
  },
  {
    "id": "59ec24a8-f624-42c9-951e-f4e73e6cbe99",
    "question": "หินอัคนีเกิดจากอะไร",
    "answer": "การเย็นตัวลงและแข็งตัวของหินหลอมเหลว",
    "keyword": "magma",
    "needs_image": true,
    "image": "https://cdn.britannica.com/74/22274-138-4D5FA381/lava-rock-Molten-magma-Earth-surface-volcano.jpg?w=400&h=225&c=crop",
    "taxonomy": "Understanding",
    "point": 0,
    "repetitions": 0,
    "interval": 1,
    "ef": 2.6,
    "due": "2025-05-10"
  },
  {
    "id": "1aa1b35a-db06-4f3b-916f-47287018195d",
    "question": "หินอัคนีพุเกิดจากอะไร",
    "answer": "ลาวาแข็งตัว",
    "keyword": "lava",
    "needs_image": true,
    "image": "https://cdn.britannica.com/12/155312-050-A2EF0E56/Volcano-island-Reunion-Indian-Ocean.jpg?w=400&h=225&c=crop",
    "taxonomy": "Understanding",
    "point": 0,
    "repetitions": 0,
    "interval": 1,
    "ef": 2.6,
    "due": "2025-05-10"
  },
  {
    "id": "7027f7a3-54aa-41d3-bae0-edbf2f45eb03",
    "question": "หินอัคนีแทรกซ้อนเกิดจากอะไร",
    "answer": "แมกม่าแข็งตัว",
    "keyword": "magma",
    "needs_image": true,
    "image": "https://cdn.britannica.com/74/22274-138-4D5FA381/lava-rock-Molten-magma-Earth-surface-volcano.jpg?w=400&h=225&c=crop",
    "taxonomy": "Understanding",
    "point": 0,
    "repetitions": 0,
    "interval": 1,
    "ef": 2.8000000000000003,
    "due": "2025-05-11"
  }
]
        }
      );
      const sm2Defaults = {
     repetition: 0,
     interval:   0,
     efactor:    2.5,
     nextReview: Date.now(),
   };
   const deckWithSm2 = {
     ...newDeck,
     cards: newDeck.cards.map(c => ({ ...sm2Defaults, ...c })),
   };
   setDecks(prev => [...prev, deckWithSm2]);
      navigate(`/deck/${newDeck.id}`);
    } catch (err) {
      console.error(err);
      alert('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const blankCard = { question: '', answer: '', keyword: '', needs_image: false, image: '', taxonomy: 'Manual' };
  const [cards, setCards] = useState([{ ...blankCard }]);

  const updateCard = (idx, field, value) => {
    setCards((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)),
    );
  };

  const removeCard = (idx) => setCards((prev) => prev.filter((_, i) => i !== idx));

  const addCard = () => setCards((prev) => [...prev, { ...blankCard }]);

  const handleImage = (idx, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);    
    setCards(prev =>
      prev.map((c, i) =>
        i === idx ? { ...c, image: url, needs_image: true } : c
      ),
    );
  };

 const saveManualDeck = () => {
  if (!deckName.trim()) {
    alert('Deck name required');
    return;
  }

  const summaryOk = summary.trim() !== '';

  const cardsOk =
    cards.length > 0 &&
    cards.every((c) => c.question.trim() && c.answer.trim());

  const quizOk =
    quizzes.length > 0 &&
    quizzes.every((q) => q.question.trim() && q.answer.trim());

  if (!summaryOk && !cardsOk && !quizOk) {
    alert('Please add a summary, some flashcards, or quiz questions.');
    return;
  }

  if (!cardsOk && cards.length) {
    alert('Fill in all flashcards or remove the incomplete ones.');
    return;
  }

  if (!quizOk && quizzes.length) {
    alert('Fill in all quiz questions or remove the incomplete ones.');
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  const transformedCards = cardsOk
    ? cards.map((c) => {
        const hasImg = !!c.image;
        return {
          id: uuid(),
          question: c.question.trim(),
          answer: c.answer.trim(),
          keyword: c.keyword,
          needs_image: hasImg,
          image: hasImg ? c.image : '',
          taxonomy: c.taxonomy || 'Manual',
          repetition:  0,          
          interval:    0,           
          efactor:     2.5,        
          nextReview:  Date.now(),  
        };
      })
    : [];

  const transformedQuiz = quizOk
    ? quizzes.map((q) => ({
        question: q.question.trim(),
        answer: q.answer.trim(),
        key_points: q.key_points?.length ? q.key_points : [],
      }))
    : [];

  const emojis = ['📚', '🧠', '🎯', '⚡', '🚀', '🌟', '🔑', '💡', '📝', '🧩'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  const newDeck = {
    id: uuid(),
    name: `${emoji} ${deckName.trim()}`,
    description: deckDescription.trim(),
    studied: false,
    total: transformedCards.length,
    learned: 0,
    due: transformedCards.length,
    summaryHtml: summary.trim().replace(/\n/g, '<br/>'),
    cards: transformedCards,
    quiz: transformedQuiz,
  };

  setDecks((prev) => [...prev, newDeck]);
  navigate(`/deck/${newDeck.id}`);
};



  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 p-6 bg-white rounded shadow">
          <div className="w-16 h-16 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-lg text-black">Generating study deck, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-full w-full">
      <h1 className="text-3xl font-bold text-black">Create Study Decks</h1>

      {/* mode toggle */}
      <div className="flex gap-2">
        <ModeButton icon={<Sparkles size={20} />} active={mode === 'ai'} onClick={() => setMode('ai')}>
          AI
        </ModeButton>
        <ModeButton icon={<PenLine size={20} />} active={mode === 'manual'} onClick={() => setMode('manual')}>
          Manual
        </ModeButton>
        <ModeButton icon={<Settings size={20} />} disabled>
        </ModeButton>
      </div>

      {mode === 'ai' && (
        <>
          {/* upload box */}
          <div
            className="border-2 border-dashed border-gray-400/70 rounded-lg h-56 flex flex-col gap-2 items-center justify-center text-gray-500 cursor-pointer"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            {files.length === 0 ? (
              <>
                <Upload size={32} />
                <p>
                  Drag & drop a PDF, text or images here, or <span className="underline">browse</span>
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">{files[0].name}</p>
                <p className="text-sm text-gray-400">Ready to upload</p>
              </>
            )}
            <input
              type="file"
              accept="application/pdf"
              hidden
              ref={inputRef}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          <button
            onClick={generateFromPdf}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
            disabled={files.length === 0}
          >
            Generate
          </button>
        </>
      )}

      {mode === 'manual' && (
        <div className="space-y-6">
          {/* Deck meta */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Deck name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded text-black"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
            />
            <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea
              className="w-full px-3 py-2 border rounded text-black"
              value={deckDescription}
              rows={1}
              onChange={(e) => setDeckDescription(e.target.value)}
            />
          </div>

    <nav className="flex gap-4 text-sm font-medium border-b mb-2">
      {['summary','cards','quiz'].map(t => (
        <button
          key={t}
          onClick={()=>setActiveTab(t)}
          className={`
            pb-2
            ${activeTab===t
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'}
          `}
        >
          {t==='summary' ? 'Summary'
           : t==='cards' ? 'Flashcards'
           :              'Quiz'}
        </button>
      ))}
    </nav>

    {activeTab==='summary' && (
      <textarea
        rows={6}
        placeholder="Write a concise summary here…"
        className="w-full px-3 py-2 border rounded text-black"
        value={summary}
        onChange={e=>setSummary(e.target.value)}
      />
    )}

          {activeTab==='cards' && (
            <>
          <div className="space-y-4 max-h-65 overflow-auto pr-2">
            {cards.map((card, idx) => (
              <div key={idx} className="relative space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">
  Card {idx + 1}
</div>
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => removeCard(idx)}
                  title="Delete card"
                >
                  <Trash2 size={18} />
                </button>
                <label className="block text-sm font-medium text-gray-700">Question</label>
                <textarea
                  className="w-full px-3 py-2 border rounded text-black"
                  rows={1}
                  value={card.question}
                  onChange={(e) => updateCard(idx, 'question', e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-700">Answer</label>
                <textarea
                  className="w-full px-3 py-2 border rounded text-black"
                  rows={1}
                  value={card.answer}
                  onChange={(e) => updateCard(idx, 'answer', e.target.value)}
                />
  
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">Image (optional)</label>

  <label
    htmlFor={`img-${idx}`}
    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 cursor-pointer"
  >
    <ImagePlus size={16} />
    {card.image ? 'Change image' : 'Add image'}
  </label>

  <input
    id={`img-${idx}`}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => handleImage(idx, e.target.files[0])}
  />


  {card.image && (
    <img
      src={card.image}
      alt=""
      className="mt-2 h-32 w-full rounded object-contain border"
    />
  )}
</div>
              </div>
            ))}

            <button
              onClick={addCard}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-gray-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
            >
              <Plus size={18} />
              Add card
            </button>
          </div>
          </>
    )}


    {activeTab==='quiz' && (
      <div className="space-y-4 max-h-65 overflow-auto pr-2">
        {quizzes.map((q,idx)=>(
          <div key={idx} className="relative space-y-3 rounded-xl border bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Question {idx+1}</div>
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={()=>removeQuiz(idx)}
              title="Delete question"
            ><Trash2 size={18}/></button>

            <label className="block text-sm font-medium text-gray-700">Question</label>
            <textarea
              rows={1}
              className="w-full px-3 py-2 border rounded text-black"
              value={q.question}
              onChange={e=>updateQuiz(idx,'question',e.target.value)}
            />
            <label className="block text-sm font-medium text-gray-700">Ideal answer</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 border rounded text-black"
              value={q.answer}
              onChange={e=>updateQuiz(idx,'answer',e.target.value)}
            />
          </div>
        ))}

        <button
          onClick={addQuiz}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed
                     border-gray-300 py-3 text-gray-600 transition hover:border-blue-500
                     hover:bg-blue-50 hover:text-blue-600"
        >
          <Plus size={18}/> Add question
        </button>
      </div>
    )}

    <button
      onClick={saveManualDeck}
      className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700
                 disabled:opacity-50"
      disabled={
        !deckName.trim() ||
        (summary.trim()==='' && cards.length===0 && quizzes.length===0)
      }
    >
      Save deck
    </button>
        </div>
      )}
    </div>
  );
}
