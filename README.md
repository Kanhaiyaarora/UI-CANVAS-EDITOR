🧩 UI CANVAS EDITOR (Figma-Lite)

A Figma-inspired visual design editor built entirely with HTML, CSS, and vanilla JavaScript.
This project demonstrates how a basic design tool can be created using pure DOM manipulation, without using canvas, SVG, or any external libraries.

✨ Features

Create Rectangle and Text elements

Single element selection with visual outline

Mouse-based dragging (canvas-bounded)

Resizable elements using corner handles

360° rotation using a slider

Layers panel

Select elements from layers

Move layers up/down using z-index

Properties panel

Width & height control

Background color picker

Text editing (for text elements)

Rotation control

Keyboard support

Arrow keys → move element by 5px

Delete key → remove selected element

Persistent state

Layout saved using localStorage

Restores design on page refresh

Export options

Export design as JSON

Export design as HTML

Modern glassmorphism UI with a purple theme

🛠️ Tech Stack

HTML – structure

CSS – styling (glassmorphism UI)

Vanilla JavaScript – logic, state management, events

❌ No frameworks

❌ No canvas / SVG

📁 Project Structure
├── index.html
├── style.css
└── main.js

🎯 Project Objective

The main goal of this project was to understand how real design tools like Figma work internally by:

Managing selection state manually

Handling drag, resize, and rotate using mouse events

Synchronizing UI panels with element state

Working with z-index and layer ordering

Persisting layout data without a backend

🚀 How to Run

Clone or download the repository

Open index.html in your browser

Start designing 🎨

No build step or setup required.

📸 Preview

(Add screenshots or GIFs here if you want — highly recommended for GitHub)

🧠 Learnings

Deep understanding of DOM-based editors

Event handling for complex interactions

State synchronization across UI components

Real-world UI/UX problem solving

Writing clean, maintainable vanilla JavaScript

📌 Future Improvements

Multi-select support

Snap-to-grid

Zoom & pan canvas

Rotation handle

Undo / redo system

👤 Author

Built by Kanhaiya Arora
Frontend Developer | JavaScript Enthusiast
