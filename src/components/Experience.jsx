import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import usePortfolio from "../hooks/usePortfolio";

export default function Experience({ data }) {
  const { updatePortfolio, loading } = usePortfolio({
    Uname: localStorage.getItem("pun"),
  });

  const [experience, setExperience] = useState([]);

  useEffect(() => {
    setExperience(data.experience || []);
  }, [data.experience]);

  const addExperience = async () => {
    const updated = [
      ...experience,
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ];
    setExperience(updated);
    await updatePortfolio({ experience: updated });
  };

  const updateField = async (i, key, value) => {
    const updated = [...experience];
    updated[i][key] = value;
    setExperience(updated);
    await updatePortfolio({ experience: updated });
  };

  const removeItem = async (i) => {
    const updated = experience.filter((_, idx) => idx !== i);
    setExperience(updated);
    await updatePortfolio({ experience: updated });
  };

  return (
    <section className="section">
      <h2 className="title">Experience</h2>

      <div className="space-y-4">
        {experience.map((exp, i) => (
          <div key={i} className="card">
            <input
              className="input"
              placeholder="Company"
              value={exp.company}
              onChange={(e) =>
                updateField(i, "company", e.target.value)
              }
            />
            <input
              className="input"
              placeholder="Role"
              value={exp.role}
              onChange={(e) =>
                updateField(i, "role", e.target.value)
              }
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                className="input"
                value={exp.startDate?.slice(0, 10)}
                onChange={(e) =>
                  updateField(i, "startDate", e.target.value)
                }
              />
              <input
                type="date"
                className="input"
                value={exp.endDate?.slice(0, 10)}
                onChange={(e) =>
                  updateField(i, "endDate", e.target.value)
                }
              />
            </div>

            <textarea
              rows={3}
              className="input"
              placeholder="Description"
              value={exp.description}
              onChange={(e) =>
                updateField(i, "description", e.target.value)
              }
            />

            <button
              onClick={() => removeItem(i)}
              className="del-btn flex flex-col justify-center items-center"
            >
              <Trash2 size={16} /> Remove
            </button>
          </div>
        ))}
      </div>

      <button onClick={addExperience} className="add-btn">
        <Plus size={16} /> Add Experience
      </button>
    </section>
  );
}
