# ⭐ Typing Stars

A fun, colorful typing-training website for kids. No installs, no build step,
no accounts — just open it in a browser and start typing!

## How to run

Open `index.html` directly in any modern browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What's inside

### 📚 Learn — 10 step-by-step lessons
Lessons start with the home row (one hand at a time) and build up through the
top row, bottom row, easy words, and little sentences. While typing:

- The next letter glows on a color-coded **on-screen keyboard** — each color
  shows which finger to use.
- Correct letters turn green; mistakes flash red and buzz.
- Finishing a lesson earns **1–3 stars** based on accuracy (95%+ = ⭐⭐⭐).

### 🎈 Balloon Pop
Letter balloons drift down from the sky — type the letter to pop the lowest
one before it reaches the ground. Three hearts, rising speed, and a saved
high score.

### 🚀 Rocket Race
Type 10 easy words to blast your rocket down the track before the UFO reaches
the finish flag. Winning records your best words-per-minute.

### 🏆 My Trophies
Total stars, lessons finished, balloon high score, and best WPM — all saved
in the browser (`localStorage`), so progress survives closing the tab.

## Tech notes

- Plain HTML/CSS/JavaScript — no frameworks or dependencies.
- Sound effects are generated with the Web Audio API (no audio files);
  a 🔊 button on the home screen toggles them.
- Layout is responsive; the on-screen keyboard hides on small touch screens.

## File map

```
index.html        All screens (home, lessons, games, trophies)
css/style.css     Kid-friendly theme, animations, layout
js/audio.js       Web Audio sound effects
js/data.js        Lesson content and game word lists
js/keyboard.js    On-screen keyboard with finger color coding
js/main.js        Navigation, saved progress, result popup, confetti
js/lesson.js      Lesson list + typing lesson logic
js/balloon.js     Balloon Pop game
js/race.js        Rocket Race game
```
