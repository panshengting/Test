/* Custom content added in the For Grown-Ups area: sentence sets and stories.
   Stored separately from progress so it can be exported and imported. */

const Content = (() => {
  const KEY = "typing-stars-content";

  let data = load();

  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || "{}");
      return {
        sets: Array.isArray(d.sets) ? d.sets : [],
        stories: Array.isArray(d.stories) ? d.stories : [],
      };
    } catch {
      return { sets: [], stories: [] };
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }

  function makeId() {
    return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  /* Normalize pasted text: smart quotes and dashes become typeable keys. */
  function clean(text) {
    return String(text)
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, "-")
      .replace(/…/g, "...")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* Escape user text for safe insertion into innerHTML templates. */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* Split a story into comfortable typing lines: whole sentences,
     packed up to `max` characters per line. */
  function toLines(text, max = 62) {
    const sentences = (clean(text).match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [])
      .map((s) => s.trim()).filter(Boolean);
    const lines = [];
    let cur = "";
    for (let s of sentences) {
      while (s.length > max) {
        let cut = s.lastIndexOf(" ", max);
        if (cut < 20) cut = max;
        if (cur) { lines.push(cur); cur = ""; }
        lines.push(s.slice(0, cut).trim());
        s = s.slice(cut).trim();
      }
      if (!s) continue;
      if (!cur) cur = s;
      else if (cur.length + 1 + s.length <= max) cur += " " + s;
      else { lines.push(cur); cur = s; }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  /* ---------- Sentence sets ---------- */
  function upsertSet(set) {
    const sentences = set.sentences.map(clean).filter(Boolean);
    if (!set.name.trim() || sentences.length === 0) return null;
    const existing = data.sets.find((s) => s.id === set.id);
    if (existing) {
      existing.name = clean(set.name);
      existing.sentences = sentences;
    } else {
      data.sets.push({ id: makeId(), name: clean(set.name), sentences });
    }
    save();
    return true;
  }

  function deleteSet(id) {
    data.sets = data.sets.filter((s) => s.id !== id);
    save();
  }

  /* ---------- Stories ---------- */
  function upsertStory(story) {
    const text = clean(story.text);
    if (!story.title.trim() || !text) return null;
    const existing = data.stories.find((s) => s.id === story.id);
    if (existing) {
      existing.title = clean(story.title);
      existing.text = text;
    } else {
      data.stories.push({ id: makeId(), title: clean(story.title), text });
    }
    save();
    return true;
  }

  function deleteStory(id) {
    data.stories = data.stories.filter((s) => s.id !== id);
    save();
  }

  /* ---------- Views used by the rest of the app ---------- */

  /* Custom sentence sets shaped like lessons. */
  function setsAsLessons() {
    return data.sets.map((s) => ({
      id: "set:" + s.id,
      emoji: "✏️",
      name: s.name,
      keys: "made for you",
      lines: s.sentences,
      custom: true,
    }));
  }

  /* All stories (built-in + custom) shaped like lessons. */
  function allStories() {
    const builtIn = DEFAULT_STORIES.map((s) => ({
      id: "story:" + s.id,
      emoji: s.emoji,
      name: s.title,
      keys: "a story to type",
      lines: toLines(s.text),
    }));
    const custom = data.stories.map((s) => ({
      id: "story:" + s.id,
      emoji: "✏️",
      name: s.title,
      keys: "made for you",
      lines: toLines(s.text),
      custom: true,
    }));
    return builtIn.concat(custom);
  }

  /* ---------- Backup ---------- */
  function exportJson() {
    return JSON.stringify({ typingStars: 1, ...data }, null, 2);
  }

  function importJson(text) {
    const d = JSON.parse(text);
    if (!d || d.typingStars !== 1) throw new Error("Not a Typing Stars backup file");
    data = {
      sets: Array.isArray(d.sets) ? d.sets : [],
      stories: Array.isArray(d.stories) ? d.stories : [],
    };
    save();
  }

  return {
    get sets() { return data.sets; },
    get stories() { return data.stories; },
    upsertSet, deleteSet, upsertStory, deleteStory,
    setsAsLessons, allStories, toLines, clean, esc,
    exportJson, importJson,
  };
})();
