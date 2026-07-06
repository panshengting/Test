/* Built-in lesson and story content for Typing Stars.
   Intermediate level: real sentences with capitals and punctuation,
   focused on everyday communication. Custom content added in the
   For Grown-Ups area appears alongside these. */

const LESSONS = [
  {
    id: "warmup",
    emoji: "🔥",
    name: "Warm-Up Words",
    keys: "common words",
    lines: [
      "the and you that was for are with they",
      "this have from one had word but not what",
      "when your can said there use each which",
    ],
  },
  {
    id: "capitals",
    emoji: "⬆️",
    name: "Capital Letters",
    keys: "Shift + letters",
    lines: [
      "Anna Ben Carla David Emma Frank",
      "My name is Sirui. I live with my family.",
      "Monday Tuesday Wednesday Thursday Friday",
    ],
  },
  {
    id: "punctuation",
    emoji: "❓",
    name: "Punctuation",
    keys: ". , ! ?",
    lines: [
      "Yes, please. No, thank you.",
      "Wow! That is great! Well done!",
      "How are you? What time is it?",
    ],
  },
  {
    id: "feelings",
    emoji: "💬",
    name: "Saying How I Feel",
    keys: "full sentences",
    lines: [
      "I feel happy today.",
      "I am tired. I need a quiet break.",
      "I feel worried. Can we talk about it?",
    ],
  },
  {
    id: "asking",
    emoji: "🙋",
    name: "Asking for Help",
    keys: "full sentences",
    lines: [
      "Can you help me with this, please?",
      "I do not understand. Please show me.",
      "Excuse me, where is the library?",
    ],
  },
  {
    id: "school",
    emoji: "🏫",
    name: "At School",
    keys: "full sentences",
    lines: [
      "May I borrow a pencil, please?",
      "I finished my work. What should I do next?",
      "Can I sit with you at lunch?",
    ],
  },
  {
    id: "family",
    emoji: "👨‍👩‍👧",
    name: "Talking with Family",
    keys: "full sentences",
    lines: [
      "What are we having for dinner tonight?",
      "I had a good day. My favorite part was art.",
      "Good night. See you in the morning.",
    ],
  },
  {
    id: "outside",
    emoji: "🛒",
    name: "Out and About",
    keys: "full sentences",
    lines: [
      "How much does this cost, please?",
      "One ticket for the museum, please.",
      "Thank you very much. Have a nice day.",
    ],
  },
  {
    id: "longer",
    emoji: "📝",
    name: "Longer Sentences",
    keys: "full sentences",
    lines: [
      "When I feel stressed, I take three deep breaths.",
      "If I need help, I can ask a teacher or a friend.",
      "Before bed, I like to read for ten minutes.",
    ],
  },
  {
    id: "speed",
    emoji: "⚡",
    name: "Speed Round",
    keys: "every letter",
    lines: [
      "The quick brown fox jumps over the lazy dog.",
      "Pack my box with five dozen liquid jugs.",
      "How quickly daft jumping zebras vex!",
    ],
  },
];

/* Built-in stories. New stories added in For Grown-Ups appear after these. */
const DEFAULT_STORIES = [
  {
    id: "new-club",
    emoji: "🎨",
    title: "The New Club",
    text:
      "Today there is a new art club at school. I want to join, but I do not " +
      "know anyone there. I take a deep breath and open the door. A girl " +
      "smiles at me. I say, hello, my name is Sirui. She says her name is " +
      "Maya. Maya shows me where the paints are. We paint a big blue ocean " +
      "together. Joining something new can feel scary at first. I am glad I " +
      "said hello today.",
  },
  {
    id: "cafe",
    emoji: "☕",
    title: "Ordering Lunch",
    text:
      "Mom and I go to a cafe for lunch. I read the menu two times. I know " +
      "what I want to say. When it is my turn, I look up and speak clearly. " +
      "One cheese sandwich and an apple juice, please. The server says, " +
      "coming right up! I say thank you and find a seat by the window. " +
      "Ordering by myself makes me feel proud. Next time I will try the soup.",
  },
  {
    id: "message",
    emoji: "💌",
    title: "A Message to Grandma",
    text:
      "Grandma lives far away, so I type her a message. Dear Grandma, how " +
      "are you? School is going well. In science we learned about planets. " +
      "My favorite one is Saturn because of its rings. I miss your dumplings " +
      "very much. Can we video call this weekend? Love, your granddaughter. " +
      "I read it once more and press send. Writing to people I love is a " +
      "good feeling.",
  },
];

/* Words for the games — easy words first, longer ones later in the list. */
const GAME_WORDS = [
  "star", "moon", "fish", "bird", "cake", "jump", "play", "blue", "frog", "ship",
  "happy", "smile", "candy", "tiger", "robot", "magic", "pizza", "cloud", "train", "zebra",
  "friend", "school", "orange", "purple", "window", "garden", "rocket", "yellow", "dragon", "family",
  "because", "morning", "picture", "thunder", "whisper", "library", "science", "weekend", "rainbow", "planet",
  "together", "question", "remember", "birthday", "different", "important", "beautiful", "chocolate",
];

const BALLOON_COLORS = ["#ff6f9c", "#3aa5ff", "#4ecb71", "#ffa53c", "#8e6bf2", "#ff5c5c"];
