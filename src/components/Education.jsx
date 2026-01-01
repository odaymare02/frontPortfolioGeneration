import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import usePortfolio from "../hooks/usePortfolio";

export default function Education({ data }) {
  const { updatePortfolio } = usePortfolio({
    Uname: localStorage.getItem("pun"),
  });

  const [education, setEducation] = useState([]);

  useEffect(() => {
    setEducation(data.education || []);
  }, [data.education]);

  const addEducation = async () => {
    const updated = [
      ...education,
      {
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ];
    setEducation(updated);
    await updatePortfolio({ education: updated });
  };

  const updateField = async (i, key, value) => {
    const updated = [...education];
    updated[i][key] = value;
    setEducation(updated);
    await updatePortfolio({ education: updated });
  };

  const removeItem = async (i) => {
    const updated = education.filter((_, idx) => idx !== i);
    setEducation(updated);
    await updatePortfolio({ education: updated });
  };

  return (
    <section className="section">
      <h2 className="title">Education</h2>

      {education.map((ed, i) => (
        <div key={i} className="card">
          <input
            className="input"
            placeholder="Institution"
            value={ed.institution}
            onChange={(e) =>
              updateField(i, "institution", e.target.value)
            }
          />
          <input
            className="input"
            placeholder="Degree"
            value={ed.degree}
            onChange={(e) =>
              updateField(i, "degree", e.target.value)
            }
          />

          <textarea
            className="input"
            placeholder="Description"
            value={ed.description}
            onChange={(e) =>
              updateField(i, "description", e.target.value)
            }
          />

          <button
            onClick={() => removeItem(i)}
            className="del-btn"
          >
            <Trash2 size={16} /> Remove
          </button>
        </div>
      ))}

      <button onClick={addEducation} className="add-btn">
        <Plus size={16} /> Add Education
      </button>
    </section>
  );
}
