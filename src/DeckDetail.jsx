import { useParams, useNavigate } from "react-router-dom";
import { useDecks } from "./lib/DeckContext";
import { v4 as uuid } from "uuid";
import { useState, useRef, useEffect } from "react";
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
  Settings,
} from "lucide-react";

import SummaryTab from "./SummaryTab";
import StatsPopup from "./StatsPopup";
import FlashcardView from "./FlashcardView";
import SettingsModal from "./showSettings";
import SharePopup from "./SharePopup";
import SmartQuizView from "./SmartQuiz";

// Custom Play icon
const PlayIcon = ({ size = 24, color = "#ffffff" }) => {
  const width = size;
  const height = size;
  const points = [
    `${width * 0.3},${height * 0.2}`,
    `${width * 0.7},${height * 0.5}`,
    `${width * 0.3},${height * 0.8}`,
  ].join(" ");
  const strokeWidth = size * 0.08;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points={points}
        fill={color}
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default function Deckdetail() {
  const { decks, setDecks } = useDecks();
  const { id } = useParams();
  const navigate = useNavigate();

  // Find current deck
  const deck = decks.find((d) => String(d.id) === id);
  if (!deck) {
    return <div className="p-8">Deck not found!</div>;
  }

  // Initialize viewMode from deck property (persisted)
  const viewMode = deck.viewMode || "summary";

  // Helper to change and persist viewMode on deck
  const changeViewMode = (newMode) => {
    setDecks((all) =>
      all.map((d) => (d.id === deck.id ? { ...d, viewMode: newMode } : d))
    );
  };

  // Play handler based on last selected mode
  const handlePlay = () => {
    if (viewMode === "cards") navigate(`/deck/${deck.id}/play`);
    if (viewMode === "quiz") navigate(`/deck/${deck.id}/quiz/0`);
  };

  // Popups, settings, taxonomy counts etc...
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [taxonomyCounts, setTaxonomyCounts] = useState({
    Remembering: 0,
    Understanding: 0,
    Applying: 0,
  });

  useEffect(() => {
    // calculate taxonomy counts
    const counts = { Remembering: 0, Understanding: 0, Applying: 0 };
    deck.cards.forEach((card) => {
      counts[card.taxonomy] = (counts[card.taxonomy] || 0) + 1;
    });
    setTaxonomyCounts(counts);
    // first-time popup
    if (!localStorage.getItem(`deck-${deck.id}-popup-shown`)) {
      setShowPopUp(true);
      localStorage.setItem(`deck-${deck.id}-popup-shown`, "true");
    }
  }, [deck]);

  // Card deletion and update handlers omitted for brevity...

  const shareLink = `https://relian.com/deck/${deck.id}?share=true`;
  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };

  // Render
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* Header with Play, Stats, Share, Settings */}
      <header className="w-full bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 z-50">
        <div className="px-4 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <h1 className="font-bold text-gray-900">{deck.name}</h1>
            <div className="flex items-center space-x-2">
              {viewMode !== "summary" && (
                <ActionButton
                  icon={PlayIcon}
                  label={viewMode === "cards" ? "Play" : "Quiz"}
                  onClick={handlePlay}
                  variant={viewMode === "cards" ? "primary" : "quiz"}
                />
              )}
              <ActionButton
                icon={BarChart}
                label="Stats"
                onClick={() => setShowStats(true)}
              />
              <ActionButton
                icon={Share2}
                label="Share"
                onClick={() => setShowSharePopup((v) => !v)}
              />
              <ActionButton
                icon={Settings}
                label="Settings"
                onClick={() => setShowSettings((v) => !v)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 z-40">
        <div className="px-4 lg:px-8">
          <div className="flex">
            <TabButton
              label="Summary"
              icon={BookOpen}
              active={viewMode === "summary"}
              onClick={() => changeViewMode("summary")}
            />
            <TabButton
              label="Flashcards"
              icon={CreditCard}
              active={viewMode === "cards"}
              onClick={() => changeViewMode("cards")}
            />
            <TabButton
              label="Smart Quiz"
              icon={Brain}
              active={viewMode === "quiz"}
              onClick={() => changeViewMode("quiz")}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-8">
        {viewMode === "summary" && <SummaryTab deck={deck} />}
        {viewMode === "cards" && <FlashcardView deck={deck} /* handlers */ />}
        {viewMode === "quiz" && <SmartQuizView />}
      </main>

      {/* Modals and Popups */}
      {showStats && (
        <StatsPopup deckId={deck.id} onClose={() => setShowStats(false)} />
      )}
      <SettingsModal
        isOpen={showSettings}
        onClose={setShowSettings}
        /* rename, edit, delete handlers */
      />
      <SharePopup
        showSharePopup={showSharePopup}
        setShowSharePopup={setShowSharePopup}
        copyLink={copyLink}
        shareLink={shareLink}
      />
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
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white",
    quiz: "bg-indigo-500 hover:bg-indigo-600 text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`flex items-center p-2.5 rounded-xl transition ${
        variants[variant]
      } ${variant !== "default" ? "px-4 space-x-2" : ""} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <Icon className="w-7 h-7" />
      {variant !== "default" && (
        <span className="hidden sm:inline font-semibold text-xl">{label}</span>
      )}
    </button>
  );
}

function TabButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 py-4 px-6 border-b-3 transition font-medium ${
        active
          ? "border-blue-500 text-blue-600 bg-blue-100/50"
          : "border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-200"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-2xl font-semibold">{label}</span>
    </button>
  );
}
