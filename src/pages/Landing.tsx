import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

type Node = {
  name: string;
  children?: Node[];
  resources?: { title: string; url: string }[];
};

export default function Landing() {
  const navigate = useNavigate();
  const [root, setRoot] = useState<Node | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/resources.json")
      .then((r) => r.json())
      .then(setRoot)
      .catch((e) => setError(String(e)));
  }, []);

  const topCategories = root?.children?.slice(0, 6) ?? [];

  return (
    <div className="text-white max-w-6xl mx-auto border-x border-white/10 px-4 sm:px-10 py-4 sm:py-6 min-h-screen">
      <Header />
      <section className="py-20 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">Optima</h1>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          Explore A Curated, Hierarchical Map of Machine Learning, Data Science,
          And AI Resources.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate("/resources")}
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 hover:bg-purple-500 hover:scale-105 transition-all px-6 py-3 text-sm font-medium shadow"
          >
            Get Started
          </button>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/20 px-6 py-3 text-sm font-medium hover:scale-105 transition-all"
          >
            Learn More
          </a>
        </div>
      </section>

      <section id="features" className="py-10">
        <h2 className="text-3xl font-bold mb-6">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 hover:scale-105 transition-all">
            <div className="text-lg font-semibold">Hierarchical Map</div>
            <div className="mt-1 text-white/70 text-sm">
              Navigate Categories And Subcategories Effortlessly.
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 hover:scale-105 transition-all">
            <div className="text-lg font-semibold">Interactive</div>
            <div className="mt-1 text-white/70 text-sm">
              Expand, Collapse, And Jump To Resources Quickly.
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 hover:scale-105 transition-all">
            <div className="text-lg font-semibold">Graph Visualization</div>
            <div className="mt-1 text-white/70 text-sm">
              Explore resources as an interactive graph with pan, zoom, and
              drag.
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-3xl font-bold">Preview Categories</h2>
          <button
            onClick={() => navigate("/resources")}
            className="text-sm text-purple-300 hover:text-blue-200"
          >
            View all
          </button>
        </div>
        {error && <div className="text-red-300 text-sm mb-2">{error}</div>}
        {!root && !error && (
          <div className="text-white/70 text-sm">Loading preview...</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topCategories.map((c) => {
            const resourceCount =
              (c.resources?.length ?? 0) +
              (c.children?.reduce(
                (acc, n) => acc + (n.resources?.length ?? 0),
                0
              ) ?? 0);
            return (
              <div
                key={c.name}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="text-lg font-semibold">{c.name}</div>
                <div className="text-white/70 text-sm">
                  ~{resourceCount} Resources
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-12">
        <div className="rounded-xl bg-linear-to-r from-purple-600/40 to-indigo-600/40 p-6 text-center">
          <h3 className="text-2xl font-bold">Ready To Explore?</h3>
          <p className="text-white/80 mt-1">
            Discover Tools, Tutorials, And Datasets Across AI/ML/DS
          </p>
          <button
            onClick={() => navigate("/resources")}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-white text-black hover:bg-white/90 px-6 py-3 text-sm font-medium hover:scale-105 transition-all"
          >
            Browse Resources
          </button>
        </div>
      </section>
      <footer className="border-t border-white/10 text-sm text-white/70">
        <h3 className="my-3 text-3xl font-semibold text-white ">Note</h3>
        <p className="mt-2">
          Optima is an interactive web-based platform designed to help
          individuals navigate the world of Artificial Intelligence (AI),
          Machine Learning (ML), and Data Science. The goal of Optima is to
          centralize free and accessible resources for anyone interested in
          these fields, providing a comprehensive map of tools, tutorials,
          datasets, and more all without cost.
        </p>
        <p className="mt-2">
          While some of the listed resources may require registration or offer
          additional paid data, Optima ensures that a significant portion of the
          available information is free and easily accessible. This makes Optima
          an essential resource for students, researchers, and professionals
          looking to expand their knowledge or skills in AI, ML, and data
          science without breaking the bank.
        </p>

        <div className="mt-6">
          <h4 className="font-semibold text-white">For Update Notifications</h4>
          <ul className="mt-2 space-y-1">
            <li>
              Follow me on 𝕏:{" "}
              <a
                className="text-blue-300 hover:underline"
                href="https://x.com/kode0"
                target="_blank"
                rel="noreferrer"
              >
                @kode0x
              </a>
            </li>
            <li>
              Follow me on LinkedIn:{" "}
              <a
                className="text-blue-300 hover:underline"
                href="https://www.linkedin.com/in/jyotiradityaxsingh"
                target="_blank"
                rel="noreferrer"
              >
                @jyotiradityaxsingh
              </a>
            </li>
            <li>
              Watch or star the project on GitHub:{" "}
              <a
                className="text-blue-300 hover:underline"
                href="https://github.com/kode0x/Optima"
                target="_blank"
                rel="noreferrer"
              >
                https://github.com/kode0x/Optima
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-white">
            Suggestions, Comments, Feedback
          </h4>
          <p className="mt-2">
            We greatly value your feedback and any suggestions for new tools or
            resources to include! If you have any ideas, comments, or
            improvements, we encourage you to reach out.
          </p>
          <br />
          <p>
            Your contributions help Optima grow and stay relevant, ensuring the
            platform remains a valuable resource for AI, ML, and Data Science
            enthusiasts!
          </p>
        </div>
        <div className="mt-10 text-xs text-white/50 text-center">
          {" "}
          {new Date().getFullYear()} Optima.
        </div>
      </footer>
    </div>
  );
}
