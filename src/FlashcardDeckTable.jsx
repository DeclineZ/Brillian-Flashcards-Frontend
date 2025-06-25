// src/components/FlashcardDeckTable.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDecks } from './lib/DeckContext'
import { Clock, Eye, EyeOff } from 'lucide-react'
import profile from './assets/profile.png'

// static ranking data
const rankingData = [
  { name: 'Alice', timePlayed: 320, avatar: profile },
  { name: 'Bob', timePlayed: 450, avatar: profile },
  { name: 'Charlie', timePlayed: 210, avatar: profile },
  { name: 'You', timePlayed: 380, avatar: profile },
  { name: 'Eve', timePlayed: 290, avatar: profile },
  { name: 'Eve', timePlayed: 290, avatar: profile },
  { name: 'Eve', timePlayed: 290, avatar: profile },
  { name: 'Eve', timePlayed: 290, avatar: profile },
  { name: 'Eve', timePlayed: 290, avatar: profile },
  { name: 'Eve', timePlayed: 290, avatar: profile },
  { name: 'Eve', timePlayed: 290, avatar: profile },
  { name: 'Eve', timePlayed: 290, avatar: profile },
]

// Full Ranking sidebar component
const Ranking = ({ onToggle }) => {
  const sortedData = rankingData.slice().sort((a, b) => b.timePlayed - a.timePlayed)
  const currentUser = sortedData.find(item => item.name === 'You')
  const currentRank = currentUser ? sortedData.indexOf(currentUser) + 1 : null

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col space-y-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock size={20} className="text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800">Ranking</h2>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-full hover:bg-gray-100 transition"
          aria-label="Hide details"
        >
          <EyeOff size={18} className="text-gray-600" />
        </button>
      </div>
      <ul className="space-y-2 h-[calc(88vh-6rem)] overflow-auto">
        {sortedData.map((item, idx) => {
          const isCurrent = item.name === 'You'
          const rankClass =
            idx === 0 ? 'text-yellow-500 font-bold' :
            idx === 1 ? 'text-gray-500 font-semibold' :
            idx === 2 ? 'text-orange-400 font-semibold' :
            'text-gray-700'
          return (
            <li
              key={item.name}
              className={`flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition ${isCurrent ? 'bg-indigo-50' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${rankClass}`}>#{idx + 1}</span>
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-800">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-700">{item.timePlayed} mins</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// Collapsed ranking: vertical stack next to list
const CollapsedRanking = ({ onToggle }) => {
  const sortedData = rankingData.slice().sort((a, b) => b.timePlayed - a.timePlayed)
  return (
    <div className="flex-none flex flex-col items-center space-y-2 w-20">
      <button
        onClick={onToggle}
        className="p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Show ranking"
      >
        <Eye size={20} className="text-gray-600" />
      </button>
      {sortedData.slice(0, 10).map((item, idx) => (
        <img
          key={idx}
          src={item.avatar}
          alt={item.name}
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
        />
      ))}
    </div>)
}

export default function FlashcardDeckTable() {
  const navigate = useNavigate()
  const { decks } = useDecks()
  const validDecks = Array.isArray(decks) ? decks : []
  const [showRanking, setShowRanking] = useState(true)

  const gridStyle = {
    gridTemplateColumns: '4fr 6fr repeat(3, minmax(4rem, 1fr)) minmax(8rem, 1fr)',
  }

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-black">Study Decks</h1>
      <div className="flex gap-6">
        {/* Deck list: flex-grow to fill remaining space */}
        <div className="flex-grow">
          {/* table header */}
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

          {/* deck cards */}
          <div className="space-y-4">
            {validDecks.length === 0 ? (
              <p className="text-center py-10 text-gray-500">
                No decks available. Click the + icon on the left to get started.
              </p>
            ) : (
              validDecks.map((d) => {
                const { id, name, total, learned, due, quiz } = d
                const pct = total > 0 ? (learned / total) * 100 : 0
                const [iconCandidate, ...rest] = name.trim().split(' ')
                const icon = iconCandidate.length === 2 || /\p{Emoji}/u.test(iconCandidate) ? iconCandidate : '📚'
                const title = rest.join(' ') || name

                return (
                  <div
                    key={id}
                    className="grid items-center gap-x-4 bg-white p-6 rounded-2xl shadow hover:shadow-xl transition cursor-pointer"
                    style={gridStyle}
                    onClick={() => navigate(`/deck/${id}`)}
                  >
                    <div className="flex items-center gap-2 text-gray-800 truncate">
                      <span className="text-2xl">{icon}</span>
                      <span className="font-semibold truncate">{title}</span>
                    </div>
                    <div className="flex justify-end w-full px-2">
                      <div className="w-[50%] h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-3 bg-teal-400" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-center text-gray-800 font-medium pl-8">{total}</div>
                    <div className={`text-center font-semibold ${
                        learned === 0 ? 'text-gray-500' : learned === total ? 'text-red-500' : 'text-green-600'
                      }`}
                    >
                      {learned}
                    </div>
                    <div className="text-right text-pink-500 font-semibold pr-2">{due}</div>
                    <div className="text-right">
                      {quiz?.attempted > 0 ? (
                        <div className={`inline-flex flex-col items-end px-3 py-2 border rounded-full text-sm font-medium ${
                            quiz.avgScore < 60 ? 'border-orange-400 text-orange-600' : 'border-green-400 text-green-600'
                          }`}
                        >
                          <span>{`${quiz.attempted}% attempted`}</span>
                          <span className="text-xs font-normal">{`${quiz.avgScore}% avg. score`}</span>
                        </div>
                      ) : (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                          onClick={(e) => { e.stopPropagation(); navigate(`/deck/${id}/quiz`) }}
                        >Practice</button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Ranking column: fixed 1/4 width when visible, small fixed when collapsed */}
        <div className={showRanking ? 'flex-none w-1/4 flex justify-end' : 'flex-none'}>
          {showRanking ? (
            <Ranking onToggle={() => setShowRanking(false)} />
          ) : (
            <CollapsedRanking onToggle={() => setShowRanking(true)} />
          )}
        </div>
      </div>
    </div>)
}
