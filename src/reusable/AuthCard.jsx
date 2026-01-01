import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AuthCard({
  title,
  buttonText,
  linkText,
  linkTo,
  linkLabel,
  onSubmit,
  children,
}) {
     const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const goToUserPage = () => {
    if (!username) return;
    navigate(`/portfolios/${username}`);
  };
  return (
    <div
      className="
      mt-10 sm:w-full sm:max-w-sm
      rounded-2xl px-6 py-10
      bg-slate-900/80 backdrop-blur
      border border-white/10 shadow-xl
    "
    >
      <h2 className="text-center text-2xl font-bold text-white mb-6">
        {title}
      </h2>
      <form onSubmit={onSubmit} className="space-y-5">
        {children}
        <button
          type="submit"
          className="w-full rounded-lg py-2
            bg-indigo-500 text-white font-semibold
            hover:bg-indigo-400 transition
            "
        >
          {buttonText}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-400">
        {linkLabel}
        <Link
          to={linkTo}
          className="ml-1 font-semibold text-cyan-400 hover:underline"
        >
          {linkText}
        </Link>
      </p>
      <div className="my-6 h-px bg-white/10" />
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="
            w-full rounded-lg
            bg-slate-800/70 px-3 py-2
            text-gray-100 placeholder-gray-500
            border border-white/10
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={goToUserPage}
          className="
            w-full rounded-lg py-2
            border border-indigo-400
            text-indigo-400 font-medium
            hover:bg-indigo-400 hover:text-white
            transition"
        >
          Go to profile
        </button>
      </div>
    </div>
  );
}
