// src/FlashcardsTab.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDecks } from "./lib/DeckContext";
import { v4 as uuid } from "uuid";
import { PlusCircle, Plus, Check, Pencil, Trash2 } from "lucide-react";

export default function FlashcardsTab() {
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

  return (
    <div className="flex flex-col h-full min-h-0">
      {adding ? (
        <div className="bg-white p-4 rounded shadow space-y-2 border border-gray-200 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-black">New Card</h3>
            <button className="text-gray-500">
              <Plus size={20} />
            </button>
          </div>

          <input
            type="text"
            placeholder="Question"
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
            className="w-full border rounded px-2 py-1 text-black"
          />

          <textarea
            rows={2}
            placeholder="Answer"
            value={newA}
            onChange={(e) => setNewA(e.target.value)}
            className="w-full border rounded px-2 py-1 text-black"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => newFileRef.current.click()}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Choose Image
            </button>
            <span className="text-sm text-gray-600">
              {newFileObj?.name ??
                (newImgUrl ? "Using current image" : "No image")}
            </span>
          </div>
          <input
            ref={newFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onNewFileChange}
          />

          {newImgUrl && (
            <img
              src={newImgUrl}
              className="w-24 h-24 object-cover rounded border"
            />
          )}

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={saveNewCard}
              className="flex items-center gap-1 px-4 py-1 bg-blue-600 text-white rounded"
            >
              <Check size={16} /> Save
            </button>
            <button
              onClick={cancelAdd}
              className="px-4 py-1 bg-gray-200 text-gray-700 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
        >
          <PlusCircle size={18} /> Add Card
        </button>
      )}

      <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-2">
        {deck.cards.map((card) => {
          const isEditing = editingId === card.id;
          return (
            <div
              key={card.id}
              className="bg-white rounded shadow p-4 border border-gray-200 relative"
            >
              {/* edit/save icon */}
              <button
                onClick={() => (isEditing ? finishEdit(card) : startEdit(card))}
                className="absolute top-2 right-8 text-gray-600 hover:text-gray-800 mr-4"
              >
                {isEditing ? <Check size={18} /> : <Pencil size={18} />}
              </button>

              <button
                onClick={() => handleDeleteCard(card.id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>

              {isEditing ? (
                <>
                  {/* Question input */}
                  <p className="text-black font-bold">Question</p>
                  <textarea
                    value={formQ}
                    onChange={(e) => setFormQ(e.target.value)}
                    rows={2}
                    className="w-full border rounded p-2 mb-2 text-black"
                  />

                  {/* Answer input */}
                  <p className="text-black font-bold">Answer</p>
                  <textarea
                    value={formA}
                    onChange={(e) => setFormA(e.target.value)}
                    rows={2}
                    className="w-full border rounded p-2 mb-2 text-black"
                  />

                  {/* Image picker */}
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => inputFileRef.current.click()}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Choose Image
                    </button>
                    <span className="text-sm text-gray-600">
                      {fileObj
                        ? fileObj.name
                        : formImg
                        ? "Using current image"
                        : "No image"}
                    </span>
                  </div>
                  <input
                    ref={inputFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  {formImg && (
                    <img
                      src={formImg}
                      alt=""
                      className="w-24 h-24 object-cover rounded mb-2 border"
                    />
                  )}
                </>
              ) : (
                <>
                  {/* Display mode: only add gap if there's an image */}
                  <div
                    className={`flex items-center ${
                      card.image ? "gap-5" : "gap-0"
                    }`}
                  >
                    {card.image && (
                      <img
                        src={card.image}
                        alt=""
                        className="w-24 h-24 object-cover rounded border flex-shrink-0"
                      />
                    )}
                    <div>
                      <h2 className="font-semibold mb-1 text-black">
                        Q: {card.question}
                        <span
                          className={`taxonomy-label ${getTaxonomyLabelColor(
                            card.taxonomy
                          )} ml-2`}
                        >
                          {card.taxonomy}
                        </span>
                      </h2>
                      <p className="text-sm text-gray-600 ">A: {card.answer}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
