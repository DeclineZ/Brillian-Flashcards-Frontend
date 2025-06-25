// src/components/FlashcardDeckTable.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDecks } from './lib/DeckContext'

export default function FlashcardDeckTable() {
  const navigate = useNavigate()
  const { decks } = useDecks()
  const validDecks = Array.isArray(decks) ? decks : []

  const gridStyle = {
    gridTemplateColumns: '3fr 5fr repeat(3, minmax(4rem, 1fr)) minmax(8rem, 1fr)'
  }

  return (
    <div className="w-full mx-auto p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-black">Study Decks</h1>

      {/* Column Headers */}
      <div
        className="grid text-sm font-medium text-gray-500 mb-2 px-10 items-center"
        style={gridStyle}
      >
        <div className="truncate">Deck Name</div>
        <div className="text-center">Progress</div>
        <div className="text-center">Total</div>
        <div className="text-center">Learned</div>
        <div className="text-right">Due</div>
        <div className="text-right">Quizzes</div>
      </div>

      {/* Deck Rows */}
      <div className="space-y-4">
        {validDecks.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No decks available. Click the + icon on the left to get started.
          </p>
        ) : (
          validDecks.map((d) => {
            const { id, name, total, learned, due, quiz } = d
            const pct = total > 0 ? (learned / total) * 100 : 0

            // Split name into [emoji, ...rest]
            const [iconCandidate, ...rest] = name.trim().split(' ')
            const icon = iconCandidate.length === 2 || /\p{Emoji}/u.test(iconCandidate)
              ? iconCandidate
              : '📚'
            const title = rest.join(' ') || name

            return (
              <div
                key={id}
                className="grid items-center gap-x-4 bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                style={gridStyle}
                onClick={() => navigate(`/deck/${id}`)}
              >
                {/* Deck name + emoji */}
                <div className="flex items-center gap-2 text-gray-800 truncate">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-semibold truncate">{title}</span>
                </div>

                {/* Progress bar */}
                <div className="flex justify-end w-full px-2 ">
                  <div className="w-[50%] h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-teal-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="text-center text-gray-800 font-medium pl-8">
                  {total}
                </div>

                {/* Learned */}
                <div
                  className={`text-center font-semibold  ${
                    learned === 0
                      ? 'text-gray-500'
                      : learned === total
                      ? 'text-red-500'
                      : 'text-green-600'
                  }`}
                >
                  {learned}
                </div>

                {/* Due */}
                <div className="text-right text-pink-500 font-semibold pr-2">
                  {due}
                </div>

                {/* Quizzes */}
                <div className="text-right">
                  {quiz?.attempted > 0 ? (
                    <div
                      className={`inline-flex flex-col items-end px-3 py-2 border rounded-full text-sm font-medium ${
                        quiz.avgScore < 60
                          ? 'border-orange-400 text-orange-600'
                          : 'border-green-400 text-green-600'
                      }`}
                    >
                      <span>{`${quiz.attempted}% attempted`}</span>
                      <span className="text-xs font-normal">
                        {`${quiz.avgScore}% avg. score`}
                      </span>
                    </div>
                  ) : (
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                      onClick={e => {
                        // prevent row click
                        e.stopPropagation()
                        navigate(`/deck/${id}/quiz`)
                      }}
                    >
                      Practice
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
