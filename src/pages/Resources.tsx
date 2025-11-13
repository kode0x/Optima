import { useEffect, useState } from "react";
import TreeNode from "../components/TreeNode";
import Header from "../components/Header";
import ResourceGrid from "../components/ResourceGrid";
import ResourceList from "../components/ResourceList";
import ResourceTable from "../components/ResourceTable";

export type Resource = {
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

type ViewMode = 'tree' | 'grid' | 'list' | 'table';

function collectAllResources(node: Node): Resource[] {
  let resources: Resource[] = [];
  
  if (node.resources) {
    resources = [...resources, ...node.resources];
  }
  
  if (node.children) {
    for (const child of node.children) {
      resources = [...resources, ...collectAllResources(child)];
    }
  }
  
  return resources;
}

type ResourceGroup = { title: string; resources: Resource[] };

function collectGroupsByTopic(root: Node): ResourceGroup[] {
  const groups: ResourceGroup[] = [];
  // If root itself has resources, add them under root name
  if (root.resources && root.resources.length > 0) {
    groups.push({ title: root.name, resources: [...root.resources] });
  }
  if (root.children) {
    for (const child of root.children) {
      const res = collectAllResources(child);
      if (res.length > 0) {
        groups.push({ title: child.name, resources: res });
      }
    }
  }
  return groups;
}

export default function Resources() {
  const [data, setData] = useState<Node | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [groups, setGroups] = useState<ResourceGroup[]>([]);

  useEffect(() => {
    fetch("/resources.json")
      .then((r) => r.json())
      .then((data) => {
        setData(data);
        setGroups(collectGroupsByTopic(data));
      })
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <div className="text-red-300 p-4">{error}</div>;
  if (!data) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="text-white max-w-6xl mx-auto border-x border-white/10 min-h-screen px-4 sm:px-10 py-4 sm:py-6">
      <Header />
      <div className="flex justify-between items-center mb-4 mt-5">
        <h1 className="text-2xl sm:text-3xl font-bold">{data.name}</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === 'tree' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Tree View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === 'grid' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Comfortable View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === 'list' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === 'table' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Table View
          </button>
        </div>
      </div>
      
      <div className="rounded-lg bg-white/5 border border-white/10 p-3 sm:p-4 overflow-x-auto overflow-y-auto sm:overflow-visible max-h-[70vh] sm:max-h-none">
        {viewMode === 'tree' && (
          <TreeNode node={data} linkClassName="text-purple-300 hover:underline" />
        )}
        {viewMode === 'grid' && (
          <ResourceGrid groups={groups} />
        )}
        {viewMode === 'list' && (
          <ResourceList groups={groups} />
        )}
        {viewMode === 'table' && (
          <ResourceTable groups={groups} />
        )}
      </div>
    </div>
  );
}
