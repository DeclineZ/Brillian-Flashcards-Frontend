import { useParams,useNavigate } from "react-router-dom";
import { useDecks } from "../lib/DeckContext";
import { v4 as uuid } from 'uuid'
import { useState, useRef, useEffect } from 'react';
import {
  Play,
  BarChart,
  Share2,
  BookOpen,
  CreditCard,
  Brain,
  Menu,
  Edit,
  Trash2,
  RotateCcw,
  Plus,
  X,
} from "lucide-react";

// Mock data to simulate your deck context
const mockDeck = {
  id: 1,
  name: "Geography",
  description:
    "Comprehensive study of climate zones, weather patterns, and geographical features around the world",
  cards: [
    {
      id: 1,
      question: "What are the main factors that determine climate zones?",
      answer:
        "Latitude, altitude, proximity to water bodies, and prevailing wind patterns.",
      point: 0,
    },
    {
      id: 2,
      question:
        "Which climate zone is characterized by hot and humid conditions year-round?",
      answer: "Tropical climate zone, typically found near the equator.",
      point: 0,
    },
    {
      id: 3,
      question: "What distinguishes arid climate zones from other zones?",
      answer:
        "Arid zones are very dry with little precipitation and include desert regions.",
      point: 0,
    },
    {
      id: 4,
      question: "What characterizes temperate climate zones?",
      answer:
        "Moderate temperatures with distinct seasons and balanced precipitation throughout the year.",
      point: 0,
    },
  ],
};

export default function Deckdetail() {
//   const [deck, setDeck] = useState(mockDeck);
  const [viewMode, setViewMode] = useState("summary");
  const [showStats, setShowStats] = useState(false);

  /////////////////////////
  const { decks, setDecks } = useDecks();
  console.log(decks)
  const { id } = useParams();
  const [adding, setAdding] = useState(false);

  const deck = decks.find((d) => String(d.id) === id);

  const [editingId, setEditingId] = useState(null);
  const [formQ, setFormQ] = useState("");
  const [formA, setFormA] = useState("");
  const [formImg, setFormImg] = useState("");
  const [fileObj, setFileObj] = useState(null);
  const inputFileRef = useRef();
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const newFileRef = useRef();
  const [newFileObj, setNewFileObj] = useState(null);
  const [newImgUrl, setNewImgUrl] = useState("");

  const [showPopUp, setShowPopUp] = useState(false);
  const [taxonomyCounts, setTaxonomyCounts] = useState({
    Remembering: 0,
    Understanding: 0,
    Applying: 0,
  });

  const getTaxonomyLabelColor = (taxonomy) => {
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

  useEffect(() => {
    if (deck) {
      const counts = {
        Remembering: 0,
        Understanding: 0,
        Applying: 0,
      };

      deck.cards.forEach((card) => {
        counts[card.taxonomy] = (counts[card.taxonomy] || 0) + 1;
      });

      setTaxonomyCounts(counts);

      if (!localStorage.getItem(`deck-${deck.id}-popup-shown`)) {
        setShowPopUp(true);
        localStorage.setItem(`deck-${deck.id}-popup-shown`, "true");
      }
    }
  }, [deck]);

  if (!deck) {
    return <div className="p-8">Deck not found!</div>;
  }

  function onNewFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setNewFileObj(f);
    setNewImgUrl(URL.createObjectURL(f));
  }

  function handleDeleteCard(cardId) {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    const updated = decks.map((d) =>
      d.id !== deck.id
        ? d
        : {
            ...d,
            cards: d.cards.filter((c) => c.id !== cardId),
            total: d.total - 1,
            due: Math.max(0, d.due - 1),
          }
    );
    setDecks(updated);
    localStorage.setItem("decks", JSON.stringify(updated));
  }

  function startEdit(card) {
    setEditingId(card.id);
    setFormQ(card.question);
    setFormA(card.answer);
    setFormImg(card.image || "");
    setFileObj(null);
  }

  async function finishEdit(card) {
    const newImg = fileObj ? formImg : card.image;

    setDecks((prev) =>
      prev.map((d) =>
        d.id !== deck.id
          ? d
          : {
              ...d,
              cards: d.cards.map((c) =>
                c.id !== card.id
                  ? c
                  : {
                      ...c,
                      question: formQ,
                      answer: formA,
                      image: newImg,
                      taxonomy: "Manual",
                    }
              ),
            }
      )
    );
    localStorage.setItem("decks", JSON.stringify(decks));
    setEditingId(null);
  }

  function onFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFileObj(f);
    setFormImg(URL.createObjectURL(f));
  }

  function cancelAdd() {
    setAdding(false);
    setNewQ("");
    setNewA("");
    setNewImgUrl("");
    setNewFileObj(null);
  }

  function saveNewCard() {
    if (!newQ.trim() || !newA.trim()) {
      return alert("Q and A are required");
    }
    const card = {
      id: uuid(),
      question: newQ.trim(),
      answer: newA.trim(),
      keyword: "",
      needs_image: !!newImgUrl,
      image: newImgUrl,
      point: 0,
      repetitions: 0,
      interval: 0,
      ef: 2.5,
      due: new Date().toISOString().slice(0, 10),
      taxonomy: "Manual",
    };
    const updated = decks.map((d) =>
      d.id !== deck.id
        ? d
        : {
            ...d,
            cards: [card, ...d.cards],
            total: d.total + 1,
            due: d.due + 1,
          }
    );
    setDecks(updated);
    localStorage.setItem("decks", JSON.stringify(updated));
    cancelAdd();
  }

  //////////////////////////

  const handlePlay = () => {
    console.log("Play mode activated");
    // In real app: navigate(`/deck/${deck.id}/play`);
  };

  const handleReset = () => {
    setDeck((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => ({ ...c, point: 0 })),
    }));
  };

  const deleteCard = (cardId) => {
    setDeck((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== cardId),
    }));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <header className="w-full bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              
              <div>
                <h1 className="text-sm sm:text-sm font-bold text-gray-900">
                  {deck.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <ActionButton
                icon={Play}
                label="Play"
                onClick={handlePlay}
                variant="primary"
              />
              <ActionButton
                icon={BarChart}
                label="Stats"
                onClick={() => setShowStats(true)}
              />
              <ActionButton icon={Share2} label="Share" disabled />
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Tab Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex space-x-8">
              <TabButton
                label="Summary"
                icon={BookOpen}
                active={viewMode === "summary"}
                onClick={() => setViewMode("summary")}
              />
              <TabButton
                label="Flashcards"
                icon={CreditCard}
                active={viewMode === "cards"}
                onClick={() => setViewMode("cards")}
              />
              <TabButton
                label="Smart Quiz"
                icon={Brain}
                active={viewMode === "quiz"}
                onClick={() => setViewMode("quiz")}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="px-4 sm:px-6 py-8 w-full">
          {viewMode === "summary" && <SummaryTab deck={deck} />}
          {viewMode === "cards" && (
            <FlashcardView deck={deck} onDeleteCard={deleteCard} />
          )}
          {viewMode === "quiz" && <SmartQuizView deck={deck} />}
        </div>
      </main>

      {/* Stats Modal */}
      {showStats && (
        <StatsModal
          deck={deck}
          onClose={() => setShowStats(false)}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  variant = "default",
}) {
  const variants = {
    default: "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
    primary:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`
        flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 font-medium
        ${variants[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${variant === "primary" ? "px-4 space-x-2" : ""}
      `}
    >
      <Icon className="w-5 h-5" />
      {variant === "primary" && (
        <span className="hidden sm:inline text-sm font-semibold">{label}</span>
      )}
    </button>
  );
}

function TabButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 py-4 px-6 border-b-3 transition-all duration-200 font-medium
        ${
          active
            ? "border-blue-500 text-blue-600 bg-blue-50/50"
            : "border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-200"
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function SummaryTab({ deck }) {
  return (
    <div className="space-y-8">
      {/* Description Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              About this deck
            </h2>
            <p className="text-gray-600 leading-relaxed">{deck.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center space-x-3 mb-8">
          <span className="text-3xl">🌍</span>
          <h2 className="text-2xl font-bold text-gray-900">
            Climate Zones of the World
          </h2>
        </div>

        <div className="prose prose-lg prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            Climate zones are regions of the Earth that have similar weather
            patterns, temperatures, and precipitation levels. Understanding
            these zones is crucial for studying geography, ecology, and human
            settlement patterns across our planet.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Key Climate Factors
            </h3>
            <p className="text-gray-700 mb-4">
              The major climate zones are determined by several interconnected
              factors that work together to create distinct environmental
              conditions around the world.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            The Five Major Climate Zones
          </h3>

          <div className="grid gap-4 mb-8">
            {[
              {
                name: "Tropical",
                desc: "Hot and humid year-round, found near the equator with consistent temperatures",
                emoji: "🌴",
              },
              {
                name: "Arid",
                desc: "Very dry with little precipitation, includes both hot and cold deserts",
                emoji: "🏜️",
              },
              {
                name: "Temperate",
                desc: "Moderate temperatures with distinct seasons and balanced precipitation",
                emoji: "🌳",
              },
              {
                name: "Continental",
                desc: "Large temperature variations between seasons, found in interior regions",
                emoji: "🏔️",
              },
              {
                name: "Polar",
                desc: "Very cold temperatures year-round, found at high latitudes",
                emoji: "🧊",
              },
            ].map((zone, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"
              >
                <span className="text-2xl flex-shrink-0">{zone.emoji}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {zone.name}
                  </h4>
                  <p className="text-gray-600 text-sm">{zone.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h4 className="font-semibold text-amber-900 mb-2">
              🌡️ Climate Change Impact
            </h4>
            <p className="text-amber-800 text-sm">
              Each climate zone has unique characteristics that influence the
              types of plants, animals, and human activities that can thrive
              there. Climate change is currently affecting these traditional
              boundaries and shifting weather patterns globally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlashcardView({ deck, onDeleteCard }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Flashcards</h2>
        <p className="text-gray-600">{deck.description}</p>
      </div>

      {/* Cards Grid */}
      <div className="space-y-4">
        {deck.cards.map((card, index) => (
          <FlashcardItem
            key={card.id}
            card={card}
            index={index + 1}
            onDelete={() => onDeleteCard(card.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {deck.cards.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No flashcards yet
          </h3>
          <p className="text-gray-500">
            Add some cards to get started with your studying!
          </p>
        </div>
      )}
    </div>
  );
}

function FlashcardItem({ card, index, onDelete }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
            {index}
          </span>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start space-x-3">
              <span className="font-semibold text-blue-900 flex-shrink-0">
                Q:
              </span>
              <p className="text-blue-800 font-medium">{card.question}</p>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-xl">
            <div className="flex items-start space-x-3">
              <span className="font-semibold text-green-900 flex-shrink-0">
                A:
              </span>
              <p className="text-green-800">{card.answer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmartQuizView({ deck }) {
  const generatePerformance = () => Math.floor(Math.random() * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Quiz</h2>
        <p className="text-gray-600">{deck.description}</p>
      </div>

      {/* Quiz Cards */}
      <div className="space-y-4">
        {deck.cards.map((card, index) => (
          <QuizCard
            key={card.id}
            quiz={{
              id: card.id,
              label: `Q${index + 1}`,
              question: card.question,
              performance: generatePerformance(),
            }}
          />
        ))}
      </div>

      {/* Add Quiz Button */}
      <AddQuizButton />

      {/* Empty State */}
      {deck.cards.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No quiz questions
          </h3>
          <p className="text-gray-500">
            Add some flashcards first to generate quiz questions!
          </p>
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz }) {
  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 60)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getPerformanceIcon = (percentage) => {
    if (percentage >= 80) return "🎯";
    if (percentage >= 60) return "⚡";
    return "📈";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1.5 rounded-full">
              {quiz.label}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full border ${getPerformanceColor(
                quiz.performance
              )}`}
            >
              {getPerformanceIcon(quiz.performance)} {quiz.performance}%
            </span>
          </div>
          <p className="text-gray-900 font-medium text-lg leading-relaxed">
            {quiz.question}
          </p>
        </div>
        <button className="p-3 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors ml-4">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function AddQuizButton() {
  return (
    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-6 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
      <Plus className="w-6 h-6" />
      <span className="text-lg">Add New Quiz Question</span>
    </button>
  );
}

function StatsModal({ deck, onClose, onReset }) {
  const totalCards = deck.cards.length;
  const avgScore =
    deck.cards.reduce((acc, card) => acc + card.point, 0) / totalCards || 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Deck Statistics
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalCards}
              </div>
              <div className="text-sm text-blue-800 font-medium">
                Total Cards
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {avgScore.toFixed(1)}%
              </div>
              <div className="text-sm text-green-800 font-medium">
                Average Score
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onReset();
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
            >
              Reset Scores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
