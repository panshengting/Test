/* On-screen keyboard with finger color coding. */

const Keyboard = (() => {
  const ROWS = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ];

  const FINGER = {
    q: "pinky", a: "pinky", z: "pinky", p: "pinky", ";": "pinky", "/": "pinky",
    w: "ring", s: "ring", x: "ring", o: "ring", l: "ring", ".": "ring",
    e: "middle", d: "middle", c: "middle", i: "middle", k: "middle", ",": "middle",
    r: "index", f: "index", v: "index", t: "index", g: "index", b: "index",
    y: "index", h: "index", n: "index", u: "index", j: "index", m: "index",
    " ": "thumb",
  };

  const keyEls = {};

  function build(container) {
    container.innerHTML = "";
    ROWS.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = "kb-row";
      row.forEach((ch) => {
        const keyEl = document.createElement("div");
        keyEl.className = `key f-${FINGER[ch] || "index"}`;
        keyEl.textContent = ch;
        keyEls[ch] = keyEl;
        rowEl.appendChild(keyEl);
      });
      container.appendChild(rowEl);
    });
    const spaceRow = document.createElement("div");
    spaceRow.className = "kb-row";
    const spaceEl = document.createElement("div");
    spaceEl.className = "key space f-thumb";
    spaceEl.textContent = "space";
    keyEls[" "] = spaceEl;
    spaceRow.appendChild(spaceEl);
    container.appendChild(spaceRow);
  }

  /* Map a target character to the physical key that produces it,
     so capitals and shifted punctuation still light up a key. */
  function baseKey(ch) {
    if (!ch) return ch;
    const shifted = { "?": "/", ":": ";", "<": ",", ">": "." };
    return shifted[ch] || ch.toLowerCase();
  }

  function highlight(ch) {
    Object.values(keyEls).forEach((el) => el.classList.remove("target"));
    const el = keyEls[baseKey(ch)];
    if (el) el.classList.add("target");
  }

  function flash(ch, ok) {
    const el = keyEls[baseKey(ch)];
    if (!el) return;
    const cls = ok ? "pressed" : "pressed-wrong";
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 150);
  }

  function clear() {
    Object.values(keyEls).forEach((el) =>
      el.classList.remove("target", "pressed", "pressed-wrong"));
  }

  return { build, highlight, flash, clear };
})();
