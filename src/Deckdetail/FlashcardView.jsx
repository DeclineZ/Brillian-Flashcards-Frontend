import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Edit,
  Trash2,
  Check,
  X,
} from 'lucide-react';

export default function FlashcardView({ deck, onDeleteCard, onUpdateCard }) {
  // Maintain local cards state to reflect edits immediately
  const [cards, setCards] = useState(deck.cards);

  // Handle updating a card both locally and via parent callback
  const handleUpdateCard = (id, updatedFields, file) => {
    console.log("handle update")
    setCards(prev =>
      prev.map(card => (card.id === id ? { ...card, ...updatedFields } : card))
    );
    if (onUpdateCard) onUpdateCard(id, updatedFields, file);
  };

  // Handle deleting a card locally and via parent callback
  const handleDeleteCard = id => {
    setCards(prev => prev.filter(card => card.id !== id));
    if (onDeleteCard) onDeleteCard(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Flashcards</h2>
        <p className="text-gray-600">{deck.description}</p>
      </div>

      {/* Cards Grid */}
      <div className="space-y-4">
        {cards.map((card, index) => (
          <FlashcardItem
            key={card.id}
            card={card}
            index={index + 1}
            onDelete={() => handleDeleteCard(card.id)}
            onUpdate={(updated, file) => handleUpdateCard(card.id, updated, file)}
          />
        ))}
      </div>

      {/* Empty State */}
      {cards.length === 0 && (
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

function FlashcardItem({ card, index, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(card.question);
  const [editedAnswer, setEditedAnswer] = useState(card.answer);
  const [editedImageURL, setEditedImageURL] = useState(card.image || '');
  const [editedImageFile, setEditedImageFile] = useState(null);

  // Cleanup preview URL on unmount or change
  useEffect(() => {
    return () => {
      if (editedImageURL && editedImageFile) URL.revokeObjectURL(editedImageURL);
    };
  }, [editedImageURL, editedImageFile]);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setEditedImageFile(file);
      setEditedImageURL(preview);
    }
  };

  const handleSave = () => {
    const updated = {
      question: editedQuestion.trim(),
      answer: editedAnswer.trim(),
      image: editedImageFile ? null : editedImageURL.trim() || null,
    };
    onUpdate(updated, editedImageFile);
    setIsEditing(false);
    setEditedImageFile(null);
  };

  const handleCancel = () => {
    setEditedQuestion(card.question);
    setEditedAnswer(card.answer);
    setEditedImageURL(card.image || '');
    setEditedImageFile(null);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
            {index}
          </span>
          <div className="flex space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Image + Q/A Layout */}
        <div className="flex items-start space-x-4">
          {(editedImageURL || isEditing) && (
            <div className="flex-shrink-0 w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
              {!isEditing && editedImageURL ? (
                <img
                  src={editedImageURL}
                  alt="Flashcard"
                  className="w-full h-full object-cover"
                />
              ) : isEditing ? (
                <label className="w-full h-full flex flex-col items-center justify-center text-gray-500 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {editedImageURL ? (
                    <img
                      src={editedImageURL}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">Upload</span>
                  )}
                  <p className="mt-1 text-xs text-gray-500">You can upload an image</p>
                </label>
              ) : (
                <CreditCard className="w-10 h-10 text-gray-300" />
              )}
            </div>
          )}

          <div className="flex-1 space-y-2">
            <div className="p-2 bg-gray-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <span className="font-semibold text-blue-900 flex-shrink-0">Q:</span>
                {!isEditing ? (
                  <p className="text-blue-800 font-medium">{card.question}</p>
                ) : (
                  <textarea
                    value={editedQuestion}
                    onChange={e => setEditedQuestion(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2 text-blue-800 font-medium"
                    rows={2}
                  />
                )}
              </div>
            </div>

            <div className="p-2 bg-blue-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <span className="font-semibold text-green-900 flex-shrink-0">A:</span>
                {!isEditing ? (
                  <p className="text-gray-800">{card.answer}</p>
                ) : (
                  <textarea
                    value={editedAnswer}
                    onChange={e => setEditedAnswer(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2 text-gray-800"
                    rows={2}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
