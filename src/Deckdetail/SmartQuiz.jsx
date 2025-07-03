
import {
  Brain,
  RotateCcw,
  Plus,
} from "lucide-react";
export default function SmartQuizView({ deck }) {
  const generatePerformance = () => Math.floor(Math.random() * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Quiz</h2>
        <p className="text-gray-600">{deck.description}</p>
      </div>

      {/* Quiz Cards */}
      <div className="space-y-4">
        {deck.cards.map((card, index) => (
          <QuizCard
            key={card.id}
            quiz={{
              id: card.id,
              label: `Q${index + 1}`,
              question: card.question,
              performance: generatePerformance(),
            }}
          />
        ))}
      </div>

      {/* Add Quiz Button */}
      <AddQuizButton />

      {/* Empty State */}
      {deck.cards.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No quiz questions
          </h3>
          <p className="text-gray-500">
            Add some flashcards first to generate quiz questions!
          </p>
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz }) {
  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 60)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getPerformanceIcon = (percentage) => {
    if (percentage >= 80) return "🎯";
    if (percentage >= 60) return "⚡";
    return "📈";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1.5 rounded-full">
              {quiz.label}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full border ${getPerformanceColor(
                quiz.performance
              )}`}
            >
              {getPerformanceIcon(quiz.performance)} {quiz.performance}%
            </span>
          </div>
          <p className="text-gray-900 font-medium text-lg leading-relaxed">
            {quiz.question}
          </p>
        </div>
        <button className="p-3 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors ml-4">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function AddQuizButton() {
  return (
    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-6 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
      <Plus className="w-6 h-6" />
      <span className="text-lg">Add New Quiz Question</span>
    </button>
  );
}