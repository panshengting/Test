# ⭐ Typing Stars

A calm, customizable typing-practice website built for an intermediate young
typist — with everything a parent needs to add their own stories and
sentences. No installs, no build step, no accounts — just open it in a
browser and start typing.

## How to run

Open `index.html` directly in any modern browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What's inside

### 📚 Lessons — intermediate, communication-first
Ten built-in lessons practice real everyday communication: saying how you
feel, asking for help, talking at school, with family, and out in the world.
Typing is case-sensitive — capitals and punctuation must match — with a
color-coded on-screen keyboard showing which finger to use.

**Mistakes never block.** A missed character is gently marked and the cursor
keeps moving, so there is no getting stuck — Backspace steps back to fix a
mark if wanted, though the miss still counts toward accuracy. Live WPM and
accuracy are shown while typing, keystrokes make a pleasant soft typewriter
click, and each finished line rings a little typewriter bell. **Each word is
read aloud right after it is typed** (browser text-to-speech, toggleable in
For Grown-Ups) — connecting the typed word to its spoken sound. Each lesson
earns 1–3 stars based on accuracy, and practicing on consecutive days builds
a 🔥 streak shown on the home screen.

### 📖 Story Time
Type through whole stories, split automatically into comfortable lines.
Three built-in stories model everyday social situations (introducing
yourself, ordering food, writing to family) — and any stories added in the
For Grown-Ups area appear here too.

### ⚙️ For Grown-Ups — make it personal
A parent area for customizing the program:

- **My Sentence Sets** — add named sets of sentences (one per line); they
  appear at the end of Lessons marked with ✏️.
- **My Stories** — write or paste a story; it appears in Story Time.
  Smart quotes and dashes are automatically converted to typeable keys.
- **Player settings** — the player's name (used in the home-screen
  greeting) and **Calm mode**.
- **Backup** — export all custom content as a JSON file and import it on
  another device or browser.

### 🧘 Calm mode (autism-friendly)
Designed for kids who find bright motion and harsh feedback overwhelming:
softer colors, no pulsing or flashing animations, no confetti, and a quiet,
gentle tone instead of a buzz when a key is missed.

### 🎈 Balloon Pop
Letter balloons drift down — type the letter to pop the lowest one before it
lands. Three hearts, gently rising speed, saved high score.

### 🚀 Rocket Race
Type words to fly your rocket to the finish flag. Four ways to play,
chosen every race: **Just Practice** (the UFO stays parked — no pressure,
no losing), Relaxed, Normal, or Speedy. Finishing records best WPM.

### 🏆 My Trophies
Total stars, lessons and stories finished, balloon high score, and best
words per minute — saved in the browser (`localStorage`).

## Tech notes

- Plain HTML/CSS/JavaScript — no frameworks or dependencies.
- Sound effects generated with the Web Audio API (no audio files);
  a 🔊 button on the home screen toggles them.
- Custom content is stored separately from progress, so backups are small
  and importing content never touches earned stars.

## File map

```
index.html        All screens (home, lessons, stories, games, grown-ups)
css/style.css     Kid-friendly theme, calm-mode overrides, layout
js/audio.js       Web Audio sound effects
js/data.js        Built-in lessons, stories, and game word lists
js/content.js     Custom content store: sentence sets, stories, backup
js/keyboard.js    On-screen keyboard with finger color coding
js/main.js        Navigation, saved progress, result popup, confetti
js/lesson.js      Lesson/story lists + shared typing engine
js/parent.js      For Grown-Ups screen (settings, content, backup)
js/balloon.js     Balloon Pop game
js/race.js        Rocket Race game with difficulty / practice modes
```
