/* Lesson list + lesson play mode. */

(() => {
  const listEl = () => document.getElementById("lesson-list");
  const textEl = () => document.getElementById("lesson-text");
  const titleEl = () => document.getElementById("lesson-title");
  const progressEl = () => document.getElementById("lesson-progress");

  let lesson = null;      // current lesson object
  let lineIdx = 0;        // which line of the lesson
  let pos = 0;            // position within the line
  let mistakes = 0;
  let typedTotal = 0;
  let wrongHere = false;  // current char was missed at least once
  let keyboardBuilt = false;

  /* ---------- Lesson list ---------- */
  function renderList() {
    const el = listEl();
    el.innerHTML = "";
    LESSONS.forEach((l, i) => {
      const stars = App.progress.lessonStars[l.id] || 0;
      const btn = document.createElement("button");
      btn.className = "lesson-item";
      btn.innerHTML = `
        <span class="lesson-emoji">${l.emoji}</span>
        <span>
          <span class="lesson-name">${i + 1}. ${l.name}</span>
          <span class="lesson-keys">Keys: ${l.keys}</span>
        </span>
        <span class="lesson-stars">${"⭐".repeat(stars) || "☆☆☆"}</span>`;
      btn.addEventListener("click", () => start(l));
      el.appendChild(btn);
    });
  }

  /* ---------- Lesson play ---------- */
  function start(l) {
    lesson = l;
    lineIdx = 0;
    mistakes = 0;
    typedTotal = 0;
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
      const shown = ch === " " ? "&nbsp;" : ch;
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
    const got = e.key.toLowerCase();
    typedTotal++;

    if (got === want) {
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
      Keyboard.flash(got, false);
      Sound.wrong();
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
    const stars = accuracy >= 95 ? 3 : accuracy >= 85 ? 2 : 1;

    const prev = App.progress.lessonStars[lesson.id] || 0;
    if (stars > prev) {
      App.progress.lessonStars[lesson.id] = stars;
      App.save();
    }

    Sound.win();
    App.confetti(stars * 30);

    const idx = LESSONS.indexOf(lesson);
    const nextLesson = LESSONS[idx + 1];
    const finished = lesson;

    App.showResult({
      emoji: stars === 3 ? "🌟" : "🎉",
      title: stars === 3 ? "Perfect!" : "Great job!",
      stars,
      detail: `You typed with ${accuracy}% accuracy!`,
      again: () => start(finished),
      next: nextLesson
        ? () => start(nextLesson)
        : () => { renderList(); App.goto("lessons"); },
    });
    lesson = null;
    Keyboard.clear();
  }

  /* ---------- Wire up ---------- */
  App.onEnter("lessons", renderList);
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
