import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Image } from "lucide-react";
import usePortfolio from "../hooks/usePortfolio";

const themes = {
  classic: {
    container: "bg-slate-900 text-white",
    card: "bg-slate-800/80 border border-white/10 rounded-xl shadow-lg",
    input:
      "w-full bg-slate-800/70 text-white border border-white/20 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition",
    button:
      "bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-2 font-medium flex items-center gap-2 transition",
    skill:
      "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full px-3 py-1 text-sm",
    dangerButton:
      "text-red-400 hover:text-red-500 transition",
  },

  dark: {
    container: "bg-gray-900 text-gray-100",
    card: "bg-gray-800/80 border border-gray-700 rounded-xl shadow-lg",
    input:
      "w-full bg-gray-800/70 text-gray-100 border border-gray-600 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition",
    button:
      "bg-green-600 hover:bg-green-700 text-white rounded-lg px-5 py-2 font-medium flex items-center gap-2 transition",
    skill:
      "bg-green-500/10 text-green-300 border border-green-500/20 rounded-full px-3 py-1 text-sm",
    dangerButton:
      "text-red-500 hover:text-red-600 transition",
  },

  modern: {
    container: "bg-gray-50 text-gray-900",
    card: "bg-white border border-gray-200 rounded-xl shadow-md",
    input:
      "w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition",
    button:
      "bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-2 font-medium flex items-center gap-2 transition",
    skill:
      "bg-indigo-100 text-indigo-700 border border-indigo-300 rounded-full px-3 py-1 text-sm",
    dangerButton:
      "text-red-500 hover:text-red-600 transition",
  },
};


const inputBase =
  "w-full px-4 py-2 rounded-lg bg-slate-900/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function PortfolioPreview() {
  const {
    portfolio,
    setPortfolio,
    fetchPortfolio,
    updatePortfolio,
    uploadProfileImage,
    uploadCertificateImage,
    loading,
  } = usePortfolio({ Uname: localStorage.getItem("pun") });

  const fileRefProfile = useRef(null);
  const fileRefCert = useRef(null);
  const activeCertIndex = useRef(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (!portfolio) return <div className="p-6">Loading...</div>;

  const theme = themes[portfolio.theme] || themes.classic;

  /* ================= SAVE ================= */
  const handleSaveAll = async () => {
    try {
      await updatePortfolio(portfolio);
      alert("Saved successfully ✅");
    } catch {
      alert("Save failed ❌");
    }
  };

  const updateField = (k, v) => setPortfolio({ ...portfolio, [k]: v });

  /* ================= PROFILE IMAGE ================= */
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const res = await uploadProfileImage(file);
    setPortfolio(res);
  };

  const addSkill = (s) => {
    if (!s || portfolio.skills.includes(s)) return;
    setPortfolio({ ...portfolio, skills: [...portfolio.skills, s] });
  };
  const removeSkill = (s) =>
    setPortfolio({
      ...portfolio,
      skills: portfolio.skills.filter((x) => x !== s),
    });

  const addProject = () =>
    setPortfolio({
      ...portfolio,
      projects: [...(portfolio.projects || []), { name: "", description: "", link: "" }],
    });

  const updateProject = (i, k, v) => {
    const p = [...portfolio.projects];
    p[i][k] = v;
    setPortfolio({ ...portfolio, projects: p });
  };

  const removeProject = (i) => {
    const p = [...portfolio.projects];
    p.splice(i, 1);
    setPortfolio({ ...portfolio, projects: p });
  };

  const addCertificate = () =>
    setPortfolio({
      ...portfolio,
      certificates: [...(portfolio.certificates || []), { name: "", issuer: "", link: "" }],
    });

  const updateCertificate = (i, k, v) => {
    const c = [...portfolio.certificates];
    c[i][k] = v;
    setPortfolio({ ...portfolio, certificates: c });
  };

  const removeCertificate = (i) => {
    const c = [...portfolio.certificates];
    c.splice(i, 1);
    setPortfolio({ ...portfolio, certificates: c });
  };

  const handleCertImageClick = (i) => {
    activeCertIndex.current = i;
    fileRefCert.current.click();
  };

  const handleCertImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const i = activeCertIndex.current;
    const res = await uploadCertificateImage(
      portfolio.certificates[i]._id,
      file
    );
    setPortfolio(res);
  };

  const addExperience = () =>
    setPortfolio({
      ...portfolio,
      experience: [...(portfolio.experience || []), {}],
    });

  const updateExperience = (i, k, v) => {
    const e = [...portfolio.experience];
    e[i][k] = v;
    setPortfolio({ ...portfolio, experience: e });
  };

  const removeExperience = (i) => {
    const e = [...portfolio.experience];
    e.splice(i, 1);
    setPortfolio({ ...portfolio, experience: e });
  };

  const addEducation = () =>
    setPortfolio({
      ...portfolio,
      education: [...(portfolio.education || []), {}],
    });

  const updateEducation = (i, k, v) => {
    const e = [...portfolio.education];
    e[i][k] = v;
    setPortfolio({ ...portfolio, education: e });
  };

  const removeEducation = (i) => {
    const e = [...portfolio.education];
    e.splice(i, 1);
    setPortfolio({ ...portfolio, education: e });
  };

  const updateLinks = (k, v) =>
    setPortfolio({
      ...portfolio,
      links: { ...portfolio.links, [k]: v },
    });

  return (
    <div className={`container mx-auto p-6 space-y-8 ${theme.container}`}>

      {/* PROFILE */}
      <div className="flex gap-4 items-center">
        <div
          className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border"
          onClick={() => fileRefProfile.current.click()}
        >
          {portfolio.profileImage ? (
            <img src={portfolio.profileImage} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-600">
              Upload
            </div>
          )}
        </div>
        <input ref={fileRefProfile} type="file" hidden onChange={handleProfileUpload} />

        <div className="flex flex-col gap-2 w-full max-w-md">
          <input className={inputBase} value={portfolio.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Name" />
          <input className={inputBase} value={portfolio.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Title" />
        </div>
      </div>

      {/* ABOUT */}
      <Section title="About" theme={theme}>
        <textarea className={inputBase} value={portfolio.about || ""} onChange={(e) => updateField("about", e.target.value)} />
      </Section>

      {/* SKILLS */}
      <Section title="Skills" theme={theme}>
        <div className="flex gap-2 flex-wrap">
          {portfolio.skills.map((s, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-indigo-500/20 flex gap-1 items-center">
              {s}
              <button onClick={() => removeSkill(s)}><Trash2 size={14} /></button>
            </span>
          ))}
        </div>
        <AddSkillInput addSkill={addSkill} />
      </Section>

      {/* PROJECTS */}
      <Section title="Projects" theme={theme}>
        {portfolio.projects?.map((p, i) => (
          <Card key={i} theme={theme}>
            <input className={inputBase} placeholder="Project name" value={p.name} onChange={(e) => updateProject(i, "name", e.target.value)} />
            <textarea className={inputBase} placeholder="Description" value={p.description} onChange={(e) => updateProject(i, "description", e.target.value)} />
            <input className={inputBase} placeholder="Link" value={p.link} onChange={(e) => updateProject(i, "link", e.target.value)} />
            <button onClick={() => removeProject(i)} className={theme.danger}>Remove</button>
          </Card>
        ))}
        <button onClick={addProject} className={theme.button}><Plus size={16} /> Add Project</button>
      </Section>

      {/* CERTIFICATES */}
      <Section title="Certificates" theme={theme}>
        {portfolio.certificates?.map((c, i) => (
          <Card key={i} theme={theme}>
            <input className={inputBase} placeholder="Name" value={c.name} onChange={(e) => updateCertificate(i, "name", e.target.value)} />
            <input className={inputBase} placeholder="Issuer" value={c.issuer} onChange={(e) => updateCertificate(i, "issuer", e.target.value)} />
            <input className={inputBase} placeholder="Link" value={c.link} onChange={(e) => updateCertificate(i, "link", e.target.value)} />
            <button onClick={() => handleCertImageClick(i)} className={theme.button}><Image size={16} /> Image</button>
            <button onClick={() => removeCertificate(i)} className={theme.danger}>Remove</button>
          </Card>
        ))}
        <button onClick={addCertificate} className={theme.button}><Plus size={16} /> Add Certificate</button>
        <input ref={fileRefCert} type="file" hidden onChange={handleCertImageUpload} />
      </Section>

      {/* EXPERIENCE */}
      <Section title="Experience" theme={theme}>
        {portfolio.experience?.map((e, i) => (
          <Card key={i} theme={theme}>
            <input className={inputBase} placeholder="Role" value={e.role || ""} onChange={(ev) => updateExperience(i, "role", ev.target.value)} />
            <input className={inputBase} placeholder="Company" value={e.company || ""} onChange={(ev) => updateExperience(i, "company", ev.target.value)} />
            <textarea className={inputBase} placeholder="Description" value={e.description || ""} onChange={(ev) => updateExperience(i, "description", ev.target.value)} />
            <button onClick={() => removeExperience(i)} className={theme.danger}>Remove</button>
          </Card>
        ))}
        <button onClick={addExperience} className={theme.button}><Plus size={16} /> Add Experience</button>
      </Section>

      {/* EDUCATION */}
      <Section title="Education" theme={theme}>
        {portfolio.education?.map((e, i) => (
          <Card key={i} theme={theme}>
            <input className={inputBase} placeholder="Degree" value={e.degree || ""} onChange={(ev) => updateEducation(i, "degree", ev.target.value)} />
            <input className={inputBase} placeholder="University" value={e.university || ""} onChange={(ev) => updateEducation(i, "university", ev.target.value)} />
            <button onClick={() => removeEducation(i)} className={theme.danger}>Remove</button>
          </Card>
        ))}
        <button onClick={addEducation} className={theme.button}><Plus size={16} /> Add Education</button>
      </Section>

      {/* LINKS */}
      <Section title="Links" theme={theme}>
        {["github", "linkedin", "website", "email"].map((k) => (
          <input
            key={k}
            className={inputBase}
            placeholder={k.toUpperCase()}
            value={portfolio.links?.[k] || ""}
            onChange={(e) => updateLinks(k, e.target.value)}
          />
        ))}
      </Section>

      {/* SAVE */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold shadow-lg"
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
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Card({ children, theme }) {
  return <div className={`${theme.card} p-4 rounded-lg space-y-2`}>{children}</div>;
}

function AddSkillInput({ addSkill }) {
  const [skill, setSkill] = useState("");
  return (
    <div className="flex gap-2">
      <input className={inputBase} value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Add skill" />
      <button onClick={() => { addSkill(skill.trim()); setSkill(""); }} className="bg-indigo-600 px-4 rounded-lg">
        Add
      </button>
    </div>
  );
}
