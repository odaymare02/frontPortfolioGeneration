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
import Loading from "../components/Loading";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const TABS = [
  { name: "About", component: About },
  { name: "Skills", component: Skills },
  { name: "Projects", component: Projects },
  { name: "Experience", component: Experience },
  { name: "Education", component: Education },
  { name: "Certificates", component: Certificates },
  // { name: "Links", component: Links },
  { name: "Themes", component: ThemeSelector },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("About");
  const { portfolio, loading, error } = usePortfolio({
    Uname: localStorage.getItem("pun"),
  });
  const navigate = useNavigate();

  if (loading) return <p><Loading/></p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const ActiveComponent = TABS.find((tab) => tab.name === activeTab)?.component;

  const handleLogout = () => {
    localStorage.removeItem("pun");
    localStorage.removeItem("ptoken");
    navigate("/");
  };

  const handleGetPublicLink = () => {
    const publicLink = `${window.location.origin}/portfolios/${localStorage.getItem("pun")}`;
    navigator.clipboard.writeText(publicLink);
     MySwal.fire({
      icon: 'success',
      title: 'Public link copied to clipboard!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Tabs + action buttons */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
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

        {/* Get Public Link */}
        <button
          onClick={handleGetPublicLink}
          className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Get Public Link
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Active content */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        {ActiveComponent && <ActiveComponent data={portfolio} />}
      </div>
    </div>
  );
}
