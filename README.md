# Retro-Bot-Run
**Developed by Aaqibhafeez**

---

## Overview
**Retro-Bot-Run** is an immersive 3D WebGL game where players control a robot navigating a procedurally generated city. The goal is simple but challenging: explore the urban environment and survive for as long as possible while avoiding unpredictable traffic.

The project demonstrates a custom WebGL engine built from scratch with dynamic lighting, elastic physics, and a first-person camera.

---

## Table of Contents
- [Overview](#overview)
- [Objective](#objective)
- [Controls](#controls)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Running](#installation--running)
- [Project Structure](#project-structure)
- [Technical Details](#technical-details)
  - [Scene Modeling](#scene-modeling)
  - [Lighting & Shaders](#lighting--shaders)
  - [Physics Engine](#physics-engine)
- [HUD (Heads-Up Display)](#hud-heads-up-display)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)
- [Contribution](#contribution)
- [Credits](#credits)
- [License](#license)

---

## Objective
Survive as long as possible in the procedurally generated city without crashing into cars.

- **Survival:** Dodge cars moving through the streets. Each collision reduces your **Health Points (HP)**.
- **Game Over:** When `HP <= 0`.
- **Time Tracking:** A visible clock tracks survival time and simulates a 24-hour day/night cycle.

The HUD includes a health bar and a clock for clarity and immersion.

---

## Controls

| Action                  | Input                 |
| :---------------------: | :-------------------: |
| **Move**                | `W`, `A`, `S`, `D`    |
| **Jump**                | `Spacebar`            |
| **Look / Aim**          | Mouse (move to look)  |
| **Sprint**              | `Shift` (hold)        |
| **Start / Lock Cursor** | Click anywhere on the canvas |

---

## Key Features
- **First-Person Camera:** Immersive viewpoint positioned at robot head height.
- **Procedural City:** Grid-based generation of buildings and streets.
- **Day / Night Cycle:** Smooth lighting changes simulating a 24-hour cycle.
- **Elastic Physics:** Gravity-based jumping and elastic collisions with vehicles.
- **Rich Texturing:** Textures for robot, buildings, cars, and ground.
- **Custom WebGL Engine:** Minimal dependencies — everything rendered with raw WebGL.

---

## Getting Started

### Prerequisites
A modern browser with WebGL support (Chrome, Firefox, Edge).

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aaqibhafeez/robot-survive.git
   cd robot-survive
````

2. **Run a local server** (required due to browser CORS restrictions)

   **Python 3**

   ```bash
   python -m http.server 8000
   ```

   **Node.js (http-server)**

   ```bash
   npx http-server -p 8000
   ```

3. **Open the game in your browser**
   Navigate to:
   `http://localhost:8000`

---

## Project Structure

```
project-root/
├── index.html                  # Main HTML entry point
├── assets/
│   ├── css/                    # Stylesheets for UI and HUD
│   └── images/                 # Texture files (buildings, cars, ground, robot)
└── js/                         # JavaScript code and engine
    ├── main.js                 # Game loop, initialization, and rendering logic
    ├── objects.js              # Geometric models & scene object definitions
    ├── mouse.js                # Camera and input handling
    ├── config.js               # Global constants and configuration
    └── shaders.js              # GLSL vertex & fragment shader programs
```

---

## Technical Details

### Scene Modeling

* All models are built using primitive solids (cube, cylinder, sphere).
* **Robot**: Hierarchical articulated system (head → torso → limbs).
* **City**: Grid-based procedural layout of buildings and cars.

### Lighting & Shaders

* Uses the **Phong Illumination Model**:

  * Ambient
  * Diffuse
  * Specular
* A directional “sun” light animates the day/night cycle.

### Physics Engine

* **Gravity** applied to jumping and falling.
* **Collision Detection**:

  * Buildings: Static blocking collisions.
  * Cars: Elastic collisions that reflect velocity and reduce HP.

---

## HUD (Heads-Up Display)

* Health bar (HP).
* Survival timer synchronized with the 24-hour cycle.
* Styled via `assets/css/` and rendered above the canvas.

---

## Known Issues

* Camera handles collisions instead of the robot model (causing mesh clipping).
* Cars can occasionally spawn exactly on the player position.
* Camera may get stuck between tight building corners.
* HUD alignment may shift on unusual aspect ratios.

---

## Future Improvements

* [ ] Full robot mesh bounding-box collision.
* [ ] Orbiting sun for real-time shadows.
* [ ] Infinite world via chunk-based generation.
* [ ] Movement-synced robot animations.
* [ ] Sound effects and ambient audio.

---

## Contribution

Contributions are welcome!

1. Fork the repository
2. Create a feature branch:

   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit and push your changes
4. Open a Pull Request describing the update

Please file bug reports and feature requests via GitHub Issues.

---

## Credits

**Maintained & Developed by Aaqibhafeez**

---
