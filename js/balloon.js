/* Balloon Pop: type the letter on a falling balloon to pop it. */

(() => {
  const sky = () => document.getElementById("balloon-sky");
  const scoreEl = () => document.getElementById("balloon-score");
  const livesEl = () => document.getElementById("balloon-lives");
  const overlay = () => document.getElementById("balloon-start");

  const LETTERS = "abcdefghijklmnopqrstuvwxyz";

  let running = false;
  let balloons = [];      // { el, letter, x, y, speed }
  let score = 0;
  let lives = 3;
  let spawnTimer = 0;
  let rafId = null;
  let lastTime = 0;

  function hud() {
    scoreEl().textContent = `Score: ${score}`;
    livesEl().textContent = "❤️".repeat(lives) + "🤍".repeat(3 - lives);
  }

  function spawn() {
    const el = document.createElement("div");
    el.className = "balloon";
    const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    el.textContent = letter;
    el.style.background = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const skyW = sky().clientWidth;
    const x = 10 + Math.random() * (skyW - 84);
    // Speed grows gently with score: ~40 px/s at start, capped at 130.
    const speed = Math.min(40 + score * 0.9, 130);
    el.style.transform = `translate(${x}px, -90px)`;
    sky().appendChild(el);
    balloons.push({ el, letter, x, y: -90, speed });
  }

  function loop(time) {
    if (!running) return;
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawn();
      // Spawn a bit faster as the score climbs, but never crazier than one per second.
      spawnTimer = Math.max(2.2 - score * 0.02, 1.0);
    }

    const floor = sky().clientHeight;
    for (let i = balloons.length - 1; i >= 0; i--) {
      const b = balloons[i];
      b.y += b.speed * dt;
      b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
      if (b.y > floor) {
        b.el.remove();
        balloons.splice(i, 1);
        lives--;
        Sound.wrong();
        hud();
        if (lives <= 0) return gameOver();
      }
    }
    rafId = requestAnimationFrame(loop);
  }

  function handleKey(e) {
    if (!running) return;
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
    const got = e.key.toLowerCase();
    // Pop the lowest matching balloon (closest to the ground).
    let best = -1;
    balloons.forEach((b, i) => {
      if (b.letter === got && (best === -1 || b.y > balloons[best].y)) best = i;
    });
    if (best === -1) return;
    const [b] = balloons.splice(best, 1);
    b.el.classList.add("pop");
    setTimeout(() => b.el.remove(), 260);
    score += 10;
    Sound.pop();
    hud();
  }

  function start() {
    stop();
    score = 0;
    lives = 3;
    spawnTimer = 0;
    running = true;
    overlay().classList.add("hidden");
    hud();
    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    balloons.forEach((b) => b.el.remove());
    balloons = [];
  }

  function gameOver() {
    const isHigh = score > App.progress.balloonHigh;
    if (isHigh) {
      App.progress.balloonHigh = score;
      App.save();
    }
    stop();
    if (isHigh && score > 0) { Sound.win(); App.confetti(40); } else { Sound.lose(); }
    App.showResult({
      emoji: isHigh && score > 0 ? "🏅" : "🎈",
      title: isHigh && score > 0 ? "New high score!" : "Game over!",
      detail: `You scored ${score} points. Best: ${App.progress.balloonHigh}`,
      again: start,
    });
    overlay().classList.remove("hidden");
  }

  App.onEnter("balloon", () => {
    overlay().classList.remove("hidden");
    hud();
  });
  App.onLeave("balloon", stop);
  App.onKey("balloon", handleKey);

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-balloon-start").addEventListener("click", start);
  });
})();
