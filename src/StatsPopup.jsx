import React from 'react'
import { useDecks } from './lib/DeckContext'

export default function StatsPopup({ onClose, deckId }) {
  const { decks } = useDecks()
  const deck = decks.find(d => d.id === deckId)
  if (!deck) return null

  const studiedCount = deck.learned
  const dueCount     = deck.due
  const total        = studiedCount + dueCount || 1
  const studiedPct   = (studiedCount / total) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative bg-white w-[500px] p-6 rounded-2xl shadow-xl">
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &#10005;
        </button>

        <h3 className="text-2xl font-semibold mb-4 text-center text-black">
          Deck Progress
        </h3>

        {/* horizontal progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="h-4 rounded-full bg-green-500"
            style={{ width: `${studiedPct}%` }}
          />
        </div>
        <div className="flex justify-between text-sm mb-6 px-1 text-gray-600">
          <span>{studiedPct.toFixed(1)}% Studied</span>
          <span>{(100 - studiedPct).toFixed(1)}% Due</span>
        </div>

        {/* numeric breakdown */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600">
              {studiedCount}
            </div>
            <div className="text-gray-600">Studied</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-500">
              {dueCount}
            </div>
            <div className="text-gray-600">Due</div>
          </div>
        </div>
      </div>
    </div>
  )
}
