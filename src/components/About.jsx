import React, { useRef, useState, useEffect } from "react";
import usePortfolio from "../hooks/usePortfolio";

export default function About({ data }) {
  const { updatePortfolio, uploadProfileImage, loading } =
    usePortfolio({ Uname: localStorage.getItem("pun") });

  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    title: "",
    about: "",
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        title: data.title || "",
        about: data.about || "",
      });
      setIsDirty(false);
    }
  }, [data]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    await updatePortfolio(form);
    setIsDirty(false);
  };

  const handleCancel = () => {
    setForm({
      name: data.name || "",
      title: data.title || "",
      about: data.about || "",
    });
    setIsDirty(false);
  };

  const handleImageClick = () => fileRef.current.click();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) await uploadProfileImage(file);
  };

  return (
    <section className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 space-y-6">

      {/* Title */}
      <h2 className="text-xl font-semibold text-white">About</h2>

      {/* Profile image */}
      <div className="flex items-center gap-6">
        <div
          onClick={handleImageClick}
          className="w-24 h-24 rounded-full overflow-hidden border border-white/20 cursor-pointer hover:opacity-80 transition"
        >
          <img
            src={data?.profileImage || "/avatar.png"}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm text-gray-400">Profile photo</p>
          <button
            onClick={handleImageClick}
            className="text-indigo-400 text-sm hover:underline"
          >
            { loading? "changing...":"Change photo"}
          </button>

          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Full name */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Full Name</label>
        <input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={loading}
          className="w-full rounded-lg bg-slate-800/70 px-4 py-2
            text-white border border-white/10
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">
          Professional Title
        </label>
        <input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          disabled={loading}
          className="w-full rounded-lg bg-slate-800/70 px-4 py-2
            text-white border border-white/10
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* About */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">About You</label>
        <textarea
          value={form.about}
          onChange={(e) => handleChange("about", e.target.value)}
          disabled={loading}
          rows={5}
          className="w-full rounded-lg bg-slate-800/70 px-4 py-2
            text-white border border-white/10 resize-none
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Actions */}
      {isDirty && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-indigo-500 text-white rounded-lg
              hover:bg-indigo-600 disabled:opacity-50"
          >
            Save
          </button>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-5 py-2 bg-slate-700 text-white rounded-lg
              hover:bg-slate-600"
          >
            Cancel
          </button>
        </div>
      )}

    </section>
  );
}
