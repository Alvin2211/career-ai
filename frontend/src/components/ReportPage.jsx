import React from "react";

function ScoreRing({ score }) {
  const color = score >= 8 ? "#4ade80" : score >= 6 ? "#facc15" : "#f87171";
  const circumference = 2 * Math.PI * 36;
  const filled = (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="80" height="80" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="36" fill="none" stroke="#27272a" strokeWidth="8" />
        <circle cx="48" cy="48" r="36" fill="none" stroke={color} strokeWidth="8" 
          strokeDasharray={`${filled} ${circumference}`} strokeLinecap="round" transform="rotate(-90 48 48)" />
        <text x="48" y="54" textAnchor="middle" fill={color} fontSize="18" fontWeight="700">{score}</text>
      </svg>
    </div>
  );
}

export default function ReportPage({ report, onRestart }) {
  return (
    <div className="max-w-4xl w-full mx-auto pb-20">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-6 flex items-center gap-8">
        <ScoreRing score={report.overallScore} />
        <div>
          <h2 className="text-2xl font-bold text-white">Interview Analysis</h2>
          <p className="text-zinc-400 mt-1">{report.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900/50 border border-green-500/20 p-6 rounded-2xl">
          <h3 className="text-green-400 text-sm font-bold uppercase mb-4">Strengths</h3>
          <ul className="list-disc list-inside text-zinc-300 space-y-2 text-sm">
            {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div className="bg-zinc-900/50 border border-red-500/20 p-6 rounded-2xl">
          <h3 className="text-red-400 text-sm font-bold uppercase mb-4">Weaknesses</h3>
          <ul className="list-disc list-inside text-zinc-300 space-y-2 text-sm">
            {report.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        {report.evaluations.map((ev, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <p className="text-white font-medium pr-4">{ev.question}</p>
              <span className="text-violet-400 font-bold">{ev.score}/10</span>
            </div>
            <p className="text-zinc-500 text-sm italic">"{ev.feedback}"</p>
          </div>
        ))}
      </div>

      <button onClick={onRestart} className="mt-10 w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition">
        Take Another Mock Interview
      </button>
    </div>
  );
}