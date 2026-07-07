/* App shell: navigation, saved progress, result popup, confetti. */

const App = (() => {
  const STORAGE_KEY = "typing-stars-progress";

  const defaults = {
    lessonStars: {},    // lesson id -> 0..3
    balloonHigh: 0,
    bestWpm: 0,
    sound: true,
    name: "Sirui",
    calm: false,        // softer colors, no flashing/confetti, gentle sounds
    speak: true,        // read each word aloud after it is typed
    streak: { count: 0, last: "" },  // consecutive practice days
  };

  let progress = load();

  function load() {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch {
      return { ...defaults };
    }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch {}
  }

  /* ---------- Navigation ---------- */
  const screens = {};
  let current = "home";
  const enterHooks = {};  // screen name -> fn called when shown
  const leaveHooks = {};  // screen name -> fn called when hidden
  const keyHooks = {};    // screen name -> fn(event) for keydown

  function goto(name) {
    if (name !== current && leaveHooks[current]) leaveHooks[current]();
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    current = name;
    screens[name].classList.add("active");
    if (enterHooks[name]) enterHooks[name]();
  }

  function onEnter(name, fn) { enterHooks[name] = fn; }
  function onLeave(name, fn) { leaveHooks[name] = fn; }
  function onKey(name, fn) { keyHooks[name] = fn; }

  /* ---------- Result popup ---------- */
  const popup = () => document.getElementById("result-popup");
  let againCb = null;
  let nextCb = null;

  function showResult({ emoji, title, stars = null, detail = "", again = null, next = null }) {
    document.getElementById("result-emoji").textContent = emoji;
    document.getElementById("result-title").textContent = title;
    document.getElementById("result-stars").textContent =
      stars === null ? "" : "⭐".repeat(stars) + "☆".repeat(3 - stars);
    document.getElementById("result-detail").textContent = detail;
    againCb = again;
    nextCb = next;
    document.getElementById("result-again").style.display = again ? "" : "none";
    document.getElementById("result-next").style.display = next ? "" : "none";
    popup().classList.remove("hidden");
  }

  function hideResult() { popup().classList.add("hidden"); }

  /* ---------- Confetti ---------- */
  function confetti(count = 60) {
    if (progress.calm) return;
    const colors = ["#ff6f9c", "#3aa5ff", "#4ecb71", "#ffa53c", "#8e6bf2", "#ffd93c"];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";
      piece.style.animationDelay = Math.random() * 0.4 + "s";
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 3500);
    }
  }

  /* ---------- Stats ---------- */
  function totalStars() {
    return Object.values(progress.lessonStars).reduce((a, b) => a + b, 0);
  }

  /* Called whenever a lesson, story, or game is finished. */
  function recordPractice() {
    const today = new Date().toLocaleDateString("en-CA");
    const s = progress.streak;
    if (s.last === today) return;
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");
    s.count = s.last === yesterday ? s.count + 1 : 1;
    s.last = today;
    save();
  }

  function refreshHome() {
    const streak = progress.streak.count > 0
      ? ` · 🔥 ${progress.streak.count}-day streak` : "";
    document.getElementById("home-star-count").textContent =
      `⭐ ${totalStars()} stars collected${streak}`;
    document.getElementById("tagline").textContent = progress.name
      ? `Hi ${progress.name}! Ready to type?`
      : "Learn to type with games and fun!";
  }

  function applyCalm() {
    document.body.classList.toggle("calm", !!progress.calm);
  }

  function refreshStats() {
    document.getElementById("stat-stars").textContent = totalStars();
    document.getElementById("stat-lessons").textContent =
      Object.keys(progress.lessonStars).length;
    document.getElementById("stat-balloon").textContent = progress.balloonHigh;
    document.getElementById("stat-wpm").textContent = progress.bestWpm;
  }

  /* ---------- Setup ---------- */
  function init() {
    document.querySelectorAll(".screen").forEach((el) => {
      screens[el.id.replace("screen-", "")] = el;
    });

    document.querySelectorAll("[data-goto]").forEach((btn) => {
      btn.addEventListener("click", () => {
        hideResult();
        goto(btn.dataset.goto);
      });
    });

    document.getElementById("result-again").addEventListener("click", () => {
      hideResult();
      if (againCb) againCb();
    });
    document.getElementById("result-next").addEventListener("click", () => {
      hideResult();
      if (nextCb) nextCb();
    });

    const soundBtn = document.getElementById("btn-sound");
    Sound.enabled = progress.sound;
    const paintSound = () => {
      soundBtn.textContent = Sound.enabled ? "🔊 Sound On" : "🔇 Sound Off";
    };
    paintSound();
    soundBtn.addEventListener("click", () => {
      Sound.enabled = !Sound.enabled;
      progress.sound = Sound.enabled;
      save();
      paintSound();
    });

    document.addEventListener("keydown", (e) => {
      if (!popup().classList.contains("hidden")) return;
      const fn = keyHooks[current];
      if (fn) fn(e);
    });

    onEnter("home", refreshHome);
    onEnter("stats", refreshStats);
    applyCalm();
    refreshHome();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    progress, save, goto, onEnter, onLeave, onKey,
    showResult, hideResult, confetti, totalStars, applyCalm, recordPractice,
  };
})();
