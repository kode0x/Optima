type Resource = {
  title: string;
  url: string;
  platform?: string;
  channel?: string;
  resource_type?: string;
  authors?: string[];
  language?: string;
  thumbnail?: string;
};

type ResourceGroup = { title: string; resources: Resource[] };

interface ResourceTableProps {
  groups: ResourceGroup[];
}

export default function ResourceTable({ groups }: ResourceTableProps) {
  if (!groups.length) return null;

  const getFavicon = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
      return `https://www.google.com/s2/favicons?domain=example.com&sz=64`;
    }
  };

  const getFormatFromUrl = (url: string) => {
    try {
      const p = new URL(url).pathname.toLowerCase();
      const m = p.match(/\.([a-z0-9]+)(?:$|\?)/);
      return m ? m[1] : 'html';
    } catch {
      return 'html';
    }
  };

  const getCategory = (r: Resource) => {
    const t = (r.resource_type || '').toLowerCase();
    const ext = getFormatFromUrl(r.url);
    if (t.includes('book') || t.includes('ebook') || ext === 'pdf' || ext === 'epub' || ext === 'mobi') return 'Book';
    if (t.includes('video') || t.includes('course') || t.includes('lecture') || ext === 'mp4' || ext === 'webm') return 'Video';
    return null;
  };

  return (
    <div className="space-y-6 mt-4">
      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="text-xl font-semibold mb-3">{group.title}</h2>
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="min-w-full divide-y divide-white/10 bg-white/5">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300">Resource</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300">Platform</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300">Authors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {group.resources.map((resource, index) => (
                  <tr key={index} className="hover:bg-white/10">
                    <td className="px-4 py-2">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3">
                        <img src={resource.thumbnail || getFavicon(resource.url)} alt="" className="h-6 w-6 rounded mt-0.5" loading="lazy" />
                        <span className="text-purple-300 hover:underline">{resource.title}</span>
                      </a>
                      <div className="mt-1 ml-9 flex flex-wrap items-center gap-2">
                        {(() => {
                          const category = getCategory(resource);
                          return category ? (
                            <span className="inline-flex items-center rounded-md bg-purple-600/20 text-purple-300 border border-purple-500/20 px-2 py-0.5 text-xs">{category}</span>
                          ) : null;
                        })()}
                        {(() => {
                          const fmt = getFormatFromUrl(resource.url);
                          return fmt !== 'html' ? (
                            <span className="inline-flex items-center rounded-md bg-white/10 text-gray-200 border border-white/10 px-2 py-0.5 text-xs uppercase">{fmt}</span>
                          ) : null;
                        })()}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-300">{resource.platform || '-'}</td>
                    <td className="px-4 py-2 text-gray-300">{resource.resource_type || '-'}</td>
                    <td className="px-4 py-2 text-gray-300">{resource.authors && resource.authors.length > 0 ? resource.authors.join(', ') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
