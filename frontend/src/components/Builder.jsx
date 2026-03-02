import { useState } from "react";
import { LoaderOne } from "@/components/ui/loader";
const STEPS = ["Personal", "Experience", "Education", "Projects", "Skills"];

const defaultExperience = () => ({
  id: Date.now(),
  company: "", role: "", startDate: "", endDate: "", location: "", bullets: [""],
});
const defaultEducation = () => ({
  id: Date.now(),
  school: "", degree: "", startDate: "", endDate: "", location: "", coursework: "", research: "",
});
const defaultProject = () => ({
  id: Date.now(),
  name: "", startDate: "", endDate: "", bullets: [""],
});

const initialData = {
  name: "", phone: "", email: "", linkedin: "", location: "",
  experience: [defaultExperience()],
  education: [defaultEducation()],
  projects: [defaultProject()],
  languages: "", tools: "",
};

export default function Builder() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResult, setIsResult] = useState(null);

  const set = (field, value) => setData(d => ({ ...d, [field]: value }));

  const updateListItem = (listKey, id, field, value) => {
    setData(d => ({
      ...d,
      [listKey]: d[listKey].map(item => item.id === id ? { ...item, [field]: value } : item),
    }));
  };

  const updateBullet = (listKey, id, idx, value) => {
    setData(d => ({
      ...d,
      [listKey]: d[listKey].map(item =>
        item.id === id
          ? { ...item, bullets: item.bullets.map((b, i) => i === idx ? value : b) }
          : item
      ),
    }));
  };

  const addBullet = (listKey, id) => {
    setData(d => ({
      ...d,
      [listKey]: d[listKey].map(item =>
        item.id === id ? { ...item, bullets: [...item.bullets, ""] } : item
      ),
    }));
  };

  const removeBullet = (listKey, id, idx) => {
    setData(d => ({
      ...d,
      [listKey]: d[listKey].map(item =>
        item.id === id ? { ...item, bullets: item.bullets.filter((_, i) => i !== idx) } : item
      ),
    }));
  };

  const addItem = (listKey, factory) => setData(d => ({ ...d, [listKey]: [...d[listKey], factory()] }));
  const removeItem = (listKey, id) => setData(d => ({ ...d, [listKey]: d[listKey].filter(i => i.id !== id) }));

  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const progress = (step / (STEPS.length - 1)) * 100;

  const handleSubmitClick = async () => {
    try {
      setLoading(true);
      console.log("Submitting data:", data);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generateresume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsResult(true);
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        alert("Failed to generate resume PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();

    } catch (error) {

    }
  };
  return (
    <section className="min-h-screen bg-[#0e0f11] text-[#f0ede8] pb-20">
      {!isResult && (
        <div className="relative max-w-4xl mx-auto px-6 pt-12 z-10">

          <div className="text-center px-6 pt-12 pb-6 border-b border-[#2a2d34]">
            <div className="inline-flex items-center gap-2.5 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7c7cff] block" />
              <span className="text-xl font-bold tracking-wider">ResumeForge</span>
            </div>
            <p className="text-[#7a7f8e] text-sm">Build your perfect resume in minutes</p>
          </div>

          <div className="relative flex justify-center flex-wrap max-w-2xl mx-auto px-6 pt-8">
            <div className="absolute bottom-3 left-[10%] right-[10%] h-0.5 bg-[#2a2d34] rounded z-0">
              <div
                className="h-full bg-[#7c7cff] rounded transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i)}
                className={`relative z-10 flex flex-col items-center gap-1.5 px-5 pb-6 bg-transparent border-none cursor-pointer transition-colors duration-200
              ${i === step ? "text-[#7c7cff]" : i < step ? "text-[#f0ede8]" : "text-[#7a7f8e]"}`}
              >
                <span className="w-7 h-7 rounded-full bg-[#16181c] border-2 border-current flex items-center justify-center text-xs font-bold">
                  {i < step ? "✓" : i + 1}
                </span>
                <span className="text-[11px] tracking-widest uppercase font-semibold">{s}</span>
              </button>
            ))}
          </div>

          <div className="max-w-2xl mx-auto mt-8 bg-[#16181c] border border-[#2a2d34] rounded-2xl px-12 py-10">

            {step === 0 && (
              <Section title="Personal Information" subtitle="This appears at the top of your resume">
                <TwoCol>
                  <Field label="Full Name" value={data.name} onChange={v => set("name", v)} placeholder="e.g. Jane Smith" />
                  <Field label="Phone" value={data.phone} onChange={v => set("phone", v)} placeholder="e.g. 555.555.5555" />
                </TwoCol>
                <TwoCol>
                  <Field label="Email" value={data.email} onChange={v => set("email", v)} placeholder="hello@email.com" type="email" />
                  <Field label="LinkedIn / Website" value={data.linkedin} onChange={v => set("linkedin", v)} placeholder="linkedin.com/in/yourname" />
                </TwoCol>
                <Field label="Location / Status" value={data.location} onChange={v => set("location", v)} placeholder="e.g. New York, NY · U.S. Citizen" />
              </Section>
            )}

            {step === 1 && (
              <Section title="Work Experience" subtitle="Add your most recent positions first">
                {data.experience.map((exp, idx) => (
                  <EntryBlock
                    key={exp.id}
                    title={`Position ${idx + 1}`}
                    onRemove={data.experience.length > 1 ? () => removeItem("experience", exp.id) : null}
                  >
                    <TwoCol>
                      <Field label="Company" value={exp.company} onChange={v => updateListItem("experience", exp.id, "company", v)} placeholder="Google" />
                      <Field label="Role / Title" value={exp.role} onChange={v => updateListItem("experience", exp.id, "role", v)} placeholder="Software Engineer" />
                    </TwoCol>
                    <TwoCol>
                      <Field label="Start Date" value={exp.startDate} onChange={v => updateListItem("experience", exp.id, "startDate", v)} placeholder="May 2022" />
                      <Field label="End Date" value={exp.endDate} onChange={v => updateListItem("experience", exp.id, "endDate", v)} placeholder="Present" />
                    </TwoCol>
                    <Field label="Location" value={exp.location} onChange={v => updateListItem("experience", exp.id, "location", v)} placeholder="Mountain View, CA" />
                    <BulletList
                      bullets={exp.bullets}
                      onChange={(i, v) => updateBullet("experience", exp.id, i, v)}
                      onAdd={() => addBullet("experience", exp.id)}
                      onRemove={i => removeBullet("experience", exp.id, i)}
                      placeholder="Describe an accomplishment with metrics..."
                    />
                  </EntryBlock>
                ))}
                <AddButton onClick={() => addItem("experience", defaultExperience)} label="Add Another Position" />
              </Section>
            )}

            {step === 2 && (
              <Section title="Education" subtitle="Include your degrees and relevant academic info">
                {data.education.map((edu, idx) => (
                  <EntryBlock
                    key={edu.id}
                    title={`School ${idx + 1}`}
                    onRemove={data.education.length > 1 ? () => removeItem("education", edu.id) : null}
                  >
                    <TwoCol>
                      <Field label="School Name" value={edu.school} onChange={v => updateListItem("education", edu.id, "school", v)} placeholder="MIT" />
                      <Field label="Degree" value={edu.degree} onChange={v => updateListItem("education", edu.id, "degree", v)} placeholder="B.S. Computer Science" />
                    </TwoCol>
                    <TwoCol>
                      <Field label="Start Date" value={edu.startDate} onChange={v => updateListItem("education", edu.id, "startDate", v)} placeholder="Sept 2019" />
                      <Field label="End Date" value={edu.endDate} onChange={v => updateListItem("education", edu.id, "endDate", v)} placeholder="May 2023" />
                    </TwoCol>
                    <Field label="Location" value={edu.location} onChange={v => updateListItem("education", edu.id, "location", v)} placeholder="Cambridge, MA" />
                    <Field label="Relevant Coursework" value={edu.coursework} onChange={v => updateListItem("education", edu.id, "coursework", v)} placeholder="Data Structures, Algorithms, ML, Databases" />
                    <Field label="Research / Awards (optional)" value={edu.research} onChange={v => updateListItem("education", edu.id, "research", v)} placeholder="Dean's List, Published research papers..  " />
                  </EntryBlock>
                ))}
                <AddButton onClick={() => addItem("education", defaultEducation)} label="Add Another School" />
              </Section>
            )}

            {step === 3 && (
              <Section title="Projects" subtitle="Personal projects, open source, freelance work">
                {data.projects.map((proj, idx) => (
                  <EntryBlock
                    key={proj.id}
                    title={`Project ${idx + 1}`}
                    onRemove={data.projects.length > 1 ? () => removeItem("projects", proj.id) : null}
                  >
                    <TwoCol>
                      <Field label="Project Name" value={proj.name} onChange={v => updateListItem("projects", proj.id, "name", v)} placeholder="OpenSource Tracker" />
                      <Field label="Start Date" value={proj.startDate} onChange={v => updateListItem("projects", proj.id, "startDate", v)} placeholder="Jan 2024" />
                    </TwoCol>
                    <Field label="End Date" value={proj.endDate} onChange={v => updateListItem("projects", proj.id, "endDate", v)} placeholder="Mar 2024 or Ongoing" />
                    <BulletList
                      bullets={proj.bullets}
                      onChange={(i, v) => updateBullet("projects", proj.id, i, v)}
                      onAdd={() => addBullet("projects", proj.id)}
                      onRemove={i => removeBullet("projects", proj.id, i)}
                      placeholder="What did you build and what impact did it have?"
                    />
                  </EntryBlock>
                ))}
                <AddButton onClick={() => addItem("projects", defaultProject)} label="Add Another Project" />
              </Section>
            )}

            {step === 4 && (
              <Section title="Skills" subtitle="Languages, frameworks, and tools you're proficient in">
                <Field
                  label="Programming Languages"
                  value={data.languages}
                  onChange={v => set("languages", v)}
                  placeholder="Python, JavaScript, TypeScript, SQL, Go"
                />
                <Field
                  label="Tools & Technologies"
                  value={data.tools}
                  onChange={v => set("tools", v)}
                  placeholder="React, Node.js, Docker, AWS, Figma, PostgreSQL"
                />
                <div className="bg-[#7c7cff]/10 border border-[#7c7cff] rounded-xl px-5 py-4 mt-2">
                  <p className="text-[#7c7cff] font-bold text-sm mb-1.5">✦ Ready to generate</p>
                  <p className="text-[#f0ede8] text-sm leading-relaxed m-0">
                    Your resume is packed with{" "}
                    <strong>{data.experience.reduce((a, e) => a + e.bullets.filter(Boolean).length, 0)}</strong> experience bullets,{" "}
                    <strong>{data.projects.reduce((a, p) => a + p.bullets.filter(Boolean).length, 0)}</strong> project highlights, and{" "}
                    <strong>{data.education.length}</strong> education{data.education.length > 1 ? " entries" : " entry"}.
                  </p>
                </div>
              </Section>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#2a2d34]">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={isFirst}
                className={`px-6 py-3 rounded-xl text-sm font-bold bg-[#2a2d34] text-[#f0ede8] border-none cursor-pointer tracking-wide transition-opacity
              ${isFirst ? "opacity-30 cursor-not-allowed" : "hover:opacity-75"}`}
              >
                ← Back
              </button>

              {!isLast ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-[#f0ede8] text-[#0e0f11] border-none cursor-pointer tracking-wide hover:opacity-90 transition-opacity"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={() => setSubmitted(true)}
                  className="px-8 py-3 rounded-xl text-sm font-bold bg-[#7c7cff] text-[#0e0f11] border-none cursor-pointer tracking-wide hover:scale-105 transition-transform"
                >
                  ✦ Generate Resume
                </button>
              )}
            </div>
          </div>

          {submitted && (
            <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-6">
              <div className="bg-[#16181c] border border-[#2a2d34] rounded-2xl p-10 max-w-xl w-full max-h-[80vh] overflow-y-auto">
                <div className="text-[#7c7cff] text-4xl mb-3">✦</div>
                <h2 className="text-2xl font-bold mb-2 mt-0">Resume Data Ready!</h2>
                <p className="text-[#7a7f8e] text-sm leading-relaxed mb-5">
                  Your data has been collected. In the full implementation, this would be sent to the backend to generate your LaTeX PDF.
                </p>
                <pre className="bg-[#0e0f11] border border-[#2a2d34] rounded-lg p-4 text-[11px] text-[#7c7cff] overflow-x-auto max-h-72 overflow-y-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
                <div className=" flex items-center justify-center gap-5 ">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-3 rounded-xl text-sm font-bold bg-[#f0ede8] text-[#0e0f11] border-none cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    ← Edit Resume
                  </button>

                  <button
                    onClick={handleSubmitClick}
                    className="mt-4 px-6 py-3 rounded-xl text-sm font-bold bg-[#7c7cff] text-[#0e0f11] border-none cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    Generate Resume PDF →
                  </button>
                </div>
              </div>
            </div>
          )}
          {loading && (
            <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-6">
              <div className="bg-[#16181c] border border-[#2a2d34] rounded-2xl p-10 max-w-xl w-full flex flex-col items-center gap-6">

                <LoaderOne size={48} className="text-[#7c7cff]" />
                <p className="text-[#f0ede8]">Generating your resume PDF...</p>
              </div>
            </div>
          )}
        </div >)}
      {isResult && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-[#16181c] border border-[#2a2d34] rounded-2xl p-10 max-w-xl w-full flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold mb-2 mt-0 text-[#7c7cff]">Your Resume is Ready!</h2>
            <p className="text-[#7a7f8e] text-sm leading-relaxed mb-5 text-center">
              Your resume PDF has been generated successfully. In a full implementation, you would see a preview here with options to download or edit.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}


function Section({ title, subtitle, children }) {
  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-bold mb-1.5 mt-0 tracking-tight">{title}</h2>
        <p className="text-[#7a7f8e] text-sm m-0">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function EntryBlock({ title, children, onRemove }) {
  return (
    <div className="bg-[#0e0f11] border border-[#2a2d34] rounded-xl p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold tracking-widest uppercase text-[#7a7f8e]">{title}</span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="bg-transparent border border-red-500 text-red-500 rounded-md px-2.5 py-1 text-xs cursor-pointer hover:bg-red-500/10 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5 mb-3">
      <label className="text-xs font-semibold text-[#7a7f8e] tracking-widest uppercase">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#0e0f11] border border-[#2a2d34] rounded-lg px-3.5 py-2.5 text-[#f0ede8] text-sm outline-none w-full
          placeholder:text-[#3d4149] focus:border-[#7c7cff] focus:ring-2 focus:ring-[#7c7cff]/10 transition-all"
      />
    </div>
  );
}

function TwoCol({ children }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function BulletList({ bullets, onChange, onAdd, onRemove, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5 mb-3">
      <label className="text-xs font-semibold text-[#7a7f8e] tracking-widest uppercase">Bullet Points</label>
      {bullets.map((b, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <span className="text-[#7c7cff] text-lg flex-shrink-0">•</span>
          <input
            value={b}
            onChange={e => onChange(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-[#0e0f11] border border-[#2a2d34] rounded-lg px-3.5 py-2.5 text-[#f0ede8] text-sm outline-none
              placeholder:text-[#3d4149] focus:border-[#7c7cff] focus:ring-2 focus:ring-[#7c7cff]/10 transition-all"
          />
          {bullets.length > 1 && (
            <button
              onClick={() => onRemove(i)}
              className="bg-transparent border-none text-[#7a7f8e] text-xl cursor-pointer px-1 leading-none hover:text-red-400 transition-colors flex-shrink-0"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="bg-transparent border border-dashed border-[#2a2d34] text-[#7a7f8e] rounded-md px-3.5 py-1.5 text-sm cursor-pointer self-start hover:border-[#7c7cff] hover:text-[#7c7cff] transition-colors"
      >
        + Add bullet
      </button>
    </div>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#7c7cff]/10 border border-dashed border-[#7c7cff] text-[#7c7cff] rounded-xl py-3 px-5 text-sm font-semibold cursor-pointer hover:bg-[#7c7cff]/20 transition-colors"
    >
      + {label}
    </button>
  );
}

