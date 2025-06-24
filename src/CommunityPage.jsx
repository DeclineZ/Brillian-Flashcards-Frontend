import React from "react";
import { Heart, Flame, ThumbsUp } from "lucide-react";

const categories = ["วิทยาศาสตร์", "ภาษาอังกฤษ", "สังคม", "ทั่วไป"];
const topics = {
  "สมุดคำศัพท์ ครูพี่อชิ": { card: 117, image: '/community/4.png', author: "ครูพี่อชิ"},
  "THAI เนื้อเน้นๆ": { card: 170, image: "/community/2.png", author: "PaSit"},
  "สังคม ; เศรษฐศาสตร์ ม.5": { card: 36, image: "/community/8.png", author: "Snowwyprae"},
  "ความหลากหลายทางชีวภาพ": { card: 28, image: "/community/5.png", author: "cholyzm"},
  "ประวัติฯยุคกลาง-ปัจจุบัน​": { card: 65, image: "/community/6.png", author: "SoulfulSmile"},
  "Idioms ที่ออกสอบบ่อย": { card: 46, image: "/community/7.png", author: "สอบติด#dek59"}
};

const LearnTogether = () => {
  return (
    <div className="w-full flex justify-center items-start py-6 px-4 h-full overflow-y-scroll">
      <div className="w-full space-y-6">
        {/* Slide Poster */}
        <div className="h-[200px] w-full rounded-2xl bg-gradient-to-r from-blue-200 to-indigo-300 flex items-center justify-center text-white text-3xl font-bold shadow animated-gradient">
          เรียนรู้ไปด้วยกัน!
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">LearnTogether</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="ค้นหา..."
              className="border border-gray-300 rounded-2xl px-4 py-2 text-sm w-full sm:w-64 text-black"
            />
            <button className="text-blue-600 text-sm">ค้นหา</button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 text-sm">
          {categories.map((cat) => (
            <span
              key={cat}
              className="px-4 py-1 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-100 transition text-black"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Topic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {Object.entries(topics).map(([name, data]) => (
        <div key={name} className="border border-gray-200 rounded-2xl p-5 bg-white hover:shadow-md transition">
          <img src={data.image} alt="" className="h-[100px] w-full object-cover rounded-xl mb-3" />
          <div className="font-semibold mb-1 text-lg text-black">{name}</div>
          <div className="text-xs text-gray-500 mb-2">Cards: {data.card}</div>
          <div className="flex flex-row justify-between">
            <div className="flex items-center text-blue-400 text-xs">
          {data.author}
            </div>
          <div className="flex items-center text-gray-400 text-xs">
                <Heart className="w-4 h-4 mr-1 animate-pulse" fill={"red"} color={"red"}/>
                <Flame className="w-4 h-4 mr-1 animate-wiggle" fill={"orange"} color={"orange"}/>
                <ThumbsUp className="w-4 h-4 mr-1 text-blue-500 fill-blue-500 animate-wiggle"/>
              </div>
              </div>
        </div>
      ))}
        </div>
      </div>
    </div>
  );
};

export default LearnTogether;