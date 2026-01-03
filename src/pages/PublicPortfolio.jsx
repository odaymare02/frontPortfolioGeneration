import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios"; // axios instance
import NotFound from "./NotFound";
import Loading from "../components/Loading";

export default function PublicPortfolio() {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/portfolios/${username}`)
      .then(res => setPortfolio(res.data))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <Loading/>;
  if (!portfolio) return <NotFound user={username}/>;

  const themes = {
    classic: {
      container: "bg-slate-900 text-white",
      section: "bg-slate-800/70",
      card: "bg-slate-900/70 border border-white/20",
      heading: "text-white",
      text: "text-gray-300",
      link: "text-indigo-400 hover:underline",
    },
    dark: {
      container: "bg-gray-900 text-gray-100",
      section: "bg-gray-800/70",
      card: "bg-gray-800/70 border border-gray-600/40",
      heading: "text-gray-100",
      text: "text-gray-300",
      link: "text-green-400 hover:underline",
    },
    modern: {
      container: "bg-white text-gray-900",
      section: "bg-gray-100",
      card: "bg-white border border-gray-300",
      heading: "text-gray-900",
      text: "text-gray-700",
      link: "text-indigo-500 hover:underline",
    },
  };

  const t = themes[portfolio.theme] || themes.classic;

  return (
    <div className={`container mx-auto p-6 space-y-6 ${t.container}`}>
      {/* Profile */}
      <div className="flex items-center gap-4">
        <img
          src={portfolio.profileImage}
          className="w-24 h-24 rounded-full object-cover border border-white/10"
          alt=""
        />
        <div>
          <h1 className={`text-3xl font-bold ${t.heading}`}>{portfolio.name}</h1>
          <p className="text-gray-400">{portfolio.title}</p>
        </div>
      </div>

      {/* About */}
      {portfolio.about && (
        <section className={`p-6 rounded-2xl ${t.section}`}>
          <h2 className={`text-xl font-semibold mb-2 ${t.heading}`}>About</h2>
          <p className={t.text}>{portfolio.about}</p>
        </section>
      )}

      {/* Skills */}
      {portfolio.skills?.length > 0 && (
        <section className={`p-6 rounded-2xl ${t.section}`}>
          <h2 className={`text-xl font-semibold mb-2 ${t.heading}`}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {portfolio.skills.map((s, i) => (
              <span key={i} className="bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {portfolio.projects?.length > 0 && (
        <section className={`p-6 rounded-2xl ${t.section} space-y-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${t.heading}`}>Projects</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {portfolio.projects.map((p, i) => (
              <div key={i} className={`${t.card} p-4 rounded-xl`}>
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-40 w-full object-cover rounded-lg mb-2"
                  />
                )}
                <h3 className="font-semibold">{p.name}</h3>
                <p className={t.text}>{p.description}</p>
                {p.link && (
                  <a href={p.link} target="_blank" className={t.link}>
                    Visit
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {portfolio.certificates?.length > 0 && (
        <section className={`p-6 rounded-2xl ${t.section} space-y-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${t.heading}`}>Certificates</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {portfolio.certificates.map((c, i) => (
              <div key={i} className={`${t.card} p-4 rounded-xl`}>
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-32 w-full object-cover rounded-lg mb-2"
                  />
                )}
                <h3 className="font-semibold">{c.name}</h3>
                <p className={t.text}>{c.issuer}</p>
                {c.link && (
                  <a href={c.link} target="_blank" className={t.link}>
                    Link
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {portfolio.experience?.length > 0 && (
        <section className={`p-6 rounded-2xl ${t.section} space-y-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${t.heading}`}>Experience</h2>
          {portfolio.experience.map((e, i) => (
            <div key={i} className="border-b border-white/10 pb-2 mb-2">
              <h3 className="font-semibold">{e.role} @ {e.company}</h3>
              <p className={t.text}>{new Date(e.startDate).toLocaleDateString()} - {e.endDate ? new Date(e.endDate).toLocaleDateString() : "Present"}</p>
              {e.description && <p className={t.text}>{e.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {portfolio.education?.length > 0 && (
        <section className={`p-6 rounded-2xl ${t.section} space-y-4`}>
          <h2 className={`text-xl font-semibold mb-2 ${t.heading}`}>Education</h2>
          {portfolio.education.map((ed, i) => (
            <div key={i} className="border-b border-white/10 pb-2 mb-2">
              <h3 className="font-semibold">{ed.degree} @ {ed.institution}</h3>
              <p className={t.text}>{new Date(ed.startDate).toLocaleDateString()} - {ed.endDate ? new Date(ed.endDate).toLocaleDateString() : "Present"}</p>
              {ed.description && <p className={t.text}>{ed.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Links */}
      {portfolio.links && (
        <section className={`p-6 rounded-2xl ${t.section} space-x-4`}>
          {portfolio.links.github && (
            <a href={portfolio.links.github} target="_blank" className={t.link}>
              GitHub
            </a>
          )}
          {portfolio.links.linkedin && (
            <a href={portfolio.links.linkedin} target="_blank" className={t.link}>
              LinkedIn
            </a>
          )}
          {portfolio.links.email && (
            <a href={`mailto:${portfolio.links.email}`} className={t.link}>
              Email
            </a>
          )}
          {portfolio.links.website && (
            <a href={portfolio.links.website} target="_blank" className={t.link}>
              Website
            </a>
          )}
        </section>
      )}
    </div>
  );
}
