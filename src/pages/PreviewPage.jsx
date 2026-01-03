import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import usePortfolio from "../hooks/usePortfolio";
import Loading from "../components/Loading";
import Swal from 'sweetalert2';
    import withReactContent from 'sweetalert2-react-content';
    
    const MySwal = withReactContent(Swal);

const themes = {
  classic: {
    container: "bg-slate-900 text-white min-h-screen",
    card: "bg-slate-800/80 border border-white/10 rounded-xl shadow-lg",
    input:
      "w-full px-4 py-2 rounded-lg bg-slate-800/70 text-white border border-white/20 focus:ring-2 focus:ring-indigo-400",
    textarea:
      "w-full px-4 py-2 rounded-lg bg-slate-800/70 text-white border border-white/20 focus:ring-2 focus:ring-indigo-400",
    button:
      "bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-2 font-medium flex items-center gap-2",
    danger: "text-red-400 hover:text-red-500",
    pill: "px-3 py-1 rounded-full bg-indigo-500/20 flex gap-1 items-center text-sm",
  },
};

export default function PortfolioPreview() {
  const navigate = useNavigate();
  const {
    portfolio,
    setPortfolio,
    fetchPortfolio,
    updatePortfolio,
    uploadProfileImage,
    uploadCertificateImage,
    uploadProjectImage,
    loading,
  } = usePortfolio({ Uname: localStorage.getItem("pun") });

  const fileRefProfile = useRef(null);
  const certImageRef = useRef(null);
  const projectImageRef = useRef(null);
  const activeCertIndex = useRef(null);
  const activeProjectIndex = useRef(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (!portfolio) return <Loading />;

  const theme = themes[portfolio.theme] || themes.classic;

  const updateField = (k, v) => setPortfolio({ ...portfolio, [k]: v });

  const listUpdate = (key, i, k, v) => {
    const arr = [...portfolio[key]];
    arr[i][k] = v;
    setPortfolio({ ...portfolio, [key]: arr });
  };

  const listAdd = (key, obj) =>
    setPortfolio({ ...portfolio, [key]: [...(portfolio[key] || []), obj] });

  const listRemove = (key, i) => {
    const arr = [...portfolio[key]];
    arr.splice(i, 1);
    setPortfolio({ ...portfolio, [key]: arr });
  };

  const handleProfileUpload = async (e) => {
    const res = await uploadProfileImage(e.target.files[0]);
    setPortfolio(res);
  };

  const handleCertImageUpload = async (e) => {
    const i = activeCertIndex.current;
    const res = await uploadCertificateImage(
      portfolio.certificates[i]._id,
      e.target.files[0]
    );
    setPortfolio(res);
  };

  const handleProjectImageUpload = async (e) => {
    const i = activeProjectIndex.current;
    const res = await uploadProjectImage(
      portfolio.projects[i]._id,
      e.target.files[0]
    );
    setPortfolio(res);
  };

  const handleSaveAll = async () => {
    await updatePortfolio(portfolio);
     MySwal.fire({
      icon: 'success',
      title: 'Saved successfully✅',
      showConfirmButton: false,
      timer: 1500
    });
    
  };

  return (
    <div className={`container mx-auto p-6 space-y-8 ${theme.container}`}>
      <div className="flex gap-4 items-center">
        <div
          className="w-24 h-24 rounded-full overflow-hidden border cursor-pointer"
          onClick={() => fileRefProfile.current.click()}
        >
          {portfolio.profileImage ? (
            <img
              src={portfolio.profileImage}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              Upload
            </div>
          )}
        </div>
        <input
          ref={fileRefProfile}
          type="file"
          hidden
          onChange={handleProfileUpload}
        />
        <div className="space-y-2 w-full max-w-md">
          <input
            placeholder="Full Name"
            className={theme.input}
            value={portfolio.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
          <input
            className={theme.input}
            placeholder="Professional Title"
            value={portfolio.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>
      </div>

      <Section title="About" theme={theme}>
        <textarea
          placeholder="Write a short summary about yourself..."
          className={theme.textarea}
          value={portfolio.about || ""}
          onChange={(e) => updateField("about", e.target.value)}
        />
      </Section>

      <Section title="Skills" theme={theme}>
        <div className="flex flex-wrap gap-2">
          {portfolio.skills?.map((s, i) => (
            <span key={i} className={theme.pill}>
              {s}
              <button
                onClick={() =>
                  setPortfolio({
                    ...portfolio,
                    skills: portfolio.skills.filter((x) => x !== s),
                  })
                }
              >
                <Trash2 size={14} />
              </button>
            </span>
          ))}
        </div>
        <AddSkillInput
          theme={theme}
          addSkill={(s) =>
            s &&
            !portfolio.skills.includes(s) &&
            setPortfolio({ ...portfolio, skills: [...portfolio.skills, s] })
          }
        />
      </Section>

      <Section title="Projects" theme={theme}>
        {portfolio.projects?.map((p, i) => (
          <Card key={i} theme={theme}>
            {p.image && (
              <img
                src={p.image}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <button
              className={theme.button}
              onClick={() => {
                activeProjectIndex.current = i;
                projectImageRef.current.click();
              }}
            >
              <Image size={16} /> Project Image
            </button>
            <input
              placeholder="Project Name"
              className={theme.input}
              value={p.name || ""}
              onChange={(e) =>
                listUpdate("projects", i, "name", e.target.value)
              }
            />
            <textarea
              placeholder="Project description and your role"
              className={theme.textarea}
              value={p.description || ""}
              onChange={(e) =>
                listUpdate("projects", i, "description", e.target.value)
              }
            />
            <input
              placeholder="Project URL (GitHub / Live demo)"
              className={theme.input}
              value={p.link || ""}
              onChange={(e) =>
                listUpdate("projects", i, "link", e.target.value)
              }
            />
            <button
              onClick={() => listRemove("projects", i)}
              className={theme.danger}
            >
              Remove
            </button>
          </Card>
        ))}
        <button
          onClick={() => listAdd("projects", {})}
          className={theme.button}
        >
          <Plus size={16} /> Add Project
        </button>
        <input
          ref={projectImageRef}
          type="file"
          hidden
          onChange={handleProjectImageUpload}
        />
      </Section>

      <Section title="Certificates" theme={theme}>
        {portfolio.certificates?.map((c, i) => (
          <Card key={i} theme={theme}>
            {c.image && (
              <img
                src={c.image}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
            <input
              placeholder="Certificate Name"
              className={theme.input}
              value={c.name || ""}
              onChange={(e) =>
                listUpdate("certificates", i, "name", e.target.value)
              }
            />
            <input
              placeholder="Issuing Organization"
              className={theme.input}
              value={c.issuer || ""}
              onChange={(e) =>
                listUpdate("certificates", i, "issuer", e.target.value)
              }
            />
            <input
              placeholder="Certificate URL"
              className={theme.input}
              value={c.link || ""}
              onChange={(e) =>
                listUpdate("certificates", i, "link", e.target.value)
              }
            />
            <button
              className={theme.button}
              onClick={() => {
                activeCertIndex.current = i;
                certImageRef.current.click();
              }}
            >
              <Image size={16} /> Certificate Image
            </button>
            <button
              onClick={() => listRemove("certificates", i)}
              className={theme.danger}
            >
              Remove
            </button>
          </Card>
        ))}
        <button
          onClick={() => listAdd("certificates", {})}
          className={theme.button}
        >
          <Plus size={16} /> Add Certificate
        </button>
        <input
          ref={certImageRef}
          type="file"
          hidden
          onChange={handleCertImageUpload}
        />
      </Section>

      <Section title="Experience" theme={theme}>
        {portfolio.experience?.map((e, i) => (
  <Card key={i} theme={theme}>
    <input
      className={theme.input}
      placeholder="Job Title"
      value={e.role || ""}
      onChange={(ev) => listUpdate("experience", i, "role", ev.target.value)}
    />

    <input
      className={theme.input}
      placeholder="Company Name"
      value={e.company || ""}
      onChange={(ev) => listUpdate("experience", i, "company", ev.target.value)}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <input
        type="date"
        className={theme.input}
        value={e.startDate ? e.startDate.slice(0, 10) : ""}
        onChange={(ev) =>
          listUpdate("experience", i, "startDate", ev.target.value)
        }
      />

      <input
        type="date"
        className={theme.input}
        value={e.endDate ? e.endDate.slice(0, 10) : ""}
        onChange={(ev) =>
          listUpdate("experience", i, "endDate", ev.target.value)
        }
      />
    </div>

    <textarea
      className={theme.textarea}
      placeholder="Describe your responsibilities and achievements"
      value={e.description || ""}
      onChange={(ev) =>
        listUpdate("experience", i, "description", ev.target.value)
      }
    />

    <button
      onClick={() => listRemove("experience", i)}
      className={theme.danger}
    >
      Remove
    </button>
  </Card>
))}
        <button
          onClick={() => listAdd("experience", {})}
          className={theme.button}
        >
          <Plus size={16} /> Add Experience
        </button>
      </Section>

      <Section title="Education" theme={theme}>
       {portfolio.education?.map((e, i) => (
  <Card key={i} theme={theme}>
    <input
      className={theme.input}
      placeholder="Institution Name"
      value={e.institution || ""}
      onChange={(ev) =>
        listUpdate("education", i, "institution", ev.target.value)
      }
    />

    <input
      className={theme.input}
      placeholder="Degree / Field of Study"
      value={e.degree || ""}
      onChange={(ev) =>
        listUpdate("education", i, "degree", ev.target.value)
      }
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <input
        type="date"
        className={theme.input}
        value={e.startDate ? e.startDate.slice(0, 10) : ""}
        onChange={(ev) =>
          listUpdate("education", i, "startDate", ev.target.value)
        }
      />

      <input
        type="date"
        className={theme.input}
        value={e.endDate ? e.endDate.slice(0, 10) : ""}
        onChange={(ev) =>
          listUpdate("education", i, "endDate", ev.target.value)
        }
      />
    </div>

    <textarea
      className={theme.textarea}
      placeholder="Additional details (optional)"
      value={e.description || ""}
      onChange={(ev) =>
        listUpdate("education", i, "description", ev.target.value)
      }
    />

    <button
      onClick={() => listRemove("education", i)}
      className={theme.danger}
    >
      Remove
    </button>
  </Card>
))}
        <button
          onClick={() => listAdd("education", {})}
          className={theme.button}
        >
          <Plus size={16} /> Add Education
        </button>
      </Section>

      <Section title="Links" theme={theme}>
        {["github", "linkedin", "website", "email"].map((k) => (
          <input
            key={k}
            className={theme.input}
            placeholder={k.toUpperCase()}
            value={portfolio.links?.[k] || ""}
            onChange={(e) =>
              setPortfolio({
                ...portfolio,
                links: { ...portfolio.links, [k]: e.target.value },
              })
            }
          />
        ))}
      </Section>

      <div className="sticky bottom-4 flex justify-end gap-3">
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className={theme.button}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button onClick={() => navigate("/")} className={theme.button}>
          Home
        </button>
      </div>
    </div>
  );
}

function Section({ title, children, theme }) {
  return (
    <section className={`${theme.card} p-6 space-y-4`}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Card({ children, theme }) {
  return <div className={`${theme.card} p-4 space-y-3`}>{children}</div>;
}

function AddSkillInput({ addSkill, theme }) {
  const [skill, setSkill] = useState("");
  return (
    <div className="flex gap-2">
      <input
        placeholder="Add a skill (e.g. React, Node.js)"
        className={theme.input}
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
      />
      <button
        className={theme.button}
        onClick={() => {
          addSkill(skill.trim());
          setSkill("");
        }}
      >
        Add
      </button>
    </div>
  );
}
