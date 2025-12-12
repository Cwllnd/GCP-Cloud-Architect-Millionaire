# GCP Cloud Architect Millionaire

## Overview
GCP Cloud Architect Millionaire is a gamified educational application designed to help candidates prepare for the **Google Professional Cloud Architect** certification. Inspired by the famous "Who Wants to Be a Millionaire?" TV show, it transforms dry exam preparation into an engaging, high-stakes quiz experience.

## Key Features

### 🎮 Gamified Learning
- **Money Ladder**: Progress through 15 levels of increasing difficulty, from $100 to $1,000,000 (virtual currency).
- **Safe Havens**: Secure your winnings at $1,000 and $32,000 benchmarks.
- **Permadeath Style**: One wrong answer ends the game (unless you reach a safe haven).

### 🧠 Adaptive Question Pool
- **Dynamic Difficulty**: Questions are categorized into three tiers (Easy, Medium, Hard) corresponding to the exam's domain complexity.
- **Randomized Sessions**: The app pulls a random set of 15 questions from a larger pool every time you play, ensuring no two practice runs are exactly the same.
- **Exam-Accurate Content**: Questions cover key domains like Designing, Planning, Managing, Security, and SRE.

### 🆘 Lifelines
- **50:50**: Eliminates two incorrect answers to narrow down your choices.
- **Phone a Friend**: Simulates a hint from a knowledgeable colleague, with confidence levels based on question difficulty.
- **Ask the Audience**: Simulates a poll, providing a statistical breakdown of likely answers.

### ⚙️ Tech Stack
- **Frontend**: React 19 (ESM Modules), TypeScript.
- **State Management**: Zustand.
- **Styling**: Tailwind CSS, Framer Motion for animations.
- **Build-less**: Uses native ES modules directly in the browser for rapid prototyping.

## How to Play
1. Click "Start Exam" on the intro screen.
2. Answer questions within the time limit (15s for easy, 30s for medium, 45s for hard).
3. Use lifelines wisely when stuck.
4. "Lock" your answer to confirm.
5. Try to reach the $1,000,000 goal to become a "Certified Architect"!
