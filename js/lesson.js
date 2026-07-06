/* Lesson & story lists + the shared typing screen.
   Typing is case-sensitive: capitals and punctuation must match. */

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
  let mistakes = 0;
  let typedTotal = 0;
  let wrongHere = false;
  let startedAt = 0;
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
    startedAt = performance.now();
    backBtn().dataset.goto = from;
    backBtn().textContent = from === "stories" ? "⬅ Stories" : "⬅ Lessons";
    startLine();
    App.goto("lesson");
  }

  function startLine() {
    pos = 0;
    wrongHere = false;
    titleEl().textContent = `${lesson.emoji} ${lesson.name}`;
    progressEl().textContent = `Line ${lineIdx + 1} / ${lesson.lines.length}`;
    render();
  }

  function line() { return lesson.lines[lineIdx]; }

  function render() {
    const chars = line().split("").map((ch, i) => {
      const shown = Content.esc(ch);
      if (i < pos) return `<span class="done">${shown}</span>`;
      if (i === pos) {
        const cls = wrongHere ? "current wrong" : "current";
        return `<span class="${cls}">${shown}</span>`;
      }
      return `<span class="todo">${shown}</span>`;
    });
    textEl().innerHTML = chars.join("");
    Keyboard.highlight(line()[pos]);
  }

  function handleKey(e) {
    if (!lesson) return;
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();

    const want = line()[pos];
    typedTotal++;

    if (e.key === want) {
      Keyboard.flash(want, true);
      Sound.key();
      pos++;
      wrongHere = false;
      if (pos >= line().length) {
        finishLine();
      } else {
        render();
      }
    } else {
      Keyboard.flash(e.key, false);
      if (App.progress.calm) Sound.soft(); else Sound.wrong();
      mistakes++;
      wrongHere = true;
      render();
    }
  }

  function finishLine() {
    lineIdx++;
    if (lineIdx < lesson.lines.length) {
      Sound.pop();
      startLine();
    } else {
      finishLesson();
    }
  }

  function finishLesson() {
    const accuracy = typedTotal === 0 ? 100 :
      Math.round(((typedTotal - mistakes) / typedTotal) * 100);
    const stars = accuracy >= 96 ? 3 : accuracy >= 88 ? 2 : 1;

    const minutes = (performance.now() - startedAt) / 60000;
    const chars = lesson.lines.join(" ").length;
    const wpm = minutes > 0 ? Math.round((chars / 5) / minutes) : 0;

    const prev = App.progress.lessonStars[lesson.id] || 0;
    if (stars > prev) App.progress.lessonStars[lesson.id] = stars;
    if (wpm > App.progress.bestWpm) App.progress.bestWpm = wpm;
    App.save();

    Sound.win();
    App.confetti(stars * 30);

    const idx = list.indexOf(lesson);
    const next = list[idx + 1];
    const finished = lesson;
    const from = origin;
    const items = list;
    const backScreen = from;
    const listRefresh = from === "stories" ? renderStoryList : renderLessonList;

    App.showResult({
      emoji: stars === 3 ? "🌟" : "🎉",
      title: stars === 3 ? "Perfect!" : "Great job!",
      stars,
      detail: `${accuracy}% accuracy at ${wpm} words per minute.`,
      again: () => start(finished, from, items),
      next: next
        ? () => start(next, from, items)
        : () => { listRefresh(); App.goto(backScreen); },
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
