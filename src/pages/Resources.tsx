import { useEffect, useState } from "react";
import TreeNode from "../components/TreeNode";
import Header from "../components/Header";

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
    <div className="text-white max-w-6xl mx-auto border-x border-white/10 min-h-screen px-4 sm:px-10 py-4 sm:py-6">
      <Header />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 mt-5">{data.name}</h1>
      <div className="rounded-lg bg-white/5 border border-white/10 p-3 sm:p-4 overflow-x-auto overflow-y-auto sm:overflow-visible max-h-[70vh] sm:max-h-none">
        <TreeNode node={data} linkClassName="text-purple-300 hover:underline" />
      </div>
    </div>
  );
}
