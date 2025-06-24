import { useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { Award, BadgePlus, BadgeCheck, Flame } from 'lucide-react';
import profile from './assets/profile.png';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ProfilePage = () => {
  const [user] = useState({
    name: "NSC2025",
    username: "@NSC2025",
    level: 1,
    streak: 1, 
    badges: 9, 
    progress: 76, 
  });

  const learnerType = [80, 20, 20, 20]; 

  const Profile = () => {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 ">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <img
            src={profile} 
            alt="User"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex flex-col w-full">
            <div className="flex flex-row gap-2">
            <h2 className="text-2xl font-bold text-black">{user.name}</h2>
            <Award size={26} color={"#3e9392"}/>
            <BadgePlus size={26} color={"silver"} />
            <BadgeCheck size={26} color={"gold"} />
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Level {user.level}</span>
              </div>
              <div className="flex items-center gap-1">
  <Flame className="streak-icon text-orange-500" size={20}/>
  <span className="text-gray-600">Streak: {user.streak} days</span>
</div>
            </div>
                    {/* Progress Bar */}
        <div className="flex items-center space-x-4">
        <div className="w-full bg-gray-200 h-2 rounded-full">
  <div
    className="level-bar bg-indigo-600 h-2 rounded-full"
    style={{ width: `${user.progress}%` }}
  ></div>
</div>
          <span className="text-gray-600">{user.progress}% Complete</span>
        </div>
          </div>
        </div>


      </div>
    );
  };

  const SpiderWebDiagram = ({ learnerType }) => {
    const data = {
      labels: ["Visual", "Real-World", "Logical", "Verbal"],
      datasets: [
        {
          label: "Learning Style",
          data: learnerType,
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          borderColor: "rgba(0, 123, 255, 1)",
          borderWidth: 2,
        },
      ],

      
    };

    const options = {
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,      
            callback: v => `${v}%`
          },
          pointLabels: {
            font: { size: 14 },
          },
          grid: { color: '#ddd' },
          angleLines: { color: '#ccc' }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${ctx.formattedValue}%`
          }
        }
      },
      maintainAspectRatio: false,  
    };

    return (
      <div className="w-96 h-96">
        <Radar data={data} options={options} />
      </div>
    );
  };

  const Badge = ({ badgeName, progress }) => {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
          <span className="text-xl font-bold">🏅</span>
        </div>
        <p className="text-sm text-center text-black">{badgeName}</p>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-gray-500 text-sm">{progress}% Complete</span>
      </div>
    );
  };

  const BadgeSection = () => {
    return (
      <div className="grid grid-cols-3 gap-6">
        <Badge badgeName="Top Learner" progress={80} />
        <Badge badgeName="Streak Master" progress={60} />
        <Badge badgeName="Quiz Winner" progress={90} />
        <Badge badgeName="Flashcard Pro" progress={70} />
        <Badge badgeName="Discussion Leader" progress={40} />
        <Badge badgeName="Daily Visitor" progress={100} />
        <Badge badgeName="Speed Solver" progress={55} />
        <Badge badgeName="Knowledge Sharer" progress={85} />
        <Badge badgeName="Early Bird" progress={75} />
      </div>
    );
  };

  return (
    <div className="w-full mx-auto px-4 py-8 space-y-8 overflow-auto">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-8 m-5 bg-white border border-gray-200">
      <Profile />
      </div>
      {/* Spider-Web Diagram */}
      <div className="flex w-full">
      <div className="w-[40%] flex justify-center bg-white rounded-lg shadow overflow-hidden p-8 m-5 flex-col items-center border border-gray-200">
      <h2 className="text-2xl font-semibold text-black top relative h-[10%]">Your Learning Style</h2>
      <div className="flex h-[90%] items-center">
        <SpiderWebDiagram learnerType={learnerType} />
        </div>
      </div>

      {/* Badges Section */}
      <div className="flex w-[60%] bg-white rounded-lg shadow overflow-hidden p-8 m-5 flex-col items-center justify-center gap-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-black top-5 h-[10%]">Your Badges</h2>
        <div className="flex w-full h-[90%] justify-center">
        <BadgeSection />
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
