import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import usePortfolio from "../hooks/usePortfolio";

export default function Education({ data }) {
  const { updatePortfolio } = usePortfolio({
    Uname: localStorage.getItem("pun"),
  });

  const [education, setEducation] = useState([]);

  useEffect(() => {
    if (data?.education) {
      setEducation(data.education);
    }
  }, [data]);

  const syncBackend = async (updated) => {
    await updatePortfolio({ education: updated });
  };

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
    await syncBackend(updated);
  };

  const updateLocal = (i, key, value) => {
    const updated = [...education];
    updated[i][key] = value;
    setEducation(updated);
  };

  const saveField = async () => {
    await syncBackend(education);
  };

  const removeItem = async (i) => {
    const updated = education.filter((_, idx) => idx !== i);
    setEducation(updated);
    await syncBackend(updated);
  };

  return (
    <section className="section">
      <h2 className="title">Education</h2>

      {education.map((ed, i) => (
        <div key={i} className="card space-y-2">
          <input
            className="input"
            placeholder="Institution Name"
            value={ed.institution || ""}
            onChange={(e) =>
              updateLocal(i, "institution", e.target.value)
            }
            onBlur={saveField}
          />

          <input
            className="input"
            placeholder="Degree / Field of Study"
            value={ed.degree || ""}
            onChange={(e) =>
              updateLocal(i, "degree", e.target.value)
            }
            onBlur={saveField}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="date"
              className="input"
              value={ed.startDate ? ed.startDate.slice(0, 10) : ""}
              onChange={(e) =>
                updateLocal(i, "startDate", e.target.value)
              }
              onBlur={saveField}
            />

            <input
              type="date"
              className="input"
              value={ed.endDate ? ed.endDate.slice(0, 10) : ""}
              onChange={(e) =>
                updateLocal(i, "endDate", e.target.value)
              }
              onBlur={saveField}
            />
          </div>

          <textarea
            className="input"
            placeholder="Description (optional)"
            value={ed.description || ""}
            onChange={(e) =>
              updateLocal(i, "description", e.target.value)
            }
            onBlur={saveField}
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
