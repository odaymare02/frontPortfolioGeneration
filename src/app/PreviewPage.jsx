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

export default function PortfolioPreview({ data }) {
  const { 
    updatePortfolio, 
    uploadProfileImage, 
    uploadCertificateImage, 
    loading, 
    portfolio, 
    setPortfolio, 
    fetchPortfolio 
  } = usePortfolio({
    Uname: localStorage.getItem("pun"),
  });

  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileRefProfile = useRef(null);
  const fileRefCert = useRef(null);
  const activeCertIndex = useRef(null);

  if (!portfolio) return <div>Loading...</div>; 

  const theme = themes[portfolio.theme] || themes.classic;

  // ---------- Handlers ----------
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const res = await uploadProfileImage(file);
    setPortfolio(res);
  };

  const updateField = async (key, value) => {
    const updated = { ...portfolio, [key]: value };
    setPortfolio(updated);
    await updatePortfolio({ [key]: value });
  };

  const addSkill = async (skill) => {
    if (!skill || portfolio.skills.includes(skill)) return;
    const updated = [...portfolio.skills, skill];
    setPortfolio({ ...portfolio, skills: updated });
    await updatePortfolio({ skills: updated });
  };

  const removeSkill = async (skill) => {
    const updated = portfolio.skills.filter((s) => s !== skill);
    setPortfolio({ ...portfolio, skills: updated });
    await updatePortfolio({ skills: updated });
  };

  const addProject = async () => {
    const updated = [...(portfolio.projects || []), { name: "", description: "", link: "", image: "" }];
    setPortfolio({ ...portfolio, projects: updated });
    await updatePortfolio({ projects: updated });
  };

  const updateProject = async (i, key, value) => {
    const updated = [...portfolio.projects];
    updated[i][key] = value;
    setPortfolio({ ...portfolio, projects: updated });
    await updatePortfolio({ projects: updated });
  };

  const removeProject = async (i) => {
    const updated = [...portfolio.projects];
    updated.splice(i, 1);
    setPortfolio({ ...portfolio, projects: updated });
    await updatePortfolio({ projects: updated });
  };

  const addCertificate = async () => {
    const updated = [...(portfolio.certificates || []), { name: "", issuer: "", link: "", image: "" }];
    setPortfolio({ ...portfolio, certificates: updated });
    await updatePortfolio({ certificates: updated });
  };

  const updateCertificate = async (i, key, value) => {
    const updated = [...portfolio.certificates];
    updated[i][key] = value;
    setPortfolio({ ...portfolio, certificates: updated });
    await updatePortfolio({ certificates: updated });
  };

  const removeCertificate = async (i) => {
    const updated = [...portfolio.certificates];
    updated.splice(i, 1);
    setPortfolio({ ...portfolio, certificates: updated });
    await updatePortfolio({ certificates: updated });
  };

  const handleCertImageClick = (i) => {
    activeCertIndex.current = i;
    fileRefCert.current.click();
  };

  const handleCertImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const i = activeCertIndex.current;
    const cert = portfolio.certificates[i];
    const res = await uploadCertificateImage(cert._id, file); 
    setPortfolio(res);
  };

  // ---------- Experience ----------
  const addExperience = async () => {
    const updated = [...(portfolio.experience || []), { role: "", company: "", startDate: "", endDate: "", description: "" }];
    setPortfolio({ ...portfolio, experience: updated });
    await updatePortfolio({ experience: updated });
  };

  const updateExperience = async (i, key, value) => {
    const updated = [...portfolio.experience];
    updated[i][key] = value;
    setPortfolio({ ...portfolio, experience: updated });
    await updatePortfolio({ experience: updated });
  };

  const removeExperience = async (i) => {
    const updated = [...portfolio.experience];
    updated.splice(i, 1);
    setPortfolio({ ...portfolio, experience: updated });
    await updatePortfolio({ experience: updated });
  };

  // ---------- Links ----------
  const updateLinks = async (key, value) => {
    const updated = { ...portfolio.links, [key]: value };
    setPortfolio({ ...portfolio, links: updated });
    await updatePortfolio({ links: updated });
  };

  return (
    <div className={`container mx-auto p-6 space-y-6 ${theme.container}`}>

      {/* Profile */}
      <div className="flex items-center gap-4">
        <div
          className="w-24 h-24 rounded-full border border-white/10 overflow-hidden cursor-pointer"
          onClick={() => fileRefProfile.current.click()}
        >
          {portfolio.profileImage ? (
            <img src={portfolio.profileImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-gray-500">Upload</div>
          )}
        </div>
        <input ref={fileRefProfile} type="file" hidden accept="image/*" onChange={handleProfileUpload} />
        <div className="flex flex-col gap-1">
          <input
            value={portfolio.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={`${theme.input}`}
            placeholder="Name"
          />
          <input
            value={portfolio.title}
            onChange={(e) => updateField("title", e.target.value)}
            className={`${theme.input}`}
            placeholder="Title"
          />
        </div>
      </div>

      {/* About */}
      <section className={`p-6 rounded-2xl ${theme.card}`}>
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <textarea
          value={portfolio.about || ""}
          onChange={(e) => updateField("about", e.target.value)}
          className={`w-full rounded-lg px-4 py-2 ${theme.input}`}
        />
      </section>

      {/* Skills */}
      <section className={`p-6 rounded-2xl ${theme.card}`}>
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {portfolio.skills?.map((s, i) => (
            <span key={i} className={`flex items-center gap-1 px-3 py-1 rounded-full ${theme.skill}`}>
              {s}
              <button onClick={() => removeSkill(s)} className={theme.dangerButton}>
                <Trash2 size={14} />
              </button>
            </span>
          ))}
        </div>
        <AddSkillInput addSkill={addSkill} theme={theme} />
      </section>

      {/* Projects */}
      <section className={`p-6 rounded-2xl ${theme.card} space-y-4`}>
        <h2 className="text-xl font-semibold mb-2">Projects</h2>
        {portfolio.projects?.map((p, i) => (
          <div key={i} className={`${theme.card} p-4 rounded-xl border`}>
            {p.image && <img src={p.image} className="w-full h-40 object-cover rounded-lg mb-2" />}
            <input
              value={p.name}
              onChange={(e) => updateProject(i, "name", e.target.value)}
              className={`${theme.input}`}
              placeholder="Project Name"
            />
            <textarea
              value={p.description}
              onChange={(e) => updateProject(i, "description", e.target.value)}
              className={`${theme.input}`}
              placeholder="Description"
            />
            <input
              value={p.link}
              onChange={(e) => updateProject(i, "link", e.target.value)}
              className={`${theme.input}`}
              placeholder="Link"
            />
            <button onClick={() => removeProject(i)} className={theme.dangerButton + " mt-2 flex items-center gap-1"}>
              <Trash2 size={16} /> Remove
            </button>
          </div>
        ))}
        <button onClick={addProject} className={theme.button}>
          <Plus size={16} /> Add Project
        </button>
      </section>

      {/* Certificates */}
      <section className={`p-6 rounded-2xl ${theme.card} space-y-4`}>
        <h2 className="text-xl font-semibold mb-2">Certificates</h2>
        {portfolio.certificates?.map((c, i) => (
          <div key={i} className={`${theme.card} p-4 rounded-xl border`}>
            {c.image && <img src={c.image} className="w-full h-32 object-cover rounded-lg mb-2" />}
            <input
              value={c.name}
              onChange={(e) => updateCertificate(i, "name", e.target.value)}
              className={`${theme.input}`}
              placeholder="Certificate Name"
            />
            <input
              value={c.issuer}
              onChange={(e) => updateCertificate(i, "issuer", e.target.value)}
              className={`${theme.input}`}
              placeholder="Issuer"
            />
            <input
              value={c.link}
              onChange={(e) => updateCertificate(i, "link", e.target.value)}
              className={`${theme.input}`}
              placeholder="Link"
            />
            <button onClick={() => handleCertImageClick(i)} className={theme.button}>
              <Image size={16} /> Upload Image
            </button>
            <button onClick={() => removeCertificate(i)} className={theme.dangerButton + " flex items-center gap-1"}>
              <Trash2 size={16} /> Remove
            </button>
          </div>
        ))}
        <button onClick={addCertificate} className={theme.button}>
          <Plus size={16} /> Add Certificate
        </button>
        <input ref={fileRefCert} type="file" hidden accept="image/*" onChange={handleCertImageUpload} />
      </section>

      {/* Experience */}
      <section className={`p-6 rounded-2xl ${theme.card} space-y-4`}>
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        {portfolio.experience?.map((e, i) => (
          <div key={i} className={`${theme.card} p-4 rounded-xl border space-y-2`}>
            <input
              value={e.role}
              onChange={(ev) => updateExperience(i, "role", ev.target.value)}
              className={theme.input}
              placeholder="Role"
            />
            <input
              value={e.company}
              onChange={(ev) => updateExperience(i, "company", ev.target.value)}
              className={theme.input}
              placeholder="Company"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={e.startDate?.split("T")[0]}
                onChange={(ev) => updateExperience(i, "startDate", ev.target.value)}
                className={theme.input + " w-1/2"}
              />
              <input
                type="date"
                value={e.endDate?.split("T")[0] || ""}
                onChange={(ev) => updateExperience(i, "endDate", ev.target.value)}
                className={theme.input + " w-1/2"}
              />
            </div>
            <textarea
              value={e.description || ""}
              onChange={(ev) => updateExperience(i, "description", ev.target.value)}
              className={theme.input}
              placeholder="Description"
            />
            <button onClick={() => removeExperience(i)} className={theme.dangerButton + " flex items-center gap-1"}>
              <Trash2 size={16} /> Remove
            </button>
          </div>
        ))}
        <button onClick={addExperience} className={theme.button}>
          <Plus size={16} /> Add Experience
        </button>
      </section>

      {/* Links */}
      <section className={`p-6 rounded-2xl ${theme.card} flex flex-col gap-2`}>
        <h2 className="text-xl font-semibold mb-2">Links</h2>
        {["github", "linkedin", "email", "website"].map((key) => (
          <input
            key={key}
            value={portfolio.links[key] || ""}
            onChange={(e) => updateLinks(key, e.target.value)}
            className={theme.input}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          />
        ))}
      </section>
    </div>
  );
}

function AddSkillInput({ addSkill, theme }) {
  const [newSkill, setNewSkill] = useState("");
  const handleAdd = () => {
    addSkill(newSkill.trim());
    setNewSkill("");
  };
  return (
    <div className="flex gap-2 mt-2">
      <input
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        className={`${theme.input} flex-1`}
        placeholder="Add a skill"
      />
      <button onClick={handleAdd} className={theme.button}>
        Add
      </button>
    </div>
  );
}
