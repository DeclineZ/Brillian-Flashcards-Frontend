import { useParams, useNavigate } from "react-router-dom";
import { useDecks } from "../lib/DeckContext";
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

// Mock data to simulate your deck context
const PlayIcon = ({ size = 24, color = "#ffffff" }) => {
  const width = size;
  const height = size;
  // Triangle points: left-top, right-center, left-bottom
  const points = [
    `${width * 0.3},${height * 0.2}`,
    `${width * 0.7},${height * 0.5}`,
    `${width * 0.3},${height * 0.8}`,
  ].join(" ");

  // Stroke width for rounded corners
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
  //   const [deck, setDeck] = useState(mockDeck);
  const [viewMode, setViewMode] = useState("summary");
  const [showStats, setShowStats] = useState(false);

  /////////////////////////
  const { decks, setDecks } = useDecks();
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
  const [showSettings, setShowSettings] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [taxonomyCounts, setTaxonomyCounts] = useState({
    Remembering: 0,
    Understanding: 0,
    Applying: 0,
  });
  const navigate = useNavigate();

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

  function handleDeleteCard(cardId) {
    if (window.confirm("Are you sure you want to delete this card?")) {
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
    localStorage.setItem("decks", JSON.stringify(updated));}
  }

  function handleUpdateCard(
    cardId,
    updatedFields /*, file if you need to upload */
  ) {
    // update the decks array
    const updatedDecks = decks.map((d) =>
      d.id !== deck.id
        ? d
        : {
            ...d,
            cards: d.cards.map((c) =>
              c.id !== cardId
                ? c
                : {
                    ...c,
                    ...updatedFields,
                  }
            ),
          }
    );

    // write back into state + localStorage
    setDecks(updatedDecks);
    localStorage.setItem("decks", JSON.stringify(updatedDecks));

    // if you passed a file, upload it here and then update the card.image property
    // e.g. upload(file).then(url => handleUpdateCard(cardId, { image: url }));
  }

  const shareLink = `https://relian.com/deck/${deck.id}?share=true`;
  function copyLink() {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  }

  function handleDeleteDeck() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this deck? This action cannot be undone."
    );
    if (confirmDelete) {
      const updatedDecks = decks.filter((d) => d.id !== deck.id);
      setDecks(updatedDecks);
      localStorage.setItem("decks", JSON.stringify(updatedDecks));
      navigate("/");
    }
    setShowSettings(false);
  }

  function handleEditDetails() {
    const newDescription = prompt(
      "Enter new description for the deck:",
      deck.description
    );
    if (newDescription !== null) {
      const updatedDecks = decks.map((d) =>
        d.id === deck.id ? { ...d, description: newDescription } : d
      );
      setDecks(updatedDecks);
      localStorage.setItem("decks", JSON.stringify(updatedDecks));
    }
    setShowSettings(false);
  }

  function handleRename() {
    const newName = prompt("Enter new name for the deck:", deck.name);
    if (newName) {
      const updatedDecks = decks.map((d) =>
        d.id === deck.id ? { ...d, name: newName } : d
      );
      setDecks(updatedDecks);
      localStorage.setItem("decks", JSON.stringify(updatedDecks));
    }
    setShowSettings(false);
  }
  //////////////////////////

  const handlePlay = () => {
    console.log("Play mode activated");
    (viewMode == "cards" && (navigate(`/deck/${deck.id}/play`)))
    (viewMode == "quiz" && (navigate(`/deck/${deck.id}/quiz/0`)))
    // In real app: navigate(`/deck/${deck.id}/play`);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <header className="w-full bg-white/95 backdrop-blur-sm shadow-lg shadow-blue-200/50 border-b border-gray-200 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-sm sm:text-sm font-bold text-gray-900">
                  {deck.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {viewMode != "summary" && (
                <ActionButton
                  icon={PlayIcon}
                  label={
                    (viewMode == "cards" && "Play") ||
                    (viewMode == "quiz" && "Quiz")
                  }
                  onClick={handlePlay}
                  variant={
                    (viewMode == "cards" && "primary") ||
                    (viewMode == "quiz" && "quiz")
                  }
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
                onClick={() => setShowSharePopup(!showSharePopup)}
              />
              <ActionButton
                icon={Settings}
                label="Setting"
                onClick={() => setShowSettings(!showSettings)}
              />
              
            </div>
          </div>
        </div>
      </header>
      {/* Fixed Tab Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-left">
            <div className="flex ">
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
            <FlashcardView
              deck={deck}
              onDeleteCard={handleDeleteCard}
              onUpdateCard={handleUpdateCard}
            />
          )}
          {viewMode === "quiz" && <SmartQuizView deck={deck} />}
        </div>
      </main>
      {/* Stats Modal */}
      {showStats && (
        <StatsPopup deckId={deck.id} onClose={() => setShowStats(false)} />
      )}
      <SettingsModal
        isOpen={showSettings}
        onClose={setShowSettings}
        onRename={handleRename}
        onEditDetails={handleEditDetails}
        onDelete={handleDeleteDeck}
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
    primary:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg",
    quiz: "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg",
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
        ${variant === "primary" || variant === "quiz" ? "px-4 space-x-2" : ""}
      `}
    >
      <Icon className="w-7 h-7" />
      {variant === "primary" || variant === "quiz" ? (
        <span className="hidden sm:inline text-xl font-semibold">{label}</span>
      ) : (
        ""
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
            ? "border-blue-500 text-blue-600 bg-blue-100/50"
            : "border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-200"
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="text-2xl font-semibold">{label}</span>
    </button>
  );
}


