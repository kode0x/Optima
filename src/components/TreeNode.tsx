import { useState } from "react";

type Resource = {
  title: string;
  url: string;
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
    <div className="ml-4">
      <button
        className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="w-5 text-xs opacity-70">{hasChildren ? (open ? "▾" : "▸") : "•"}</span>
        <span className="font-medium text-white">{node.name}</span>
      </button>
      <div
        className={
          "ml-6 border-l border-white/10 pl-3 space-y-1 transition-all duration-300 " +
          (open ? "opacity-100 max-h-[2000px] translate-y-0" : "opacity-0 max-h-0 -translate-y-1 overflow-hidden")
        }
      >
        {node.resources && node.resources.length > 0 && (
          <ol className="list-decimal pl-5 space-y-1">
            {node.resources.map((r) => (
              <li key={r.title} className="text-sm">
                <a
                  className={linkClassName}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => onLinkHoverChange?.(true)}
                  onMouseLeave={() => onLinkHoverChange?.(false)}
                >
                  {r.title}
                </a>
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

