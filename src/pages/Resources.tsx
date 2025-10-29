import { useEffect, useState } from "react";
import TreeNode from "../components/TreeNode";
import { Link } from "react-router-dom";

type Resource = {
  title: string;
  url: string;
  platform?: string;
  channel?: string;
  resource_type?: string;
  authors?: string[];
  language?: string;
};

type Node = {
  name: string;
  children?: Node[];
  resources?: Resource[];
};

export default function Resources() {
  const [data, setData] = useState<Node | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/resources.json")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <div className="text-red-300 p-4">{error}</div>;
  if (!data) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="text-white max-w-6xl mx-auto border-x border-white/10 min-h-screen px-4 sm:px-10 py-4 sm:py-6 min-h-screen min-w-screen">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-10">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight hover:scale-105 transition-all"
        >
          Optima
        </Link>
        <nav className="flex items-center gap-3 text-sm overflow-x-auto whitespace-nowrap">
          <Link
            className="text-white/80 hover:text-white hover:scale-105 transition-all"
            to="/"
          >
            Home
          </Link>
          <Link
            className="text-white/80 hover:text-white hover:scale-105 transition-all"
            to="/resources"
          >
            Resources
          </Link>
          <Link
            className="text-white/80 hover:text-white hover:scale-105 transition-all"
            to="/graph"
          >
            Graph
          </Link>
        </nav>
      </header>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{data.name}</h1>
      <div className="rounded-lg bg-white/5 border border-white/10 p-3 sm:p-4">
        <TreeNode node={data} linkClassName="text-purple-300 hover:underline" />
      </div>
    </div>
  );
}
