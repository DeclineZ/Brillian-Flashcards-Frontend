import { useState,useRef,useEffect } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Award, BadgePlus, BadgeCheck, Flame, Clock } from 'lucide-react';
import profile from './assets/profile.png';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const learningStats = [
  { label: 'Total Flash Card', value: '1245', bg: 'bg-gray-50', text: 'gray-600' },
  { label: 'Learned Flashcard', value: '40', bg: 'bg-blue-50', text: 'blue-600' },
  { label: 'Quiz Passed', value: '79', bg: 'bg-green-50', text: 'green-600' },
  { label: 'Study Time', value: '16h', bg: 'bg-indigo-50', text: 'indigo-600' },
  { label: 'Streak Days', value: '7', bg: 'bg-orange-50', text: 'orange-600' }
];

const learningStylesRaw = [
  { color: "bg-red-500", label: "Visual", value: 100 },
  { color: "bg-blue-500", label: "Verbal", value: 300},
  { color: "bg-yellow-500", label: "Logical", value:100 },
  { color: "bg-green-500", label: "RealWorld", value: 110 },
];

const ProfilePage = () => {
  // User and ranking data
  const [user] = useState({
    name: "NSC2025",
    username: "@NSC2025",
    level: 12,
    streak: 7,
    progress: 76,
  });
  

  const LearningStyleBar = () => {
  const MIN_LABEL_WIDTH = 19; // Minimum width % to show label
  const barRef = useRef(null);

  // Normalize to make total 100%
  const total = learningStylesRaw.reduce((acc, s) => acc + s.value, 0);
  const learningStyles = learningStylesRaw.map((s) => ({
    ...s,
    normalizedValue: (s.value / total) * 100,
  }));

  return (
    <div>
      {/* Bar */}
      <div
        ref={barRef}
        className="flex w-full h-8 rounded-full overflow-hidden bg-gray-200 relative"
      >
        {learningStyles.map((style, index) => (
          <div
            key={index}
            className={`${style.color} h-full relative text-white text-x flex items-center justify-center`}
            style={{ width: `${style.normalizedValue}%` }}
          >
            {style.normalizedValue >= MIN_LABEL_WIDTH && <span>{style.label}</span>}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex text-gray-800 flex-wrap mt-2 space-x-4">
        {learningStyles.map((style, index) =>
          style.normalizedValue < MIN_LABEL_WIDTH && (
            <div key={index} className="flex items-center space-x-2">
              <span className={`w-4 h-4 rounded ${style.color}`}></span>
              <span className="text-sm">{style.label}</span>
            </div>
          )
        )}
      </div>

    </div>
  );
};


  const LearningStats = () => {
    return (
      
        <div className="grid grid-cols-2 gap-4">
          {learningStats.map((stat, i) => (
            <div
              key={i}
              className={`text-center p-4 rounded-xl ${stat.bg}`}
            >
              <div className={`text-2xl font-bold text-${stat.text}`}>{stat.value}</div>
              <div className={`text-sm text-${stat.text}`}>{stat.label}</div>
            </div>
          ))}
        </div>
    );
  };

  // Badge component
  const Badge = ({ badgeName, progress }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
        <span className="text-xl">🏅</span>
      </div>
      <p className="text-sm text-center text-gray-800">{badgeName}</p>
      <div className="w-full bg-gray-200 h-1 rounded-full mt-1">
        <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );

  const BadgeSection = () => (
    <div className="grid grid-cols-3 gap-4 w-full">
      <Badge badgeName="Top Learner" progress={80} />
      <Badge badgeName="Streak Master" progress={60} />
      <Badge badgeName="Quiz Winner" progress={90} />
      <Badge badgeName="Flashcard Pro" progress={70} />
      <Badge badgeName="Discussion Leader" progress={40} />
      <Badge badgeName="Daily Visitor" progress={100} />
      <Badge badgeName="Speed Solver" progress={55} />
      <Badge badgeName="Knowledge Sharer" progress={85} />
      <Badge badgeName="Early Bird" progress={75} />
      <Badge badgeName="Early Bird" progress={75} />
      <Badge badgeName="Early Bird" progress={75} />
      <Badge badgeName="Early Bird" progress={75} />
    </div>
  );

  return (
   <div className="h-screen w-full max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 flex flex-col bg-gray-50">
  {/* Profile Header */}
  <div className="flex-none flex items-center bg-white p-6 rounded-lg shadow">
    <img src={profile} alt="User" className="w-20 h-20 rounded-full object-cover" />
    <div className="ml-6 flex-1">
      <div className="flex items-center space-x-2">
        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
        <Award size={24} className="text-indigo-600" />
        <BadgePlus size={24} className="text-gray-400" />
        <BadgeCheck size={24} className="text-yellow-500" />
      </div>
      <div className="flex items-center space-x-4 mt-2">
        <span className="text-gray-600">Level {user.level}</span>
        <div className="flex items-center text-gray-600">
          <Flame size={20} className="text-red-500 mr-1" />
          Streak: {user.streak} days
        </div>
      </div>
    </div>
    <div className="w-1/4">
      <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
        <div className="bg-indigo-600 h-2" style={{ width: `${user.progress}%` }} />
      </div>
      <p className="text-right text-gray-600 mt-1">{user.progress}% Complete</p>
    </div>
  </div>

  {/* Main Grid */}
  <div className="flex-1 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
    {/* Learning Dashboard */}
    <div className="bg-white text-gray-900 rounded-lg p-6 shadow overflow-auto">
      <h3 className="text-2xl font-semibold mb-4">Learning Dashboard</h3>
      <LearningStats />
    </div>

    {/* Right Column */}
    <div className="flex flex-col gap-4 min-h-0">
      {/* Learning Style */}
      <div className="bg-white rounded-lg shadow p-6 h-[150px]">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Learning Style</h2>
        <LearningStyleBar />
      </div>

      {/* Badges Section - scrollable */}
      <div className="flex-1 bg-white rounded-lg shadow p-0 overflow-hidden min-h-0">
        {/* Sticky Header */}
        <div className="p-6 border-b sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-2xl font-semibold text-gray-900">Badges</h2>
        </div>

        {/* Scrollable BadgeSection */}
        <div className="overflow-auto p-6 space-y-4 h-full">
          <BadgeSection />
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default ProfilePage;
