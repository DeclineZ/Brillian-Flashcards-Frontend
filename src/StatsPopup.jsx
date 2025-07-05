
export default function StatsPopup({ deckId, onClose, onReset }) {
  const { decks } = useDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return null;

  // Flashcard Stats
  const studiedCount = deck.learned;
  const dueCount = deck.due;
  const total = studiedCount + dueCount || 1;
  const studiedPct = (studiedCount / total) * 100;

  // Quiz Stats (mock data)
  const totalQuizCount = 8;
  const averageQuizScore = 87.5;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-0">
          <h2 className="text-2xl font-medium text-gray-900">Progress</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="p-8 pt-6">
          {/* Progress Overview */}
          <div className="mb-8">
            <div className="flex items-end justify-between mb-3">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Flashcard Completion
              </span>
              <span className="text-lg font-medium text-gray-900">
                {studiedPct.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${studiedPct}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Flashcard Stats */}
            <div className="space-y-6 p-3">
              <div>
                <div className="text-3xl font-medium text-gray-900 mb-1">
                  {studiedCount}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  Studied
                </div>
              </div>
              
              <div>
                <div className="text-3xl font-medium text-gray-900 mb-1">
                  {dueCount}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  Due
                </div>
              </div>
              <div>
                <div className="text-3xl font-medium text-gray-900 mb-1">
                  {total}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  Total
                </div>
              </div>
            </div>

            {/* Quiz Stats */}
            <div className="space-y-6 p-3 bg-blue-50 rounded-xl">
              <div>
                <div className="text-3xl font-medium text-gray-900 mb-1">
                  {averageQuizScore.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  Quiz Avg Score
                </div>
              </div>
              
              <div>
                <div className="text-3xl font-medium text-gray-900 mb-1">
                  {totalQuizCount}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  Quizzes
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ isOpen, onClose, onRename, onEditDetails, onDelete }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-black space-y-4 max-w-sm w-full">
            <h2 className="text-xl font-bold">Deck Settings</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={onRename}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Rename Deck
              </button>
              <button
                onClick={onEditDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Deck Details
              </button>
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Deck
              </button>
            </div>
            <button
              onClick={() => onClose(false)}
              className="mt-4 w-full bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
  );
}