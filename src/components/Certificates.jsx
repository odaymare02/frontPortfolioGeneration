import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Image } from "lucide-react";
import usePortfolio from "../hooks/usePortfolio";

export default function Certificates({ data }) {
  const {
    updatePortfolio,
    uploadCertificateImage,
    loading,
  } = usePortfolio({ Uname: localStorage.getItem("pun") });

  const [certs, setCerts] = useState([]);
  const fileRef = useRef(null);
  const activeCertId = useRef(null);

  // sync from parent
  useEffect(() => {
    setCerts(data?.certificates || []);
  }, [data?.certificates]);

  // add certificate (optimistic)
  const addCert = async () => {
    const updated = [
      ...certs,
      { name: "", issuer: "", link: "", image: "" },
    ];

    const res = await updatePortfolio({ certificates: updated });
    setCerts(res.certificates);
  };

  const updateField = async (id, key, value) => {
    const updated = certs.map((c) =>
      c._id === id ? { ...c, [key]: value } : c
    );

    setCerts(updated);
    await updatePortfolio({ certificates: updated });
  };

  const removeCert = async (id) => {
    const updated = certs.filter((c) => c._id !== id);
    setCerts(updated);
    await updatePortfolio({ certificates: updated });
  };

  const handleImageClick = (certId) => {
    activeCertId.current = certId;
    fileRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeCertId.current) return;

    const res = await uploadCertificateImage(activeCertId.current, file);
    setCerts(res.certificates);
  };

  return (
    <section className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white">Certificates</h2>

      {certs.map((c) => (
        <div
          key={c._id}
          className="bg-slate-800/60 border border-white/10 rounded-xl p-4 space-y-3"
        >
          {/* Image */}
          <div
            onClick={() => handleImageClick(c._id)}
            className="h-32 rounded-lg bg-slate-900/70 border border-white/10
                       flex items-center justify-center cursor-pointer
                       hover:border-indigo-400 transition"
          >
            {c.image ? (
              <img
                src={c.image}
                className="h-full w-full object-cover rounded-lg"
                alt=""
              />
            ) : (
              <Image className="text-gray-400" />
            )}
          </div>

          <input
            className="bg-slate-900/70 border border-white/10 rounded-lg px-4 py-2 text-white w-full"
            placeholder="Certificate name"
            value={c.name}
            onChange={(e) => updateField(c._id, "name", e.target.value)}
          />

          <input
            className="bg-slate-900/70 border border-white/10 rounded-lg px-4 py-2 text-white w-full"
            placeholder="Issuer"
            value={c.issuer}
            onChange={(e) => updateField(c._id, "issuer", e.target.value)}
          />

          <input
            className="bg-slate-900/70 border border-white/10 rounded-lg px-4 py-2 text-white w-full"
            placeholder="Link"
            value={c.link}
            onChange={(e) => updateField(c._id, "link", e.target.value)}
          />

          <button
            disabled={loading}
            onClick={() => removeCert(c._id)}
            className="flex items-center gap-2 text-red-400 hover:text-red-500 text-sm"
          >
            <Trash2 size={16} /> Remove
          </button>
        </div>
      ))}

      <button
        disabled={loading}
        onClick={addCert}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-indigo-600 hover:bg-indigo-700 text-white transition"
      >
        <Plus size={16} /> Add Certificate
      </button>

      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/*"
        onChange={handleImageUpload}
      />
    </section>
  );
}
