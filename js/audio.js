/* Tiny WebAudio sound effects — no audio files needed.
   Keystrokes sound like a pleasant, soft typewriter: a filtered noise
   "click" with a low thump for body, and a bell ding at the end of a line. */
const Sound = (() => {
  let ctx = null;
  let enabled = true;
  let noiseBuf = null;

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

  /* A short mechanical click: white noise through a bandpass filter with a
     fast decay. `center` sets the character — high = crisp tap, low = clunk.
     Slight random detune keeps a stream of keystrokes from sounding robotic. */
  function click(center, vol, dur = 0.045) {
    const c = getCtx();
    if (!c || !enabled) return;
    if (!noiseBuf) {
      noiseBuf = c.createBuffer(1, Math.floor(c.sampleRate * 0.06), c.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = c.createBufferSource();
    src.buffer = noiseBuf;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = center * (0.9 + Math.random() * 0.25);
    bp.Q.value = 1.1;
    const g = c.createGain();
    const t = c.currentTime;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(bp).connect(g).connect(c.destination);
    src.start(t);
    src.stop(t + dur + 0.02);
    tone(165, 0.035, "sine", vol * 0.45); // low thump for body
  }

  return {
    get enabled() { return enabled; },
    set enabled(v) { enabled = v; },
    /* typewriter keystroke */
    type()  { click(2600, 0.32); },
    /* duller clunk for a missed key — noticeable, never harsh */
    clunk() { click(700, 0.22, 0.06); },
    /* typewriter bell at the end of a line */
    ding()  { tone(1760, 0.45, "sine", 0.14); tone(2637, 0.3, "sine", 0.05, 0.01); },
    key()   { tone(660, 0.06, "square", 0.05); },
    pop()   { tone(880, 0.09, "triangle", 0.2); tone(1320, 0.07, "sine", 0.1, 0.03); },
    wrong() { tone(160, 0.18, "sawtooth", 0.12); },
    soft()  { tone(320, 0.1, "sine", 0.05); },  /* gentle miss sound for calm mode */
    win()   { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, "triangle", 0.18, i * 0.13)); },
    lose()  { [392, 330, 262].forEach((f, i) => tone(f, 0.22, "triangle", 0.15, i * 0.16)); },
  };
})();
