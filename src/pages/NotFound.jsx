import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound({user=false}) {
  const navigate = useNavigate();
  const msg=user?`The portfollio for ${user} user not found please search for another username.`:"Oops! The Page you are looking for does not exist.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">{msg}</p>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-medium transition"
      >
        <Home size={20} /> Go Home
      </button>
    </div>
  );
}
