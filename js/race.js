/* Rocket Race: type words to move your rocket; beat the UFO to the flag. */

(() => {
  const wordEl = () => document.getElementById("race-word");
  const wpmEl = () => document.getElementById("race-wpm");
  const overlay = () => document.getElementById("race-start");
  const playerEl = () => document.getElementById("racer-player");
  const cpuEl = () => document.getElementById("racer-cpu");

  const TOTAL_WORDS = 10;
  const CPU_SECONDS = 55;   // how long the UFO takes to finish

  let running = false;
  let words = [];
  let wordIdx = 0;
  let pos = 0;             // position within current word
  let charsTyped = 0;      // correct chars, for WPM
  let startTime = 0;
  let rafId = null;

  function pickWords() {
    const pool = [...GAME_WORDS];
    const chosen = [];
    for (let i = 0; i < TOTAL_WORDS; i++) {
      chosen.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    // Shorter words first so the race ramps up gently.
    return chosen.sort((a, b) => a.length - b.length);
  }

  function render() {
    const w = words[wordIdx];
    wordEl().innerHTML = w.split("").map((ch, i) => {
      if (i < pos) return `<span class="done">${ch}</span>`;
      if (i === pos) return `<span class="current">${ch}</span>`;
      return `<span>${ch}</span>`;
    }).join("");
  }

  function laneWidth(el) {
    return el.parentElement.clientWidth - 70; // leave room for the flag
  }

  function movePlayer() {
    const frac = wordIdx / TOTAL_WORDS;
    playerEl().style.left = frac * laneWidth(playerEl()) + "px";
  }

  function wpm() {
    const minutes = (performance.now() - startTime) / 60000;
    return minutes > 0 ? Math.round((charsTyped / 5) / minutes) : 0;
  }

  function loop() {
    if (!running) return;
    const elapsed = (performance.now() - startTime) / 1000;
    const cpuFrac = Math.min(elapsed / CPU_SECONDS, 1);
    cpuEl().style.left = cpuFrac * laneWidth(cpuEl()) + "px";
    wpmEl().textContent = charsTyped > 0 ? `${wpm()} WPM` : "";
    if (cpuFrac >= 1) return finish(false);
    rafId = requestAnimationFrame(loop);
  }

  function handleKey(e) {
    if (!running) return;
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();
    const want = words[wordIdx][pos];
    if (e.key.toLowerCase() === want) {
      Sound.key();
      charsTyped++;
      pos++;
      if (pos >= words[wordIdx].length) {
        Sound.pop();
        wordIdx++;
        pos = 0;
        movePlayer();
        if (wordIdx >= TOTAL_WORDS) return finish(true);
        render();
      } else {
        render();
      }
    } else {
      Sound.wrong();
    }
  }

  function start() {
    stop();
    words = pickWords();
    wordIdx = 0;
    pos = 0;
    charsTyped = 0;
    running = true;
    overlay().classList.add("hidden");
    playerEl().style.left = "0px";
    cpuEl().style.left = "0px";
    startTime = performance.now();
    render();
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    wordEl().innerHTML = "";
    wpmEl().textContent = "";
  }

  function finish(won) {
    const finalWpm = wpm();
    running = false;
    if (rafId) cancelAnimationFrame(rafId);

    if (won && finalWpm > App.progress.bestWpm) {
      App.progress.bestWpm = finalWpm;
      App.save();
    }
    if (won) { Sound.win(); App.confetti(60); } else { Sound.lose(); }

    App.showResult({
      emoji: won ? "🚀" : "🛸",
      title: won ? "You win the race!" : "The UFO got there first!",
      detail: won
        ? `Amazing! You typed ${finalWpm} words per minute.`
        : "Keep practicing — you'll beat it next time!",
      again: start,
    });
    overlay().classList.remove("hidden");
    wordEl().innerHTML = "";
  }

  App.onEnter("race", () => overlay().classList.remove("hidden"));
  App.onLeave("race", stop);
  App.onKey("race", handleKey);

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-race-start").addEventListener("click", start);
  });
})();
