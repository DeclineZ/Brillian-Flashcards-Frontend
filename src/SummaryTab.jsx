import React from 'react'
import { useParams } from 'react-router-dom'
import { useDecks } from './lib/DeckContext'

export default function SummaryTab() {
  const { id } = useParams()
  const { decks } = useDecks()
  const deck = decks.find(d => String(d.id) === id)
  if (!deck) return <p className="p-4 text-gray-500">Deck not found</p>
  const summaryHtml = deck.summaryHtml


  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white rounded shadow">
    <div
      className="prose max-w-none text-black"
      dangerouslySetInnerHTML={{ __html: summaryHtml }}
    />
  </div>
  );
}
