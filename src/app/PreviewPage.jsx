import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Image } from "lucide-react";
import usePortfolio from "../hooks/usePortfolio";

const themes = {
  classic: {
    container: "bg-slate-900 text-white",
    card: "bg-slate-800/70 border border-white/20",
    input: "bg-slate-800/70 text-white border border-white/20 focus:ring-2 focus:ring-indigo-400",
    button: "bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 flex items-center gap-2",
    skill: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",
    dangerButton: "text-red-400 hover:text-red-500",
  },
  dark: {
    container: "bg-gray-900 text-gray-100",
    card: "bg-gray-800/70 border border-gray-600/40",
    input: "bg-gray-800/70 text-gray-100 border border-gray-600/40 focus:ring-2 focus:ring-green-400",
    button: "bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 flex items-center gap-2",
    skill: "bg-green-500/10 text-green-300 border border-green-500/20",
    dangerButton: "text-red-500 hover:text-red-600",
  },
  modern: {
    container: "bg-white text-gray-900",
    card: "bg-gray-100 border border-gray-300",
    input: "bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-500",
    button: "bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 flex items-center gap-2",
    skill: "bg-indigo-100 text-indigo-600 border border-indigo-300",
    dangerButton: "text-red-500 hover:text-red-600",
  },
};
export default function PortfolioPreview() {
  const {
    portfolio,
    setPortfolio,
    fetchPortfolio,
    updatePortfolio,
    uploadProfileImage,
    uploadCertificateImage,
    loading,
  } = usePortfolio({
    Uname: localStorage.getItem("pun"),
  });

  const fileRefProfile = useRef(null);
  const fileRefCert = useRef(null);
  const activeCertIndex = useRef(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (!portfolio) return <div>Loading...</div>;

  const theme = themes[portfolio.theme] || themes.classic;

  // ================= SAVE =================
  const handleSaveAll = async () => {
    try {
      await updatePortfolio(portfolio);
      alert("Portfolio saved successfully ✅");
    } catch {
      alert("Save failed ❌");
    }
  };

  // ================= BASIC =================
  const updateField = (key, value) =>
    setPortfolio({ ...portfolio, [key]: value });

  // ================= PROFILE IMAGE =================
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const res = await uploadProfileImage(file);
    setPortfolio(res);
  };

  // ================= SKILLS =================
  const addSkill = (skill) => {
    if (!skill || portfolio.skills.includes(skill)) return;
    setPortfolio({ ...portfolio, skills: [...portfolio.skills, skill] });
  };

  const removeSkill = (skill) =>
    setPortfolio({
      ...portfolio,
      skills: portfolio.skills.filter((s) => s !== skill),
    });

  // ================= PROJECTS =================
  const addProject = () =>
    setPortfolio({
      ...portfolio,
      projects: [...(portfolio.projects || []), { name: "", description: "", link: "", image: "" }],
    });

  const updateProject = (i, key, value) => {
    const updated = [...portfolio.projects];
    updated[i][key] = value;
    setPortfolio({ ...portfolio, projects: updated });
  };

  const removeProject = (i) => {
    const updated = [...portfolio.projects];
    updated.splice(i, 1);
    setPortfolio({ ...portfolio, projects: updated });
  };

  // ================= CERTIFICATES =================
  const addCertificate = () =>
    setPortfolio({
      ...portfolio,
      certificates: [...(portfolio.certificates || []), { name: "", issuer: "", link: "", image: "" }],
    });

  const updateCertificate = (i, key, value) => {
    const updated = [...portfolio.certificates];
    updated[i][key] = value;
    setPortfolio({ ...portfolio, certificates: updated });
  };

  const removeCertificate = (i) => {
    const updated = [...portfolio.certificates];
    updated.splice(i, 1);
    setPortfolio({ ...portfolio, certificates: updated });
  };

  const handleCertImageClick = (i) => {
    activeCertIndex.current = i;
    fileRefCert.current.click();
  };

  const handleCertImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const i = activeCertIndex.current;
    const res = await uploadCertificateImage(portfolio.certificates[i]._id, file);
    setPortfolio(res);
  };

  // ================= EXPERIENCE =================
  const addExperience = () =>
    setPortfolio({
      ...portfolio,
      experience: [...(portfolio.experience || []), { role: "", company: "", startDate: "", endDate: "", description: "" }],
    });

  const updateExperience = (i, key, value) => {
    const updated = [...portfolio.experience];
    updated[i][key] = value;
    setPortfolio({ ...portfolio, experience: updated });
  };

  const removeExperience = (i) => {
    const updated = [...portfolio.experience];
    updated.splice(i, 1);
    setPortfolio({ ...portfolio, experience: updated });
  };

  // ================= LINKS =================
  const updateLinks = (key, value) =>
    setPortfolio({
      ...portfolio,
      links: { ...portfolio.links, [key]: value },
    });

  return (
    <div className={`container mx-auto p-6 space-y-6 ${theme.container}`}>

      {/* PROFILE */}
      <div className="flex gap-4 items-center">
        <div
          onClick={() => fileRefProfile.current.click()}
          className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border"
        >
          {portfolio.profileImage ? (
            <img src={portfolio.profileImage} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-600">Upload</div>
          )}
        </div>
        <input ref={fileRefProfile} type="file" hidden onChange={handleProfileUpload} />

        <div className="flex flex-col gap-2">
          <input value={portfolio.name} onChange={(e) => updateField("name", e.target.value)} className={theme.input} placeholder="Name" />
          <input value={portfolio.title} onChange={(e) => updateField("title", e.target.value)} className={theme.input} placeholder="Title" />
        </div>
      </div>

      {/* ABOUT */}
      <section className={`${theme.card} p-6 rounded-xl`}>
        <h2 className="text-xl mb-2">About</h2>
        <textarea value={portfolio.about || ""} onChange={(e) => updateField("about", e.target.value)} className={theme.input} />
      </section>

      {/* SKILLS */}
      <section className={`${theme.card} p-6 rounded-xl`}>
        <h2 className="text-xl mb-2">Skills</h2>
        <div className="flex gap-2 flex-wrap mb-2">
          {portfolio.skills.map((s, i) => (
            <span key={i} className={`px-3 py-1 rounded-full flex items-center gap-1 ${theme.skill}`}>
              {s}
              <button onClick={() => removeSkill(s)}><Trash2 size={14} /></button>
            </span>
          ))}
        </div>
        <AddSkillInput addSkill={addSkill} theme={theme} />
      </section>

      {/* PROJECTS */}
      <Section title="Projects" theme={theme}>
        {portfolio.projects?.map((p, i) => (
          <Card key={i} theme={theme}>
            <input value={p.name} onChange={(e) => updateProject(i, "name", e.target.value)} className={theme.input} placeholder="Name" />
            <textarea value={p.description} onChange={(e) => updateProject(i, "description", e.target.value)} className={theme.input} />
            <input value={p.link} onChange={(e) => updateProject(i, "link", e.target.value)} className={theme.input} />
            <button onClick={() => removeProject(i)} className={theme.dangerButton}>Remove</button>
          </Card>
        ))}
        <button onClick={addProject} className={theme.button}><Plus size={16} /> Add Project</button>
      </Section>

      {/* CERTIFICATES */}
      <Section title="Certificates" theme={theme}>
        {portfolio.certificates?.map((c, i) => (
          <Card key={i} theme={theme}>
            <input value={c.name} onChange={(e) => updateCertificate(i, "name", e.target.value)} className={theme.input} />
            <input value={c.issuer} onChange={(e) => updateCertificate(i, "issuer", e.target.value)} className={theme.input} />
            <input value={c.link} onChange={(e) => updateCertificate(i, "link", e.target.value)} className={theme.input} />
            <button onClick={() => handleCertImageClick(i)} className={theme.button}><Image size={16} /> Image</button>
            <button onClick={() => removeCertificate(i)} className={theme.dangerButton}>Remove</button>
          </Card>
        ))}
        <button onClick={addCertificate} className={theme.button}><Plus size={16} /> Add Certificate</button>
        <input ref={fileRefCert} type="file" hidden onChange={handleCertImageUpload} />
      </Section>

      {/* SAVE BUTTON */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Section({ title, children, theme }) {
  return (
    <section className={`${theme.card} p-6 rounded-xl space-y-4`}>
      <h2 className="text-xl">{title}</h2>
      {children}
    </section>
  );
}

function Card({ children, theme }) {
  return <div className={`${theme.card} p-4 rounded-lg space-y-2`}>{children}</div>;
}

function AddSkillInput({ addSkill, theme }) {
  const [skill, setSkill] = useState("");
  return (
    <div className="flex gap-2">
      <input value={skill} onChange={(e) => setSkill(e.target.value)} className={theme.input} />
      <button onClick={() => { addSkill(skill.trim()); setSkill(""); }} className={theme.button}>Add</button>
    </div>
  );
}
