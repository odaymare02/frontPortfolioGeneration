import { useState, useEffect } from "react";
import { X } from "lucide-react";
import usePortfolio from "../hooks/usePortfolio";

export default function Skills({ data }) {
  const { loading, updatePortfolio } = usePortfolio({ Uname: localStorage.getItem('pun') });

  const [skills, setSkills] = useState(data.skills || []);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    setSkills(data.skills || []);
  }, [data.skills]);

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill || skills.includes(skill)) return;

    const updatedSkills = [...skills, skill];
    setSkills(updatedSkills);
    setNewSkill("");

    updatePortfolio({ skills: updatedSkills }).catch(() => {
      setSkills(skills);
    });
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(updatedSkills);

    updatePortfolio({ skills: updatedSkills }).catch(() => {
      setSkills(skills);
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <section className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white">Skills</h2>

      <div className="flex flex-wrap gap-2">
        {skills.length === 0 && <p className="text-sm text-gray-400">No skills added yet</p>}

        {skills.map((skill, i) => (
          <span
            key={i}
            className="flex items-center gap-1 px-3 py-1 rounded-full
              bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              disabled={loading}
              className="hover:text-red-400"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Add a skill (e.g. React)"
          className="flex-1 rounded-lg bg-slate-800/70 px-4 py-2 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={addSkill}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
        >
          Add
        </button>
      </div>
    </section>
  );
}
