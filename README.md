# Quiz Lock Browser Extension
Quiz Lock is a productivity-focused browser extension that blocks access to distracting preselected websites until the user completes a quiz. The goal is to turn momentary distractions into active recall practice and increase learning enjoyment by introducing short quizzes
before the gratification of distracting content. The intention isn’t to punish users for seeking distracting content, but to gently nudge them back toward their studies—especially during moments when conventional study methods have gone stale. While many learners thrive with 
traditional active recall tools like flashcards, others struggle to sit down and engage with them consistently. Quiz Lock meets users where they already are, transforming distraction into an opportunity to reinforce knowledge rather than an obstacle to it.

The extension is built for Chrome and Firefox using Vue.js, JavaScript, HTML, and CSS.

An optional, currently private, Obsidian plugin integrates directly with Quiz Lock, allowing users to generate quizzes from their notes and jump straight back to the source material while being quizzed.

---
## Features
- Site Blocking - Prevents access to user-defined websites
- Quiz-Based Unlocking - Complete a quiz to proceed to the blocked site
- Quiz Intervals - Users define how long a site will be unlocked before they must take another quiz to continue browsing
- Active Recall - Designed around learning, not punishment
- Multiple Question Types
  - Short-answer
  - Multiple-choice
- Persistent Quiz Management - Quizzes are stored locally and can be enabled or disabled
- Obsidian integration
  - Import quizzes from vault notes
  - Open the originating note when answering questions

---
## Quiz Data Model

### Quiz Object
```json
{
  "tag": "biology",
  "enabled": true,
  "origin": "obsidian",
  "questions": []
}
```
Fields:
- `tag` - Identifier used to group and reference the quiz
- `enabled` - Whether the quiz is currently active
- `origin` - Source of the quiz (e.g. `obsidian`)
- `questions[]` - Array of question objects

---

### Question Object
```json
{
  "question": "What is the powerhouse of the cell?",
  "answer": "Mitochondria",
  "choices": ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"]
}
```

---

## Project Status
- Core browser extension: Active development
- Obsidian plugin: Unreleased / Experimental (This is mostly done, I'm mainly configuring different options for users)

---

## License

License information will be added as the project stabilizes.
