import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDecks } from './lib/DeckContext';
import { ChevronDown, ChevronRight, Play, CornerDownRight, PencilLine, Check, X, Lightbulb, Timer } from 'lucide-react';

export default function QuizTab() {
  const { id }       = useParams();          
  const navigate     = useNavigate();
  const { decks }    = useDecks();
  const deck         = decks.find(d => String(d.id) === id);
  const [openIdx, setOpenIdx] = useState(null);

  if (!deck) return <div className="p-8">Deck not found.</div>;

  const questions = Array.isArray(deck.quiz) ? deck.quiz : [];

  

  const bestObj = idx => {
    try {
      const raw = localStorage.getItem(`quiz-${deck.id}-${idx}-best`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {questions.length === 0 ? (
        <p className="text-gray-500">
          This deck doesn’t have Smart-Quiz questions yet.
        </p>
      ) : (
        questions.map((q, i) => {
          let best = bestObj(i);
if (best && typeof best === 'number') {
  best = { percent: best };
  localStorage.setItem(
    `quiz-${deck.id}-${i}-best`,
    JSON.stringify(best)
  );
}

// Safe fallbacks
const pct        = best?.percent;
const positives  = Array.isArray(best?.positive) ? best.positive : [];
const negatives  = Array.isArray(best?.negative) ? best.negative : [];
const suggestion = best?.suggestion || '';
const bestAnswer = best?.answer || '';
const bestTime   = typeof best?.time === 'number' ? best.time : null;

          return (
            <div key={i} className="space-y-1">
              <div
                className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl
                           shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() =>
                      best && setOpenIdx(openIdx === i ? null : i)
                    }
                    className={`text-gray-500 hover:text-gray-700
                                ${!best && 'opacity-30 cursor-default'}`}
                    aria-label="toggle details"
                  >
                    {openIdx === i ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>

                  <div className="flex flex-col">
                    <p className="font-medium text-gray-900">
                      {`Q${i + 1} : ${q.question}`}
                    </p>
                    <span className="text-sm font-semibold text-green-500">
                      {pct !== undefined ? `${pct}% correct` : '—'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/deck/${deck.id}/quiz/${i}`)}
                  title="Answer this question"
                  className="p-3 rounded-full bg-blue-50 text-blue-600
                             hover:bg-blue-100 active:scale-95 transition"
                >
                  <CornerDownRight size={18} strokeWidth={2} />
                </button>
              </div>

              {openIdx === i && best && (
  <div className="ml-10 mr-4 mb-4 p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm space-y-1">
  <p className="text-gray-700 whitespace-pre-wrap flex">
    <PencilLine size={17} strokeWidth={2} /> <span className="font-medium">Best Answer: </span> {bestAnswer}
  </p>
    <p className="text-green-500 flex"><span className="font-medium flex"><Check size={17} strokeWidth={2} /> Pros:&nbsp;</span>{positives.length ? positives.join(', ') : '-'}</p>
    <p className="text-red-500 flex"><span className="font-medium text-red-500 flex"><X size={17} strokeWidth={2} /> Missed:&nbsp;</span>{negatives.length ? negatives.join(', ') : '-'}</p>
    <p className="text-yellow-500 flex"><span className="font-medium text-yellow-500 flex"><Lightbulb size={17} strokeWidth={2} /> Suggestions:&nbsp;</span>{suggestion || '-'}</p>
    {bestTime !== null && (
  <p className="text-purple-700 flex">
    <Timer size={17} strokeWidth={2} /> <span className="font-medium">Time Taken:&nbsp;</span> {bestTime.toFixed(1)} seconds
  </p>
)}
  </div>
)}
            </div>
          );
        })
      )}
    </div>
  );
}
