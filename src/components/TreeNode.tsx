import { useState } from "react";

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

type Props = {
  node: Node;
  linkClassName?: string;
  onLinkHoverChange?: (hovering: boolean) => void;
};

export default function TreeNode({ node, linkClassName = "text-blue-300 hover:underline", onLinkHoverChange }: Props) {
  const [open, setOpen] = useState(false);

  const hasChildren = (node.children && node.children.length > 0) || (node.resources && node.resources.length > 0);

  return (
    <div className="ml-2 sm:ml-4">
      <button
        className="flex items-center gap-2 py-1 px-2 sm:px-3 rounded hover:bg-white/5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="w-5 text-xs opacity-70">{hasChildren ? (open ? "▾" : "▸") : "•"}</span>
        <span className="font-medium text-white break-words">{node.name}</span>
      </button>
      <div
        className={
          "ml-3 sm:ml-6 border-l border-white/10 pl-3 space-y-1 transition-all duration-300 " +
          (open ? "opacity-100 max-h-[2000px] translate-y-0" : "opacity-0 max-h-0 -translate-y-1 overflow-hidden")
        }
      >
        {node.resources && node.resources.length > 0 && (
          <ol className="list-decimal pl-4 sm:pl-5 space-y-1">
            {node.resources.map((r) => (
              <li key={r.title} className="text-[13px] sm:text-sm">
                <a
                  className={`${linkClassName} break-words`}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => onLinkHoverChange?.(true)}
                  onMouseLeave={() => onLinkHoverChange?.(false)}
                >
                  {r.title}
                </a>
                {(r.channel || (r.platform && r.platform.toLowerCase() === "youtube")) && (
                  <div className="mt-0.5 ml-1 flex items-center gap-1 text-xs text-white/60">
                    {r.platform && r.platform.toLowerCase() === "youtube" && (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 text-red-500"
                        focusable="false"
                      >
                        <path
                          fill="currentColor"
                          d="M23.5 6.2a4 4 0 0 0-2.8-2.8C18.9 3 12 3 12 3s-6.9 0-8.7.4A4 4 0 0 0 .5 6.2 41.6 41.6 0 0 0 0 12a41.6 41.6 0 0 0 .5 5.8 4 4 0 0 0 2.8 2.8C5.1 21 12 21 12 21s6.9 0 8.7-.4a4 4 0 0 0 2.8-2.8A41.6 41.6 0 0 0 24 12a41.6 41.6 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"
                        />
                      </svg>
                    )}
                    {r.channel && <span>{r.channel}</span>}
                  </div>
                )}
                {r.resource_type && r.resource_type.toLowerCase() === "pdf" && (
                  <div className="mt-0.5 ml-1 flex items-center gap-2 text-xs text-white/60">
                    <span className="inline-flex items-center rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-red-300">
                      PDF
                    </span>
                    {r.authors && r.authors.length > 0 && (
                      <span>by {r.authors.join(", ")}</span>
                    )}
                  </div>
                )}
                {r.language && (
                  <div className="mt-0.5 ml-1 flex items-center gap-2 text-xs text-white/60">
                    <span className="inline-flex items-center rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                      {r.language}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
        {node.children?.map((child) => (
          <TreeNode
            key={child.name}
            node={child}
            linkClassName={linkClassName}
            onLinkHoverChange={onLinkHoverChange}
          />
        ))}
      </div>
    </div>
  );
}

