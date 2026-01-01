import { useEffect, useState } from "react";
import usePortfolio from "../hooks/usePortfolio";
import api from "../api/axios";

export default function ThemeSelector() {
  const Uname = localStorage.getItem("pun");
  const { portfolio, fetchPortfolio, updateTheme } = usePortfolio({ Uname });

  const [themes, setThemes] = useState([]);
  const [selected, setSelected] = useState("classic");
  const [loading, setLoading] = useState(false);

  // fetch themes from backend once
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await api.get("/portfolios/themes");
        setThemes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchThemes();
  }, []);

  // sync selected with portfolio.theme
  useEffect(() => {
    if (portfolio?.theme) {
      setSelected(portfolio.theme);
    }
  }, [portfolio?.theme]);

  // handle theme change
  const handleChange = async (e) => {
    const newTheme = e.target.value;
    setSelected(newTheme);
    setLoading(true);

    try {
      await updateTheme(newTheme);  // update backend
      await fetchPortfolio();       // fetch updated portfolio
    } catch (err) {
      console.error(err);
      // rollback if failed
      setSelected(portfolio?.theme || "classic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-white font-semibold">Theme:</label>
      <select
        value={selected}
        onChange={handleChange}
        disabled={loading || themes.length === 0}
        className="px-3 py-2 rounded-lg bg-slate-800 text-white border border-white/20"
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </option>
        ))}
      </select>
      {loading && <span className="text-gray-300 text-sm">Updating...</span>}
    </div>
  );
}
