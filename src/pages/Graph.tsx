import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Resource = { title: string; url: string };

type NodeData = {
  name: string;
  children?: NodeData[];
  resources?: Resource[];
};

type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  href?: string;
};

type GraphLink = { source: string; target: string; weight: number };

function buildGraph(root: NodeData): {
  nodes: GraphNode[];
  links: GraphLink[];
} {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  const centerX = 0;
  const centerY = 0;

  function addNode(
    id: string,
    label: string,
    size = 5,
    color = "#a78bfa",
    href?: string
  ) {
    nodes.push({
      id,
      label,
      x: centerX + (Math.random() - 0.5) * 200,
      y: centerY + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0,
      size,
      color,
      href,
    });
  }

  function walk(node: NodeData, parentId?: string) {
    const nodeId = parentId ? `${parentId}/${node.name}` : node.name;
    addNode(
      nodeId,
      node.name,
      parentId ? 5 : 8,
      parentId ? "#a78bfa" : "#22d3ee"
    );
    if (parentId) links.push({ source: parentId, target: nodeId, weight: 1 });

    if (node.children) {
      for (const child of node.children) {
        walk(child, nodeId);
      }
    }
    if (node.resources) {
      for (const r of node.resources) {
        const rid = `${nodeId}//${r.title}`;
        addNode(rid, r.title, 4, "#60a5fa", r.url);
        links.push({ source: nodeId, target: rid, weight: 0.5 });
      }
    }
  }

  walk(root);
  return { nodes, links };
}

export default function Graph() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
  } | null>(null);
  const [data, setData] = useState<NodeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/resources.json")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    if (!data) return;
    const { nodes, links } = buildGraph(data);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      const rect = wrapperRef.current!.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * devicePixelRatio);
      canvas.height = Math.floor(rect.height * devicePixelRatio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const center = {
      x: canvas.width / devicePixelRatio / 2,
      y: canvas.height / devicePixelRatio / 2,
    };

    const charge = -600;
    const linkStrength = 0.08;
    const linkDistance = 110;
    const damping = 0.85;
    const gravity = 0.01;
    const maxSpeed = 2.5;
    let alpha = 0.4;
    const alphaDecay = 0.98;
    const alphaMin = 0.02;

    const nodeSpacing = 52;

    const nodeMap = new Map(nodes.map((n) => [n.id, n] as const));

    const labelShortById = new Map<string, string>();
    const labelWidthById = new Map<string, number>();
    const measureCtx = document.createElement("canvas").getContext("2d")!;
    measureCtx.font = "11px ui-sans-serif, system-ui, -apple-system";
    for (const n of nodes) {
      const shortLabel = ellipsis(n.label, 22);
      labelShortById.set(n.id, shortLabel);
      const w = measureCtx.measureText(shortLabel).width;
      labelWidthById.set(n.id, w);
    }

    let animationId = 0;
    let running = true;

    function clamp(v: number, lo: number, hi: number) {
      return Math.max(lo, Math.min(hi, v));
    }

    let scale = 1;
    let translateX = 0;
    let translateY = 0;

    function screenToWorld(sx: number, sy: number) {
      const wx = (sx - translateX) / scale;
      const wy = (sy - translateY) / scale;
      return { x: wx, y: wy };
    }
    function worldToScreen(wx: number, wy: number) {
      const sx = wx * scale + translateX;
      const sy = wy * scale + translateY;
      return { x: sx, y: sy };
    }

    function zoomAt(sx: number, sy: number, factor: number) {
      const p = screenToWorld(sx, sy);
      const newScale = clamp(scale * factor, 0.5, 3);
      scale = newScale;
      translateX = sx - p.x * scale;
      translateY = sy - p.y * scale;
      if (!running) drawScene();
    }
    function zoomIn() {
      const rect = canvas.getBoundingClientRect();
      zoomAt(rect.width / 2, rect.height / 2, 1.2);
    }
    function zoomOut() {
      const rect = canvas.getBoundingClientRect();
      zoomAt(rect.width / 2, rect.height / 2, 1 / 1.2);
    }
    controlsRef.current = { zoomIn, zoomOut };

    const hoveredIdRef = { current: null as string | null };

    function getHoverNode(mx: number, my: number): GraphNode | null {
      const p = screenToWorld(mx, my);
      let closest: GraphNode | null = null;
      let best = Infinity;
      for (const n of nodes) {
        const dx = p.x - n.x;
        const dy = p.y - n.y;
        const d = Math.hypot(dx, dy);
        const thr = Math.max(n.size + 6, 10 / scale);
        if (d < thr && d < best) {
          best = d;
          closest = n;
        } else {
          const lw = labelWidthById.get(n.id) ?? 0;
          if (lw > 0) {
            const x1 = n.x + n.size + 2;
            const x2 = x1 + lw + 2;
            const y1 = n.y - 10;
            const y2 = n.y + 10;
            if (p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2) {
              const dd = Math.abs(p.x - x1);
              if (dd < best) {
                best = dd;
                closest = n;
              }
            }
          }
        }
      }
      return closest;
    }

    function ellipsis(s: string, max = 28) {
      if (s.length <= max) return s;
      return s.slice(0, max - 1) + "…";
    }

    function drawScene() {
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(translateX, translateY);
      ctx.scale(scale, scale);

      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1 / scale;
      ctx.beginPath();
      for (const l of links) {
        const a = nodeMap.get(l.source)!;
        const b = nodeMap.get(l.target)!;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();

      for (const n of nodes) {
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "11px ui-sans-serif, system-ui, -apple-system";
      for (const n of nodes) {
        const shortLabel = labelShortById.get(n.id) ?? ellipsis(n.label, 22);
        ctx.fillText(shortLabel, n.x + n.size + 4, n.y + 4);
      }

      ctx.restore();

      const hid = hoveredIdRef.current;
      if (hid) {
        const n = nodeMap.get(hid);
        if (n) {
          const label = n.label;
          ctx.font = "12px ui-sans-serif, system-ui, -apple-system";
          const metrics = ctx.measureText(label);
          const padX = 6;
          const padY = 4;
          let sub = "";
          if (n.href) {
            try {
              const u = new URL(n.href);
              sub = u.hostname;
            } catch (_) {
              sub = n.href;
            }
          }
          const subFont = "11px ui-sans-serif, system-ui, -apple-system";
          const subWidth = sub ? ctx.measureText(sub).width : 0;
          const lineH = 18;
          const h = (sub ? lineH * 2 : lineH) + padY * 2;
          const w = Math.max(metrics.width, subWidth) + padX * 2;
          const pt = worldToScreen(n.x + n.size + 8, n.y);
          const wScreen = canvas.width / devicePixelRatio;
          const hScreen = canvas.height / devicePixelRatio;
          const bx = Math.min(Math.max(pt.x, 8), wScreen - w - 8);
          const by = Math.min(Math.max(pt.y - h / 2, 8), hScreen - h - 8);

          ctx.fillStyle = "rgba(0,0,0,0.7)";
          ctx.fillRect(bx, by, w, h);

          ctx.fillStyle = "#fff";
          ctx.fillText(label, bx + padX, by + lineH);
          if (sub) {
            ctx.font = subFont;
            ctx.fillStyle = "#a5b4fc";
            ctx.fillText(sub, bx + padX, by + lineH * 2);
          }

          if (n.href) {
            const cpt = worldToScreen(n.x, n.y);
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.lineWidth = 2;
            ctx.arc(cpt.x, cpt.y, n.size * scale + 6, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
    }

    function step() {
      for (const l of links) {
        const a = nodeMap.get(l.source)!;
        const b = nodeMap.get(l.target)!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const aW = labelWidthById.get(a.id) ?? 0;
        const bW = labelWidthById.get(b.id) ?? 0;
        const labelPad = 16;
        const desired =
          linkDistance + (aW + bW) / 2 + labelPad + a.size + b.size;
        const force = (dist - desired) * linkStrength * l.weight * alpha;
        const nx = dx / dist;
        const ny = dy / dist;
        a.vx += force * nx;
        a.vy += force * ny;
        b.vx -= force * nx;
        b.vy -= force * ny;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist2 = dx * dx + dy * dy + 0.01;
          const force = (charge * alpha) / dist2;
          const nx = dx / Math.sqrt(dist2);
          const ny = dy / Math.sqrt(dist2);
          a.vx += -force * nx;
          a.vy += -force * ny;
          b.vx += force * nx;
          b.vy += force * ny;
        }
      }

      for (const n of nodes) {
        n.vx += (center.x - n.x) * gravity * alpha;
        n.vy += (center.y - n.y) * gravity * alpha;
        n.vx *= damping;
        n.vy *= damping;

        n.vx = clamp(n.vx, -maxSpeed, maxSpeed);
        n.vy = clamp(n.vy, -maxSpeed, maxSpeed);
        n.x += n.vx;
        n.y += n.vy;

        const pad = 16;
        const wScreen = canvas.width / devicePixelRatio;
        const hScreen = canvas.height / devicePixelRatio;
        const left = -translateX / scale;
        const right = (wScreen - translateX) / scale;
        const top = -translateY / scale;
        const bottom = (hScreen - translateY) / scale;
        n.x = clamp(n.x, left + pad, right - pad);
        n.y = clamp(n.y, top + pad, bottom - pad);
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const aW = labelWidthById.get(a.id) ?? 0;
          const bW = labelWidthById.get(b.id) ?? 0;
          const labelPad = 16;
          const minDist =
            nodeSpacing + (aW + bW) / 2 + labelPad + a.size + b.size;
          if (dist < minDist) {
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;
          }
        }
      }

      drawScene();

      alpha *= alphaDecay;
      if (alpha < alphaMin) {
        running = false;
        return;
      }
      animationId = requestAnimationFrame(step);
    }

    animationId = requestAnimationFrame(step);

    function onVisibility() {
      if (document.hidden && running) {
        cancelAnimationFrame(animationId);
      } else if (!document.hidden && !running) {
        alpha = 0.15;
        running = true;
        animationId = requestAnimationFrame(step);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    let isPanning = false;
    let lastMx = 0;
    let lastMy = 0;
    let dragging: { node: GraphNode; dx: number; dy: number } | null = null;
    let dragCandidate: { node: GraphNode; dx: number; dy: number } | null =
      null;
    let mouseDownHit: GraphNode | null = null;
    let mouseDownAt = 0;
    let mouseDownPos = { x: 0, y: 0 };

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (dragging) {
        const p = screenToWorld(mx, my);
        dragging.node.x = p.x + dragging.dx;
        dragging.node.y = p.y + dragging.dy;
        dragging.node.vx = 0;
        dragging.node.vy = 0;
        if (!running) drawScene();
        lastMx = mx;
        lastMy = my;
        return;
      }

      if (dragCandidate) {
        const moved = Math.hypot(mx - mouseDownPos.x, my - mouseDownPos.y);
        if (moved > 4) {
          dragging = dragCandidate;
          dragCandidate = null;

          alpha = 0.2;
          running = true;
          animationId = requestAnimationFrame(step);
          return;
        }
      }

      if (isPanning) {
        translateX += mx - lastMx;
        translateY += my - lastMy;
        lastMx = mx;
        lastMy = my;
        if (!running) drawScene();
        return;
      }

      const hit = getHoverNode(mx, my);
      const prev = hoveredIdRef.current;
      hoveredIdRef.current = hit ? hit.id : null;

      if (hit && hit.href) {
        canvas.style.cursor = "pointer";
      } else if (isPanning) {
        canvas.style.cursor = "grabbing";
      } else {
        canvas.style.cursor = "default";
      }
      if (prev !== hoveredIdRef.current && !running) {
        drawScene();
      }
    }

    function handleMouseDown(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      lastMx = mx;
      lastMy = my;
      const hit = getHoverNode(mx, my);
      if (hit) {
        const p = screenToWorld(mx, my);
        dragCandidate = { node: hit, dx: hit.x - p.x, dy: hit.y - p.y };
        mouseDownHit = hit;
        mouseDownAt = performance.now();
        mouseDownPos = { x: mx, y: my };
      } else {
        isPanning = true;
        canvas.style.cursor = "grabbing";
        mouseDownHit = null;
        mouseDownAt = performance.now();
        mouseDownPos = { x: mx, y: my };
      }
    }

    function handleMouseUp(e: MouseEvent) {
      dragging = null;
      dragCandidate = null;
      isPanning = false;
    }

    function handleMouseLeave() {
      const prev = hoveredIdRef.current;
      hoveredIdRef.current = null;
      if (prev && !running) drawScene();
      dragging = null;
      dragCandidate = null;
      isPanning = false;
      canvas.style.cursor = "default";
    }

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const wheel = -e.deltaY;
      const zoomFactor = Math.exp(wheel * 0.001);
      scale = clamp(scale * zoomFactor, 0.5, 3);
      const p = screenToWorld(mx, my);
      translateX = mx - p.x * scale;
      translateY = my - p.y * scale;
      if (!running) drawScene();
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener(
      "wheel",
      handleWheel as EventListener,
      { passive: false } as any
    );

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("wheel", handleWheel as EventListener);
      cancelAnimationFrame(animationId);
      controlsRef.current = null;
    };
  }, [data]);

  return (
    <div className="text-white p-6 max-w-6xl mx-auto border-x px-10 border-white/10 min-h-screen">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight hover:scale-105 transition-all"
        >
          Optima
        </Link>
        <nav className="flex items-center gap-4 text-sm">
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

      <h1 className="text-3xl font-bold mt-10 mb-4">Resources Graph</h1>
      {error && <div className="text-red-300 text-sm mb-2">{error}</div>}
      {!data && !error && (
        <div className="text-white/70 text-sm">Loading...</div>
      )}
      <div
        ref={wrapperRef}
        className="relative rounded-lg bg-white/5 border border-white/10"
        style={{ height: 520 }}
      >
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => controlsRef.current?.zoomIn()}
            className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm"
            aria-label="Zoom in"
            title="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => controlsRef.current?.zoomOut()}
            className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm"
            aria-label="Zoom out"
            title="Zoom out"
          >
            −
          </button>
        </div>
        <canvas ref={canvasRef} />
      </div>
      <ul className="text-white/60 text-xs mt-3 list-disc pl-5 space-y-1">
        <li>Drag nodes to reposition.</li>
        <li>Drag background to pan.</li>
        <li>Scroll to zoom or use the + / − controls.</li>
        <li>Hover for full labels and link host.</li>
        <li>Click resource nodes to open in a new tab.</li>
        <li>Smart label truncation and collision spacing.</li>
        <li>High-DPI canvas rendering.</li>
        <li>Auto-layout force simulation with damping.</li>
        <li>Pauses when tab is hidden to save CPU.</li>
      </ul>
    </div>
  );
}
