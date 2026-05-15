import React from "react";

function Tag({ children }) {
  return (
    <span className="text-[10px] text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
      {children}
    </span>
  );
}

function SidebarCard({ session }) {
  const score = session.report?.overallScore;
  const date = new Date(session.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const scoreColor =
    score >= 8
      ? "text-green-400 bg-green-400/10"
      : score >= 6
      ? "text-yellow-400 bg-yellow-400/10"
      : "text-red-400 bg-red-400/10";

  return (
    <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 mb-2 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <p className="text-zinc-200 text-[13px] font-semibold leading-snug">
          {session.jobRole}
        </p>
        {score !== undefined && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ml-2 shrink-0 ${scoreColor}`}>
            {score}/10
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1 items-center">
        <Tag>{session.difficulty}</Tag>
        <Tag>{session.interviewType}</Tag>
        <span className="text-[10px] text-zinc-600">{date}</span>
      </div>
    </div>
  );
}

export default function Sidebar({ history, loading }) {
  return (
    <aside className="w-65 min-w-65 bg-[#0d0d0d] border-r border-zinc-800 flex flex-col min-h-screen overflow-y-auto">
      <div className="px-5 pt-6 pb-4 border-b border-zinc-800">
        <p className="text-[10px] text-neutral-200 uppercase tracking-widest mb-1">Past Sessions</p>
        <p className="text-neutral-200 text-xs">Your interview history</p>
      </div>
      <div className="flex-1 p-3">
        {loading ? (
          <div className="flex justify-center pt-10">
            <div className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center pt-10">
            <p className="text-zinc-600 text-xs">No past sessions yet</p>
          </div>
        ) : (
          history.map((session) => <SidebarCard key={session._id} session={session} />)
        )}
      </div>
    </aside>
  );
}