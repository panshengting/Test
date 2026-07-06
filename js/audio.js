/* Tiny WebAudio sound effects — no audio files needed. */
const Sound = (() => {
  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type = "sine", vol = 0.15, when = 0) {
    const c = getCtx();
    if (!c || !enabled) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t = c.currentTime + when;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  return {
    get enabled() { return enabled; },
    set enabled(v) { enabled = v; },
    key()   { tone(660, 0.06, "square", 0.05); },
    pop()   { tone(880, 0.09, "triangle", 0.2); tone(1320, 0.07, "sine", 0.1, 0.03); },
    wrong() { tone(160, 0.18, "sawtooth", 0.12); },
    soft()  { tone(320, 0.1, "sine", 0.05); },  /* gentle miss sound for calm mode */
    win()   { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, "triangle", 0.18, i * 0.13)); },
    lose()  { [392, 330, 262].forEach((f, i) => tone(f, 0.22, "triangle", 0.15, i * 0.16)); },
  };
})();
