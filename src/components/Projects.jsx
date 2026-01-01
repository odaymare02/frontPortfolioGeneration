import { useEffect, useState } from "react";
import { Plus, Trash2, Image } from "lucide-react";
import usePortfolio from "../hooks/usePortfolio";

export default function Projects({ data }) {
  const {
    updatePortfolio,
    uploadProjectImage,
    loading,
  } = usePortfolio({ Uname: localStorage.getItem("pun") });

  /* ✅ LOCAL STATE */
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(data.projects || []);
  }, [data.projects]);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    link: "",
  });

  /* ---------------- ADD ---------------- */
  const addProject = async () => {
    if (!newProject.name.trim()) return;

    const updated = [...projects, newProject];
    setProjects(updated); // 👈 يظهر فورًا

    setNewProject({ name: "", description: "", link: "" });

    await updatePortfolio({ projects: updated });
  };

  /* ---------------- REMOVE ---------------- */
  const removeProject = async (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);

    await updatePortfolio({ projects: updated });
  };

  /* ---------------- UPDATE FIELD ---------------- */
  const updateField = async (index, key, value) => {
    const updated = [...projects];
    updated[index][key] = value;

    setProjects(updated);
    await updatePortfolio({ projects: updated });
  };

  /* ---------------- UPLOAD IMAGE ---------------- */
  const uploadImage = async (projectId, file) => {
    if (!file) return;

    const res = await uploadProjectImage(projectId, file);

    // 🔥 sync local state with backend result
    setProjects(res.projects);
  };

  return (
    <section className="bg-slate-900/70 p-6 rounded-2xl space-y-6 border border-white/10">

      <h2 className="text-xl font-semibold text-white">Projects</h2>

      <div className="space-y-4">
        {projects.map((project, i) => (
          <div
            key={project._id || i}
            className="p-4 rounded-xl bg-slate-800/60 space-y-3 "
          >
            {/* IMAGE DISPLAY */}
            {project.image && (
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-60 object-cover rounded-lg"
              />
            )}

            <input
              value={project.name}
              onChange={(e) =>
                updateField(i, "name", e.target.value)
              }
              className="input"
              placeholder="Project name"
            />

            <textarea
              value={project.description}
              onChange={(e) =>
                updateField(i, "description", e.target.value)
              }
              rows={3}
              className="input"
              placeholder="Description"
            />

            <input
              value={project.link}
              onChange={(e) =>
                updateField(i, "link", e.target.value)
              }
              className="input"
              placeholder="Project link"
            />

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-indigo-400 cursor-pointer">
                <Image size={16} />
                Upload image
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    uploadImage(project._id, e.target.files[0])
                  }
                />
              </label>

              <button
                onClick={() => removeProject(i)}
                className="text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD NEW */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <input
          value={newProject.name}
          onChange={(e) =>
            setNewProject({ ...newProject, name: e.target.value })
          }
          className="input"
          placeholder="Project name"
        />

        <textarea
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
          rows={2}
          className="input"
          placeholder="Description"
        />

        <input
          value={newProject.link}
          onChange={(e) =>
            setNewProject({ ...newProject, link: e.target.value })
          }
          className="input"
          placeholder="Project link"
        />

        <button
          onClick={addProject}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-white"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>
    </section>
  );
}
