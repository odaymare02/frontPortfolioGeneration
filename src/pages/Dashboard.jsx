import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePortfolio from "../hooks/usePortfolio";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Education from "../components/Education";
import Certificates from "../components/Certificates";
import Links from "../components/Links";
import ThemeSelector from "../components/ThemeSelector";

const TABS = [
  { name: "About", component: About },
  { name: "Skills", component: Skills },
  { name: "Projects", component: Projects },
  { name: "Experience", component: Experience },
  { name: "Education", component: Education },
  { name: "Certificates", component: Certificates },
  { name: "Links", component: Links },
  { name: "Themes", component: ThemeSelector },
  // Preview will be handled differently
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("About");
  const { portfolio, loading, error } = usePortfolio({
    Uname: localStorage.getItem("pun"),
  });
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const ActiveComponent = TABS.find((tab) => tab.name === activeTab)?.component;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.name
                ? "bg-indigo-500 text-white"
                : "bg-white text-gray-700 hover:bg-indigo-100"
            }`}
          >
            {tab.name}
          </button>
        ))}

        {/* Preview button */}
        <button
          onClick={() => navigate("preview")}
          className="px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition"
        >
          Preview
        </button>
      </div>

      {/* Active content */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        {ActiveComponent && <ActiveComponent data={portfolio} />}
      </div>
    </div>
  );
}
