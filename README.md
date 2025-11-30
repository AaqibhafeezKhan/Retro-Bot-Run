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

| Action                | Input                |
| :-------------------: | :------------------: |
| **Move**              | `W`, `A`, `S`, `D`   |
| **Jump**              | `Spacebar`           |
| **Look / Aim**        | Mouse (move to look) |
| **Sprint**            | `Shift` (hold)       |
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
   git clone https://github.com/Aaqibhafeez/robot-survive.git
   cd robot-survive

2. **Run a local server** (required for textures / CORS)

   * Python 3:

     ```bash
     python -m http.server 8000
     ```
   * Node (http-server):

     ```bash
     npx http-server -p 8000
     ```
3. **Open in browser**
   Visit `http://localhost:8000` (or the port you specified).

---

## Project Structure

```
project-root/
├── index.html                  # Main HTML entry point
├── assets/
│   ├── css/                    # Stylesheets for UI and HUD
│   └── images/                 # Texture files (buildings, cars, ground, robot)
└── js/                         # JavaScript code and engine
    ├── main.js                 # Game loop, init, rendering orchestration
    ├── objects.js              # Geometric models & scene object instantiation
    ├── mouse.js                # Camera controls, input handling
    ├── config.js               # Global constants and initial parameters
    └── shaders.js              # GLSL vertex & fragment shaders
```

---

## Technical Details

### Scene Modeling

* Objects are constructed from primitive solids to explain core graphics concepts.
* **Robot**: Hierarchical articulated model (head → body → arms/legs).
* **City**: Grid-based placement of cube buildings and moving cars.

### Lighting & Shaders

* Implements the **Phong illumination model**:

  * Ambient, diffuse, and specular components.
  * A moving sun (directional light) drives day/night lighting.

### Physics Engine

* **Gravity**: Adjustable constant for jump behavior.
* **Collision Detection**:

  * Buildings: static collision (prevents entry).
  * Cars: dynamic elastic collisions that reflect velocity and reduce player HP.

---

## HUD (Heads-Up Display)

* Health bar (HP).
* Survival clock (24-hour cycle visual).
* HUD is styled in `assets/css/` and overlays the canvas.

---

## Known Issues

* **Collision bounds**: Only the camera detects collisions; the visible robot mesh can clip through objects.
* **Spawn trap**: A car may spawn on the player start location causing immediate damage.
* **Corner cases**: Camera may get stuck in tight corners (jumping usually resolves this).
* **Aspect ratio**: HUD elements may misalign on uncommon screen sizes.

---

## Future Improvements

* [ ] Full model collision (robot bounding boxes instead of camera-only).
* [ ] Orbiting sun for dynamic shadows.
* [ ] Chunk-based infinite city generation.
* [ ] Animation sync (walking/jumping animations tied to movement).
* [ ] Sound design (engine noises, impacts, ambient music).

---

## Contribution

Contributions are welcome! If you want to help:

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/my-feature`).
3. Commit your changes and open a Pull Request describing the change.

Please open issues for bug reports or feature requests.

---

## Credits

**Maintained and Developed by Aaqibhafeez.**

---
