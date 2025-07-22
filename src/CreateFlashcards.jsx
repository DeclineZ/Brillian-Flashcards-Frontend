// src/pages/CreateFlashcards.jsx
import { useState, useRef } from "react";
import {
    Upload,
    Sparkles,
    PenLine,
    Settings,
    Plus,
    Trash2,
    ImagePlus,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useDecks } from "./lib/DeckContext.jsx";
import { withTimeout } from "./lib/aiTimeout.js";
import "./mobileLandscape.css";


function ModeButton({ children, icon, active, onClick, ...rest }) {
    return (
        <button
            className={`px-4 py-1 rounded-full flex items-center gap-2 text-sm ${
                active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            onClick={onClick}
            {...rest}
        >
            {icon}
            {children}
        </button>
    );
}

export default function CreateFlashcards() {
    const isCapacitor = window?.Capacitor?.isNativePlatform();
const BASE = isCapacitor
  ? 'https://brillian-flashcard-backend.onrender.com' // Replace with your dev machine IP address accessible to your device/emulator
  : import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const { setDecks, learningPrefs } = useDecks();
    const [loading, setLoading] = useState(false);

    const [mode, setMode] = useState("ai");
    const [files, setFiles] = useState([]);
    const inputRef = useRef();

    const handleFiles = (fileList) => {
        const accepted = [...fileList].filter(
            (file) => file.type === "application/pdf"
        );
        if (accepted.length) setFiles(accepted.slice(0, 1));
    };

    const onDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const [activeTab, setActiveTab] = useState("summary");
    const [summary, setSummary] = useState("");
    const blankQuiz = { question: "", answer: "", key_points: [] };
    const [quizzes, setQuizzes] = useState([{ ...blankQuiz }]);

    const updateQuiz = (idx, field, value) =>
        setQuizzes((qs) =>
            qs.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
        );

    const addQuiz = () => setQuizzes((qs) => [...qs, { ...blankQuiz }]);
    const removeQuiz = (idx) =>
        setQuizzes((qs) => qs.filter((_, i) => i !== idx));

    const generateFromPdf = async () => {
        if (!files.length) return alert("Please choose a PDF first");
        setLoading(true);
        const formData = new FormData();
        formData.append("pdf", files[0]);
        formData.append("learningPrefs", JSON.stringify(learningPrefs));

        try {
            const { data: newDeck } = await withTimeout(
                axios.post(`${BASE}/api/generate-deck`, formData),
                1200_000,
                {
                    id: "21567b3b-3ba0-40da-aab2-b5ecd600ef28",
                    name: "🪨 หินแสนสนุก (mockup)",
                    description:
                        "ชุดการ์ดสนุก ๆ เพื่อเรียนรู้เกี่ยวกับการเกิดของหิน",
                    studied: false,
                    total: 8,
                    learned: 0,
                    due: 8,
                    cards: [
                        {
                            repetition: 0,
                            interval: 0,
                            efactor: 2.5,
                            nextReview: 1752318941682,
                            id: "55168de4-774a-4105-8923-cab96505eef2",
                            question: "หินเกิดขึ้นได้อย่างไร?",
                            answer: "หินเกิดจากการหลอมรวมกันของแร่ธาตุตามธรรมชาติในช่วงเวลานาน ๆ",
                            keyword: "rock formation",
                            needs_image: true,
                            image: "https://cdn.britannica.com/08/172108-050-30D174DE/Dabous-giraffes-petroglyph-Neolithic-Niger.jpg?w=400&h=225&c=crop",
                            taxonomy: "Understanding",
                            point: 0,
                            repetitions: 0,
                            ef: 2.5,
                            due: "2025-07-12",
                        },
                        {
                            repetition: 0,
                            interval: 0,
                            efactor: 2.5,
                            nextReview: 1752318941682,
                            id: "a5cbf305-901c-43dd-be60-9fc4a2e462f5",
                            question: "หินเกิดจากแรงใด?",
                            answer: "หินเกิดจากการที่แรงธรรมชาติและกระบวนการทางธรณีวิทยาทำให้เกิดการสะสมและเปลี่ยนแปลงแร่ธาตุ",
                            keyword: "geological forces",
                            needs_image: true,
                            image: "https://img.freepik.com/premium-photo/large-crack-ground-splitting-earth-open-with-jagged-lines-showing-powerful-geological-forces-work_721969-27523.jpg?w=360",
                            taxonomy: "Understanding",
                            point: 0,
                            repetitions: 0,
                            ef: 2.5,
                            due: "2025-07-12",
                        },
                        {
                            repetition: 0,
                            interval: 0,
                            efactor: 2.5,
                            nextReview: 1752318941682,
                            id: "aae485bd-e7e2-4ded-b790-ef5c2f626066",
                            question:
                                "ชื่อหินชนิดหนึ่งที่เกิดจากการเย็นตัวของหินเหลวคืออะไร?",
                            answer: "หินอิฐ",
                            keyword: "igneous rock",
                            needs_image: true,
                            image: "https://www.nps.gov/subjects/geology/images/48674276863_1cdbc3f9e4_o-John-St-James-basalt-web300.jpg",
                            taxonomy: "Remembering",
                            point: 0,
                            repetitions: 0,
                            ef: 2.5,
                            due: "2025-07-12",
                        },
                        {
                            repetition: 0,
                            interval: 0,
                            efactor: 2.5,
                            nextReview: 1752318941682,
                            id: "9effe5ab-f119-4fff-89c1-b69eda602344",
                            question:
                                "ถ้าคุณพบหินที่มีรอยของพืชหรือสัตว์ หินนั้นอาจเป็นหินชนิดใด?",
                            answer: "หินตะกอน เพราะเกิดจากการสะสมของตะกอนและเศษวัตถุที่มีสิ่งมีชีวิต",
                            keyword: "sedimentary rock",
                            needs_image: true,
                            image: "https://geology.ecu.edu/geol1501/wp-content/pv-uploads/sites/351/2020/07/rock-gypsum.gif",
                            taxonomy: "Applying",
                            point: 0,
                            repetitions: 0,
                            ef: 2.5,
                            due: "2025-07-12",
                        },
                        {
                            repetition: 0,
                            interval: 0,
                            efactor: 2.5,
                            nextReview: 1752318941682,
                            id: "877e0afc-fa16-4760-bcb9-8684d67bc8b6",
                            question:
                                "หินชนิดใดที่เกิดจากการเปลี่ยนแปลงของหินเดิมภายใต้แรงความร้อนและแรงดัน?",
                            answer: "หินแปร",
                            keyword: "metamorphic rock",
                            needs_image: true,
                            image: "https://www.geolsoc.org.uk/ks3/webdav/site/GSL/shared/images/education_and_careers/RockCycle/gneiss.jpg",
                            taxonomy: "Understanding",
                            point: 0,
                            repetitions: 0,
                            ef: 2.5,
                            due: "2025-07-12",
                        },
                        {
                            repetition: 0,
                            interval: 0,
                            efactor: 2.5,
                            nextReview: 1752318941682,
                            id: "5ffd2fde-7006-46f1-9705-82d5f1b56400",
                            question: "อธิบายวิธีการเกิดของหินอิฐ?",
                            answer: "หินอิฐเกิดจากการเย็นตัวของลาวาหรือหินเหลวที่เย็นลงจนแข็งตัวเป็นหิน",
                            keyword: "magma cooling",
                            needs_image: true,
                            image: "https://www.geolsoc.org.uk/ks3/webdav/site/GSL/shared/images/education_and_careers/RockCycle/Processes/Crystallisation/basalt%20lava.jpg",
                            taxonomy: "Understanding",
                            point: 0,
                            repetitions: 0,
                            ef: 2.5,
                            due: "2025-07-12",
                        },
                        {
                            repetition: 0,
                            interval: 0,
                            efactor: 2.5,
                            nextReview: 1752318941682,
                            id: "7cfe441a-85ec-434a-98a6-a02437a1442a",
                            question: "ทำไมหินจึงมีลักษณะแตกต่างกัน?",
                            answer: "เพราะกระบวนการที่ทำให้หินเกิดขึ้นต่างกัน เช่น แรงความร้อน แรงดัน และการสะสมของตะกอน",
                            keyword: "",
                            needs_image: false,
                            image: null,
                            taxonomy: "Understanding",
                            point: 0,
                            repetitions: 0,
                            ef: 2.5,
                            due: "2025-07-12",
                        },
                        {
                            repetition: 0,
                            interval: 0,
                            efactor: 2.5,
                            nextReview: 1752318941682,
                            id: "d505180a-1f81-4b39-996f-9e46198cf526",
                            question: "ให้ตัวอย่างสถานที่ที่เราอาจพบหินอิฐ?",
                            answer: "ภูเขาไฟหรือที่ที่เคยเกิดการระเบิดของภูเขาไฟ",
                            keyword: "volcano",
                            needs_image: true,
                            image: "http://ssc.ca.gov/wp-content/uploads/sites/9/2020/08/volcano_sthelen.jpg",
                            taxonomy: "Applying",
                            point: 0,
                            repetitions: 0,
                            ef: 2.5,
                            due: "2025-07-12",
                        },
                    ],
                    summaryHtml:
                        '<h1 class="main-title">หินแสนสนุก</h1>\n<h2 class="section-heading">ประเภทของหิน</h2>\n<ul class="key-points">\n <li class="list-item">หินอัคนี</li>\n <li class="list-item">หินแปร</li>\n <li class="list-item">หินชั้นหรือหินตะกอน</li>\n</ul>\n<h2 class="section-heading">หินอัคนี</h2>\n<p>เกิดจากการเย็นตัวลงและแข็งตัวของหินหลอมเหลวที่พุ่งออกมาจากเปลือกโลก แบ่งเป็น 2 ชนิด คือ หินอัคนีพุ และหินอัคนีแทรกซ้อน</p>\n<ul class="key-points">\n <li class="list-item">เกิดจากภายนอกเปลือกโลก: ลาวา แข็งตัวกลายเป็นหินอัคนีพุ</li>\n <li class="list-item">เกิดจากภายใต้เปลือกโลก: แมกม่า แข็งตัวกลายเป็นหินอัคนีแทรกซ้อน</li>\n</ul>\n<p>ตัวอย่างหินอัคนีพุ: <strong class="important-term">หินบะซอลต์</strong>, <strong class="important-term">หินไรโอไลต์</strong>, <strong class="important-term">หินแอนดีไซต์</strong></p>\n<p>ตัวอย่างหินอัคนีแทรกซ้อน: <strong class="important-term">หินแกรนิต</strong>, <strong class="important-term">หินไดออไรต์</strong>, <strong class="important-term">หินแกบโบร</strong></p>\n<h2 class="section-heading">หินชั้นหรือหินตะกอน</h2>\n<p>เกิดจากการทับถมของตะกอน เศษหิน แร่ ดิน กรวด หรือทรายเป็นเวลานานหลักล้านปี โดยตะกอนต่างๆถูกพัดพาโดยธารน้ำ ลม และคลื่นทะเล</p>\n<ul class="key-points">\n <li class="list-item">หินเนื้อประสาน: เนื้อภายในละเอียดมาก จําแนกองค์ประกอบไม่ได้</li>\n <li class="list-item">หินเนื้อประสม: เนื้อภายในละเอียดไม่มาก จําแนกองค์ประกอบได้</li>\n</ul>\n<p>ตัวอย่างหินตะกอน: <strong class="important-term">หินปูน</strong>, <strong class="important-term">ถ่านหิน</strong>, <strong class="important-term">หินดินดาน</strong>, <strong class="important-term">หินกรวดมน</strong></p>\n<h2 class="section-heading">หินแปร</h2>\n<p>เกิดจากการแปรสภาพ มีผลมาจากความร้อน ความดัน และปฏิกิริยาเคมี ซึ่งจะส่งผลให้โครงสร้างของหินแปรสภาพ</p>\n<ul class="key-points">\n <li class="list-item">การแปรสภาพบริเวณไพศาล: เกิดจากความร้อนและความดันที่สูงมาก ทําให้เกิดแร่และผลึกใหม่</li>\n <li class="list-item">การแปรสภาพสัมผัส: เกิดจากความร้อนและปฏิกิริยาที่ไม่มาก เกิดแร่ใหม่แค่บางส่วน</li>\n</ul>\n<p>ตัวอย่างหินแปร: <strong class="important-term">หินไนส์</strong>, <strong class="important-term">หินชนวน</strong>, <strong class="important-term">หินอ่อน</strong></p>\n<div class="mermaid">\ngraph LR\nA["หิน"] --> B["หินเกิดจากการรวมกันและแข็งตัวของแร่ต่างๆ"]\nA --> C["แบ่งออกเป็น 3 ประเภท"]\nC --> D["1. หินอัคนี"]\nC --> E["2. หินแปร"]\nC --> F["3. หินชั้นหรือหินตะกอน"]\n\nD --> G["เกิดจากการเย็นตัวลงและแข็งตัวของหินหลอมเหลว"]\nD --> H["แบ่งออกเป็น 2 ชนิด"]\nH --> I["หินอัคนีพุ - เกิดจากลาวา"]\nH --> J["หินอัคนีแทรกซ้อน - เกิดจากแมกม่า"]\nI --> K["ตัวอย่าง: หินบะซอลต์, หินไรโอไลต์, หินแอนดีไซต์"]\nJ --> L["ตัวอย่าง: หินแกรนิต, หินไดออไรต์, หินแกบโบร"]\n\nF --> M["เกิดจากการทับถมของตะกอน เศษหิน แร่ ดิน กรวด หรือทราย"]\nF --> N["แบ่งออกเป็น 2 ชนิด"]\nN --> O["หินเนื้อประสาน - เนื้อละเอียดมาก"]\nN --> P["หินเนื้อประสม - เนื้อละเอียดไม่มาก"]\nO --> Q["ตัวอย่าง: หินปูน, ถ่านหิน"]\nP --> R["ตัวอย่าง: หินดินดาน, หินกรวดมน"]\n\nE --> S["เกิดจากการแปรสภาพจากความร้อน ความดัน และปฏิกิริยาเคมี"]\nE --> T["แบ่งออกเป็น 2 ชนิด"]\nT --> U["การแปรสภาพบริเวณไพศาล - ความร้อนและความดันสูง"]\nT --> V["การแปรสภาพสัมผัส - ความร้อนและปฏิกิริยาไม่มาก"]\nU --> W["ตัวอย่าง: หินไนส์, หินชนวน"]\nV --> X["ตัวอย่าง: หินอ่อน"]\n</div>',
                    quiz: [
                        {
                            question:
                                "หินเกิดขึ้นได้อย่างไร และกระบวนการนี้เกี่ยวข้องกับอะไรบ้าง?",
                            answer: "หินเกิดจากการสะสมและการเปลี่ยนแปลงของแร่ธาตุหรือสารอินทรีย์ในธรรมชาติ กระบวนการนี้เกี่ยวข้องกับสภาพแวดล้อม เช่น อุณหภูมิ ความดัน และการกัดกร่อนจากน้ำหรือลม ซึ่งเป็นส่วนหนึ่งของวงจรหินในโลก",
                            key_points: [
                                "การสะสมแร่ธาตุ",
                                "กระบวนการเปลี่ยนแปลง",
                                "สภาพแวดล้อม",
                                "วงจรหิน",
                            ],
                        },
                        {
                            question:
                                "อะไรคือปัจจัยหลักที่ส่งผลต่อการเกิดหินในธรรมชาติ?",
                            answer: "ปัจจัยหลักที่ส่งผลต่อการเกิดหินในธรรมชาติคืออุณหภูมิ ความดัน และการกัดกร่อนจากน้ำหรือลม ซึ่งทั้งหมดนี้มีบทบาทในการเปลี่ยนแปลงแร่ธาตุและสารอินทรีย์ให้กลายเป็นหิน",
                            key_points: [
                                "อุณหภูมิ",
                                "ความดัน",
                                "การกัดกร่อน",
                                "การเปลี่ยนแปลงแร่ธาตุ",
                            ],
                        },
                    ],
                    viewMode: "cards",
                }
            );
            const sm2Defaults = {
                repetition: 0,
                interval: 0,
                efactor: 2.5,
                nextReview: Date.now(),
            };
            const deckWithSm2 = {
                ...newDeck,
                cards: newDeck.cards.map((c) => ({ ...sm2Defaults, ...c })),
            };
            setDecks((prev) => [...prev, deckWithSm2]);
            navigate(`/deck/${newDeck.id}`);
        } catch (err) {
            console.error(err);
            alert('Error: File too big. Please upload a smaller PDF.');
        } finally {
            setLoading(false);
        }
    };

    const [deckName, setDeckName] = useState("");
    const [deckDescription, setDeckDescription] = useState("");
    const blankCard = {
        question: "",
        answer: "",
        keyword: "",
        needs_image: false,
        image: "",
        taxonomy: "Manual",
    };
    const [cards, setCards] = useState([{ ...blankCard }]);

    const updateCard = (idx, field, value) => {
        setCards((prev) =>
            prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
        );
    };

    const removeCard = (idx) =>
        setCards((prev) => prev.filter((_, i) => i !== idx));

    const addCard = () => setCards((prev) => [...prev, { ...blankCard }]);

    const handleImage = (idx, file) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setCards((prev) =>
            prev.map((c, i) =>
                i === idx ? { ...c, image: url, needs_image: true } : c
            )
        );
    };

    const saveManualDeck = () => {
        if (!deckName.trim()) {
            alert("Deck name required");
            return;
        }

        const summaryOk = summary.trim() !== "";

        const cardsOk =
            cards.length > 0 &&
            cards.every((c) => c.question.trim() && c.answer.trim());

        const quizOk =
            quizzes.length > 0 &&
            quizzes.every((q) => q.question.trim() && q.answer.trim());

        if (!summaryOk && !cardsOk && !quizOk) {
            alert("Please add a summary, some flashcards, or quiz questions.");
            return;
        }

        if (!cardsOk && cards.length) {
            alert("Fill in all flashcards or remove the incomplete ones.");
            return;
        }

        if (!quizOk && quizzes.length) {
            alert("Fill in all quiz questions or remove the incomplete ones.");
            return;
        }

        const transformedCards = cardsOk
            ? cards.map((c) => {
                  const hasImg = !!c.image;
                  return {
                      id: uuid(),
                      question: c.question.trim(),
                      answer: c.answer.trim(),
                      keyword: c.keyword,
                      needs_image: hasImg,
                      image: hasImg ? c.image : "",
                      taxonomy: c.taxonomy || "Manual",
                      repetition: 0,
                      interval: 0,
                      efactor: 2.5,
                      nextReview: Date.now(),
                  };
              })
            : [];

        const transformedQuiz = quizOk
            ? quizzes.map((q) => ({
                  question: q.question.trim(),
                  answer: q.answer.trim(),
                  key_points: q.key_points?.length ? q.key_points : [],
              }))
            : [];

        const emojis = [
            "📚",
            "🧠",
            "🎯",
            "⚡",
            "🚀",
            "🌟",
            "🔑",
            "💡",
            "📝",
            "🧩",
        ];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        const newDeck = {
            id: uuid(),
            name: `${emoji} ${deckName.trim()}`,
            description: deckDescription.trim(),
            studied: false,
            total: transformedCards.length,
            learned: 0,
            due: transformedCards.length,
            summaryHtml: summary.trim().replace(/\n/g, "<br/>"),
            cards: transformedCards,
            quiz: transformedQuiz,
        };

        setDecks((prev) => [...prev, newDeck]);
        navigate(`/deck/${newDeck.id}`);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 p-6 bg-white rounded shadow">
                    <div className="w-16 h-16 border-t-4 border-blue-600 rounded-full animate-spin"></div>
                    <p className="text-lg text-black">
                        Generating study deck, please wait...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6 bg-gray-50 min-h-full w-full create-flashcards-container">
            <h1 className="text-3xl font-bold text-black">
                Create Study Decks
            </h1>

            {/* mode toggle */}
            <div className="flex gap-2">
                <ModeButton
                    icon={<Sparkles size={20} />}
                    active={mode === "ai"}
                    onClick={() => setMode("ai")}
                >
                    AI
                </ModeButton>
                <ModeButton
                    icon={<PenLine size={20} />}
                    active={mode === "manual"}
                    onClick={() => setMode("manual")}
                >
                    Manual
                </ModeButton>
                <ModeButton icon={<Settings size={20} />} disabled></ModeButton>
            </div>

            {mode === "ai" && (
                <>
                    {/* upload box */}
                    <div
                        className="border-2 border-dashed border-gray-400/70 rounded-lg h-56 flex flex-col gap-2 items-center justify-center text-gray-500 cursor-pointer"
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop}
                    >
                        {files.length === 0 ? (
                            <>
                                <Upload size={32} />
                                <p>
                                    Drag & drop a PDF, text or images here, or{" "}
                                    <span className="underline">browse</span>
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="font-medium">{files[0].name}</p>
                                <p className="text-sm text-gray-400">
                                    Ready to upload
                                </p>
                            </>
                        )}
                        <input
                            type="file"
                            accept="application/pdf"
                            hidden
                            ref={inputRef}
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                    </div>

                    <button
                        onClick={generateFromPdf}
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
                        disabled={files.length === 0}
                    >
                        Generate
                    </button>
                </>
            )}

            {mode === "manual" && (
                <div className="space-y-6">
                    {/* Deck meta */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Deck name
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded text-black"
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                        />
                        <label className="block text-sm font-medium text-gray-700">
                            Description (optional)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border rounded text-black"
                            value={deckDescription}
                            rows={1}
                            onChange={(e) => setDeckDescription(e.target.value)}
                        />
                    </div>

                    <nav className="flex gap-4 text-sm font-medium border-b mb-2">
                        {["summary", "cards", "quiz"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`
            pb-2
            ${
                activeTab === t
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
            }
          `}
                            >
                                {t === "summary"
                                    ? "Summary"
                                    : t === "cards"
                                    ? "Flashcards"
                                    : "Quiz"}
                            </button>
                        ))}
                    </nav>

                    {activeTab === "summary" && (
                        <textarea
                            rows={6}
                            placeholder="Write a concise summary here…"
                            className="w-full px-3 py-2 border rounded text-black"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                    )}

                    {activeTab === "cards" && (
                        <>
                            <div className="space-y-4 max-h-65 overflow-auto pr-2">
                                {cards.map((card, idx) => (
                                    <div
                                        key={idx}
                                        className="relative space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="text-sm font-medium text-gray-500 mb-1">
                                            Card {idx + 1}
                                        </div>
                                        <button
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            onClick={() => removeCard(idx)}
                                            title="Delete card"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Question
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2 border rounded text-black"
                                            rows={1}
                                            value={card.question}
                                            onChange={(e) =>
                                                updateCard(
                                                    idx,
                                                    "question",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <label className="block text-sm font-medium text-gray-700">
                                            Answer
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2 border rounded text-black"
                                            rows={1}
                                            value={card.answer}
                                            onChange={(e) =>
                                                updateCard(
                                                    idx,
                                                    "answer",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Image (optional)
                                            </label>

                                            <label
                                                htmlFor={`img-${idx}`}
                                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 cursor-pointer"
                                            >
                                                <ImagePlus size={16} />
                                                {card.image
                                                    ? "Change image"
                                                    : "Add image"}
                                            </label>

                                            <input
                                                id={`img-${idx}`}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) =>
                                                    handleImage(
                                                        idx,
                                                        e.target.files[0]
                                                    )
                                                }
                                            />

                                            {card.image && (
                                                <img
                                                    src={card.image}
                                                    alt=""
                                                    className="mt-2 h-32 w-full rounded object-contain border"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={addCard}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-gray-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                                >
                                    <Plus size={18} />
                                    Add card
                                </button>
                            </div>
                        </>
                    )}

                    {activeTab === "quiz" && (
                        <div className="space-y-4 max-h-65 overflow-auto pr-2">
                            {quizzes.map((q, idx) => (
                                <div
                                    key={idx}
                                    className="relative space-y-3 rounded-xl border bg-white p-5 shadow-sm"
                                >
                                    <div className="text-sm font-medium text-gray-500 mb-1">
                                        Question {idx + 1}
                                    </div>
                                    <button
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        onClick={() => removeQuiz(idx)}
                                        title="Delete question"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <label className="block text-sm font-medium text-gray-700">
                                        Question
                                    </label>
                                    <textarea
                                        rows={1}
                                        className="w-full px-3 py-2 border rounded text-black"
                                        value={q.question}
                                        onChange={(e) =>
                                            updateQuiz(
                                                idx,
                                                "question",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ideal answer
                                    </label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-3 py-2 border rounded text-black"
                                        value={q.answer}
                                        onChange={(e) =>
                                            updateQuiz(
                                                idx,
                                                "answer",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            ))}

                            <button
                                onClick={addQuiz}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed
                     border-gray-300 py-3 text-gray-600 transition hover:border-blue-500
                     hover:bg-blue-50 hover:text-blue-600"
                            >
                                <Plus size={18} /> Add question
                            </button>
                        </div>
                    )}

                    <button
                        onClick={saveManualDeck}
                        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700
                 disabled:opacity-50"
                        disabled={
                            !deckName.trim() ||
                            (summary.trim() === "" &&
                                cards.length === 0 &&
                                quizzes.length === 0)
                        }
                    >
                        Save deck
                    </button>
                </div>
            )}
        </div>
    );
}
