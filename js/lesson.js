/* Lesson & story lists + the shared typing screen.
   Typing is case-sensitive, and mistakes never block: a missed character
   is marked and the cursor keeps moving, so there is no getting stuck.
   Backspace steps back to fix a mark if she wants to. */

(() => {
  const textEl = () => document.getElementById("lesson-text");
  const titleEl = () => document.getElementById("lesson-title");
  const progressEl = () => document.getElementById("lesson-progress");
  const backBtn = () => document.getElementById("lesson-back");

  let lesson = null;      // current lesson/story object
  let list = [];          // the collection it came from (for Next)
  let origin = "lessons"; // screen to go back to
  let lineIdx = 0;
  let pos = 0;
  let flags = [];         // per position on this line: true=hit, false=miss
  let mistakes = 0;       // cumulative wrong keystrokes this lesson
  let typedTotal = 0;     // cumulative keystrokes this lesson
  let startedAt = 0;      // set on the first keystroke
  let keyboardBuilt = false;

  function allLessons() {
    return LESSONS.concat(Content.setsAsLessons());
  }

  /* ---------- Lists (lessons and stories share a look) ---------- */
  function renderInto(el, items, from) {
    el.innerHTML = "";
    items.forEach((l, i) => {
      const stars = App.progress.lessonStars[l.id] || 0;
      const btn = document.createElement("button");
      btn.className = "lesson-item";
      btn.innerHTML = `
        <span class="lesson-emoji">${l.emoji}</span>
        <span>
          <span class="lesson-name">${i + 1}. ${Content.esc(l.name)}</span>
          <span class="lesson-keys">${Content.esc(l.keys)}</span>
        </span>
        <span class="lesson-stars">${"⭐".repeat(stars) || "☆☆☆"}</span>`;
      btn.addEventListener("click", () => start(l, from, items));
      el.appendChild(btn);
    });
  }

  function renderLessonList() {
    renderInto(document.getElementById("lesson-list"), allLessons(), "lessons");
  }

  function renderStoryList() {
    renderInto(document.getElementById("story-list"), Content.allStories(), "stories");
  }

  /* ---------- Play ---------- */
  function start(l, from, items) {
    lesson = l;
    origin = from;
    list = items;
    lineIdx = 0;
    mistakes = 0;
    typedTotal = 0;
    startedAt = 0;
    backBtn().dataset.goto = from;
    backBtn().textContent = from === "stories" ? "⬅ Stories" : "⬅ Lessons";
    startLine();
    App.goto("lesson");
  }

  function startLine() {
    pos = 0;
    flags = [];
    titleEl().textContent = `${lesson.emoji} ${lesson.name}`;
    render();
    updateStats();
  }

  function line() { return lesson.lines[lineIdx]; }

  function liveStats() {
    const correct = typedTotal - mistakes;
    const minutes = startedAt ? (performance.now() - startedAt) / 60000 : 0;
    return {
      wpm: minutes > 0 ? Math.round((correct / 5) / minutes) : 0,
      accuracy: typedTotal > 0 ? Math.round((correct / typedTotal) * 100) : 100,
    };
  }

  function updateStats() {
    let txt = `Line ${lineIdx + 1} / ${lesson.lines.length}`;
    if (typedTotal >= 5) {
      const s = liveStats();
      txt += ` · ${s.wpm} WPM · ${s.accuracy}%`;
    }
    progressEl().textContent = txt;
  }

  function render() {
    const chars = line().split("").map((ch, i) => {
      const shown = Content.esc(ch);
      if (i === pos) return `<span class="current">${shown}</span>`;
      if (i < pos) {
        return flags[i]
          ? `<span class="done">${shown}</span>`
          : `<span class="miss">${shown}</span>`;
      }
      return `<span class="todo">${shown}</span>`;
    });
    textEl().innerHTML = chars.join("");
    Keyboard.highlight(line()[pos]);
  }

  function handleKey(e) {
    if (!lesson) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (pos > 0) {
        pos--;
        flags[pos] = undefined;
        render();
      }
      return;
    }

    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();
    if (!startedAt) startedAt = performance.now();

    const want = line()[pos];
    const ok = e.key === want;
    typedTotal++;
    if (ok) {
      Sound.type();
    } else {
      Sound.clunk();
      mistakes++;
    }
    Keyboard.flash(ok ? want : e.key, ok);
    flags[pos] = ok;
    pos++;

    if (pos >= line().length) {
      finishLine();
    } else {
      render();
      updateStats();
    }
  }

  function finishLine() {
    lineIdx++;
    if (lineIdx < lesson.lines.length) {
      Sound.ding();
      startLine();
    } else {
      finishLesson();
    }
  }

  function finishLesson() {
    const { wpm, accuracy } = liveStats();
    const stars = accuracy >= 96 ? 3 : accuracy >= 88 ? 2 : 1;

    const prev = App.progress.lessonStars[lesson.id] || 0;
    if (stars > prev) App.progress.lessonStars[lesson.id] = stars;
    if (wpm > App.progress.bestWpm) App.progress.bestWpm = wpm;
    App.recordPractice();
    App.save();

    Sound.win();
    App.confetti(stars * 30);

    const idx = list.indexOf(lesson);
    const next = list[idx + 1];
    const finished = lesson;
    const from = origin;
    const items = list;
    const listRefresh = from === "stories" ? renderStoryList : renderLessonList;

    App.showResult({
      emoji: stars === 3 ? "🌟" : "🎉",
      title: stars === 3 ? "Perfect!" : "Great job!",
      stars,
      detail: `${accuracy}% accuracy at ${wpm} words per minute.`,
      again: () => start(finished, from, items),
      next: next
        ? () => start(next, from, items)
        : () => { listRefresh(); App.goto(from); },
    });
    lesson = null;
    Keyboard.clear();
  }

  /* ---------- Wire up ---------- */
  App.onEnter("lessons", renderLessonList);
  App.onEnter("stories", renderStoryList);
  App.onEnter("lesson", () => {
    if (!keyboardBuilt) {
      Keyboard.build(document.getElementById("keyboard"));
      keyboardBuilt = true;
    }
    if (lesson) render();
  });
  App.onLeave("lesson", () => { lesson = null; Keyboard.clear(); });
  App.onKey("lesson", handleKey);
})();
