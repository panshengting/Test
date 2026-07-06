/* Lesson and word data for Typing Stars. */

const LESSONS = [
  {
    id: "home-left",
    emoji: "🐣",
    name: "Home Row: Left Hand",
    keys: "a s d f",
    lines: ["asdf asdf asdf", "fdsa fdsa fdsa", "aa ss dd ff ad sf"],
  },
  {
    id: "home-right",
    emoji: "🐤",
    name: "Home Row: Right Hand",
    keys: "j k l ;",
    lines: ["jkl; jkl; jkl;", ";lkj ;lkj ;lkj", "jj kk ll ;; jl k;"],
  },
  {
    id: "home-all",
    emoji: "🏠",
    name: "Home Row: Both Hands",
    keys: "a s d f j k l ;",
    lines: ["asdf jkl; asdf jkl;", "fj dk sl a; fj dk", "dad sad lad fall salad"],
  },
  {
    id: "top-left",
    emoji: "🌱",
    name: "Top Row: Left Hand",
    keys: "q w e r t",
    lines: ["qwert qwert", "wet ret qet wert", "weret twert qwe"],
  },
  {
    id: "top-right",
    emoji: "🌼",
    name: "Top Row: Right Hand",
    keys: "y u i o p",
    lines: ["yuiop yuiop", "you pio yup oip", "pi yo up io puy"],
  },
  {
    id: "top-all",
    emoji: "🌈",
    name: "Top + Home Rows",
    keys: "all top and home keys",
    lines: ["true trip pour quiet", "poet rides your desk", "we like this really"],
  },
  {
    id: "bottom-left",
    emoji: "🐢",
    name: "Bottom Row: Left Hand",
    keys: "z x c v b",
    lines: ["zxcvb zxcvb", "cab vex zac bvc", "cv bz xc vb zx"],
  },
  {
    id: "bottom-right",
    emoji: "🦀",
    name: "Bottom Row: Right Hand",
    keys: "n m",
    lines: ["nm nm mn mn nm", "man nan mam nnm", "mn nm man nam mnm"],
  },
  {
    id: "words",
    emoji: "🐶",
    name: "Easy Words",
    keys: "all letters",
    lines: ["cat dog sun fun run", "big red hat top mud", "kid box zip jam wet"],
  },
  {
    id: "sentences",
    emoji: "🦄",
    name: "Little Sentences",
    keys: "letters and space",
    lines: ["the cat sat on a mat", "my dog can run fast", "i like to type words"],
  },
];

/* Words for the games, easiest first. */
const GAME_WORDS = [
  "cat", "dog", "sun", "run", "fun", "hat", "red", "big", "top", "mud",
  "kid", "box", "zip", "jam", "wet", "cup", "pig", "bee", "fox", "owl",
  "star", "moon", "fish", "bird", "cake", "jump", "play", "blue", "frog", "ship",
  "happy", "smile", "candy", "tiger", "robot", "magic", "pizza", "cloud", "train", "zebra",
];

const BALLOON_COLORS = ["#ff6f9c", "#3aa5ff", "#4ecb71", "#ffa53c", "#8e6bf2", "#ff5c5c"];
