import { useEffect, useMemo, useState } from "react";

const INITIAL_ARTICLES = [
  {
    id: 1,
    title: "The Future of Artificial Intelligence",
    content:
      "Artificial intelligence is transforming industries across the globe. From healthcare to finance, AI is making processes more efficient and creating new opportunities for innovation.",
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions",
    content:
      "Renewable energy sources like solar and wind power are becoming increasingly important as we work towards a more sustainable future. These technologies help reduce our carbon footprint.",
  },
  {
    id: 3,
    title: "Web Development Trends 2024",
    content:
      "Modern web development continues to evolve with new frameworks and tools. React, Vue, and Angular remain popular choices for building dynamic user interfaces.",
  },
  {
    id: 4,
    title: "Machine Learning in Healthcare",
    content:
      "Machine learning algorithms are being used to analyze medical data and assist in diagnosis. This technology has the potential to revolutionize patient care and treatment outcomes.",
  },
  {
    id: 5,
    title: "Cybersecurity Best Practices",
    content:
      "Protecting digital assets requires robust cybersecurity measures. Regular updates, strong passwords, and employee training are essential components of a good security strategy.",
  },
];

// ---------- Helpers ----------
const STORAGE_KEY = "starredArticleIds";

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildQueryRegex(raw) {
  const q = (raw || "").trim();
  if (!q) return null;
  const tokens = q.split(/\s+/).filter(Boolean).map(escapeRegExp);
  if (!tokens.length) return null;
  return new RegExp(`(${tokens.join("|")})`, "gi");
}

// ---------- App ----------
export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [starred, setStarred] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return new Set(saved);
    } catch {
      return new Set();
    }
  });
  const [showOnlyStarred, setShowOnlyStarred] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...starred]));
  }, [starred]);

  const toggleStar = (id) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const regex = useMemo(() => buildQueryRegex(searchTerm), [searchTerm]);

  const filteredAndSorted = useMemo(() => {
    let list = INITIAL_ARTICLES;

    if (regex) {
      list = list.filter((a) => regex.test(a.title) || regex.test(a.content));
    }

    if (showOnlyStarred) {
      list = list.filter((a) => starred.has(a.id));
    }

    const withIndex = list.map((a, idx) => ({ a, idx }));
    withIndex.sort((l, r) => {
      const s1 = starred.has(l.a.id) ? 1 : 0;
      const s2 = starred.has(r.a.id) ? 1 : 0;
      if (s1 !== s2) return s2 - s1; 
      return l.idx - r.idx; 
    });

    return withIndex.map((x) => x.a);
  }, [regex, showOnlyStarred, starred]);

  const highlightText = (text, rx) => {
    if (!rx || !text) return text;
    const parts = String(text).split(rx); 
    return parts.map((part, i) =>
      rx.test(part) ? (
        <mark key={i} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Text Search Application
          </h1>
          <p className="text-gray-600">
            Search through articles, highlight matches, and star your favorites
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
            <div className="absolute right-3 top-3">
             
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOnlyStarred(false)}
              className={`px-4 py-2 rounded-lg border transition ${
                !showOnlyStarred
                  ? "bg-blue-50 text-blue-700 border-blue-500"
                  : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
              }`}
              aria-pressed={!showOnlyStarred}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setShowOnlyStarred(true)}
              className={`px-4 py-2 rounded-lg border transition ${
                showOnlyStarred
                  ? "bg-blue-50 text-blue-700 border-blue-500"
                  : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
              }`}
              aria-pressed={showOnlyStarred}
              title="Show only starred articles"
            >
              ★ Starred
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            {filteredAndSorted.length} article
            {filteredAndSorted.length !== 1 ? "s" : ""} found
            {searchTerm && ` for "${searchTerm}"`}
            {showOnlyStarred && " • filtering: Starred"}
          </p>
        </div>

        <div className="space-y-6">
          {filteredAndSorted.map((article) => {
            const isStarred = starred.has(article.id);
            const isOpen = selectedArticle?.id === article.id;

            return (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex-1">
                    {highlightText(article.title, regex)}
                  </h2>

                
                 <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    toggleStar(article.id);
  }}
  title={isStarred ? "Remove from favorites" : "Add to favorites"}
  className="p-2 hover:bg-opacity-20 rounded-full transition-colors"
>
  <svg 
    className={`w-6 h-6 transition-all duration-200 ${
      isStarred 
        ? 'fill-yellow-400 scale-110' 
        : 'fill-gray-300 hover:fill-gray-400 hover:scale-105'
    }`} 
    viewBox="0 0 24 24"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
</button>

                </div>

                <p
                  className="text-gray-700 leading-relaxed cursor-pointer"
                  onClick={() => setSelectedArticle(isOpen ? null : article)}
                  title={isOpen ? "Collapse" : "Expand"}
                >
                  {highlightText(article.content, regex)}
                </p>

                {isOpen && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Full Content:
                    </h3>
                    <p className="text-gray-800">{article.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-900 mb-4">
              <svg
                className="w-16 h-16 mx-auto text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.86-6.12 2.28l-.88.88a9 9 0 1112.24 0l-.88-.88A7.962 7.962 0 0012 15z"
                />
              </svg>
            </div>
            <p className="text-gray-800 text-lg">
              No articles found
              {searchTerm && ` matching "${searchTerm}"`}
              {showOnlyStarred && " in Starred"}
            </p>
            <p className="text-gray-600">
              Try different keywords or turn off filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
