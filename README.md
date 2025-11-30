# Retro-Bot-Run

**Developed by Aaqibhafeez**


##  Overview

**Retro-Bot-Run** is an immersive 3D WebGL game where players control a robot navigating a procedurally generated city. The goal is simple but challenging: explore the urban environment and survive for as long as possible while dodging unpredictable traffic.

The game features a custom engine built from scratch using WebGL, showcasing dynamic lighting cycles, realistic physics, and an interactive first-person camera.

##  Objective

Your primary mission is to explore the city without crashing.

  * **Survival:** Dodge cars moving through the streets. Each collision reduces your Health Points ($HP$).
  * **Game Over:** The game ends when your $HP \le 0$.
  * **Time Tracking:** A visible clock tracks your survival time, simulating a full 24-hour day/night cycle.

> **Note:** The HUD (Heads-Up Display) includes a health bar and a clock, styled for clarity and immersion.

##  Controls

The game utilizes standard FPS (First-Person Shooter) style controls.

| Action | Input |
| :--- | :--- |
| **Move** | `W`, `A`, `S`, `D` keys |
| **Jump** | `Spacebar` |
| **Look/Aim** | Mouse (Move to look) |
| **Sprint** | `Shift` (Hold) |
| **Start/Lock Cursor** | **Click** anywhere on the canvas |

##  Key Features

  * **First-Person Camera:** An immersive perspective positioned at the robot's head height.
  * **Dynamic Environment:** A procedurally generated city composed of building blocks and streets.
  * **Day/Night Cycle:** The sun's position and environmental lighting change smoothly based on a simulated 24-hour clock.
  * **Elastic Physics:** Experience gravity-based jumping and elastic collisions with vehicles (collisions reflect velocity and reduce HP).
  * **Rich Texturing:** Distinct textures for the articulated robot, buildings (concrete/brick), cars (metal/aluminum), and the ground.

##  Getting Started

### Prerequisites

You need a modern web browser that supports WebGL (Chrome, Firefox, Edge, etc.).

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Aaqibhafeez/robot-survive.git
    ```
2.  **Run a local server:**
    Due to browser security policies regarding CORS (Cross-Origin Resource Sharing), textures will not load if you simply double-click `index.html`. You must run a local server.
      * *Python example:* `python -m http.server`
      * *Node example:* `npx http-server`
3.  **Play:**
    Open your browser to `localhost:8000` (or whichever port your server uses).

## 📂 Project Structure

/
├── index.html          # Main entry point
├── assets/
│   ├── css/            # UI and overlay styling
│   └── images/         # Textures (building, car, floor, simple)
├── js/
│   ├── main.js         # Main game loop and rendering
│   ├── objects.js      # Definitions for Robot and scene objects
│   ├── mouse.js        # Camera logic and input handling
│   ├── config.js       # Global configuration and constants
│   └── shaders.js      # WebGL shader code
└── ...
```

## Technical Details

### Scene Modeling

All objects are constructed using primitive solids to demonstrate foundational graphics concepts:

  * **Robot:** Articulated hierarchical model (Head $\rightarrow$ Body $\rightarrow$ Arms/Legs).
  * **City:** Grid-based logic using cubes for buildings and cars.

### Lighting & Shaders

The game implements the **Phong Illumination Model**, calculating Ambient, Diffuse, and Specular reflection to create realistic lighting that reacts to the moving sun source.

### Physics Engine

  * **Gravity:** Adjustable constant affecting jump height and falling speed.
  * **Collision Detection:**
      * *Buildings:* Static collision (prevents entry).
      * *Cars:* Dynamic elastic collision (calculates velocity reflection and damage).

## Known Issues

  * **Collision Bounds:** Currently, the *camera* detects collisions, not the robot model itself. This allows the robot's body to visually clip through objects occasionally.
  * **Spawn Trap:** If a car spawns exactly on the player's start location, immediate damage may occur.
  * **Corner Cases:** The camera may rarely get stuck in tight building corners (jumping usually fixes this).
  * **Resolution:** HUD elements may be misaligned on non-standard screen aspect ratios.

## Future Improvements

  * [ ] **Full Model Collision:** Implement bounding box collision for the robot mesh, not just the camera.
  * [ ] **Orbiting Sun:** Animate the sun to physically orbit the scene for dynamic shadow casting.
  * [ ] **Infinite City:** Implement "chunk" generation to create an endless world as the player moves.
  * [ ] **Animation Sync:** Synchronize walking/jumping animations with movement speed.
  * [ ] **Sound Design:** Add engine noises, collision impacts, and background tracks.

-----

### Credits

**Maintained and Developed by Aaqibhafeez.**

-----
