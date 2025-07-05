import React from "react";
import { useParams } from "react-router-dom";
import { useDecks } from "./lib/DeckContext";
import {
  BookOpen,
} from "lucide-react";

export default function SummaryTab() {
  const { id } = useParams();
  const { decks } = useDecks();
  const deck = decks.find((d) => String(d.id) === id);
  if (!deck) return <p className="p-4 text-gray-500">Deck not found</p>;
  const summaryHtml = deck.summaryHtml;

  return (
    <div className="space-y-8">
      {/* About Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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
      
      {/* Description Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div
          className="prose max-w-none text-black"
          dangerouslySetInnerHTML={{ __html: summaryHtml }}
        />
      </div>
    </div>
  );
}
