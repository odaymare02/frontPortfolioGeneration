export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        <span className="absolute inset-0 flex items-center justify-center text-indigo-400 text-sm font-medium">
          Loading...
        </span>
      </div>
    </div>
  );
}
