# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Psychology quiz application (Romanian language) about "Atitudini" (Attitudes). Built as a static AngularJS 1.8.2 single-page application with no build system.

**Live URL:** https://quiz-psihologie-atitudini.netlify.app

## Development

No build step required. Open `index.html` directly in a browser or use any static server:

```bash
# Using Python
python -m http.server 8000

# Using Node
npx serve .
```

**Deploy to Netlify:**
```bash
netlify deploy --prod --dir=.
```

## Architecture

```
index.html      → Quiz SPA (AngularJS ng-app="quizApp")
├── app.js      → QuizController: timer, scoring, navigation, state management
├── questions.js → quizQuestions array (36 questions with correctAnswers)
└── styles.css  → Quiz styling

essays.html     → Static page with solved essay questions (no JS framework)
└── essays.css  → Essays styling
```

**Data flow:** `questions.js` exports global `quizQuestions` array → `app.js` shuffles and manages state via `$scope` → `index.html` renders via AngularJS directives (`ng-repeat`, `ng-show`, `ng-click`).

## Question Format

Questions in `questions.js` follow this structure:
```javascript
{
    id: Number,
    question: String,
    type: "single" | "multiple",  // single = radio, multiple = checkbox
    options: String[],
    correctAnswers: Number[]      // indices into options array
}
```

## Key Quiz Features

- 1-hour countdown timer (3600 seconds)
- Fisher-Yates shuffle on reset
- Supports single-choice and multiple-choice questions
- Question navigator for jumping between questions
- Score calculation compares sorted answer arrays

## Source Images

The `Questions/` folder contains original exam images (gitignored). Questions were extracted manually into `questions.js`.
