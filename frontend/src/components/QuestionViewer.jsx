import { useState } from "react";
import axios from "axios";

export default function QuestionViewer({ sessionId, questions, onFinish, token }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(""));
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleEvaluate = async () => {
    setSubmitting(true);
    try {
      const payload = questions.map((q, i) => ({
        question: q.question,
        answer: answers[i] || "(no answer provided)",
      }));

      const res = await axios.post(
        `${API_BASE}/finish`,
        { sessionId, answers: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onFinish(res.data.report);
    } catch (err) {
      alert("Evaluation failed: " + err.message);
      setSubmitting(false);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <main className="flex-1 overflow-y-auto px-10 py-10 bg-zinc-950/50 w-full">
      <div className="mb-8">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-zinc-500">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-violet-400 font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        key={currentIndex}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6"
      >
        <p className="text-white text-xl font-medium">
          {questions[currentIndex].question}
        </p>
      </div>

      <textarea
        value={answers[currentIndex]}
        onChange={(e) => {
          const updated = [...answers];
          updated[currentIndex] = e.target.value;
          setAnswers(updated);
        }}
        placeholder="Type your answer..."
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-zinc-200 h-48 outline-none focus:border-violet-500/50 transition-colors resize-none"
      />

      <div className="flex justify-end gap-3 mt-6">
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="px-6 py-2 text-zinc-400 hover:text-white transition"
          >
            Back
          </button>
        )}
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="bg-violet-600 px-8 py-2 rounded-xl font-bold"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleEvaluate}
            disabled={submitting}
            className="bg-violet-600 px-8 py-2 rounded-xl font-bold disabled:opacity-50"
          >
            {submitting ? "Evaluating..." : "Submit Interview"}
          </button>
        )}
      </div>
    </main>
  );
}