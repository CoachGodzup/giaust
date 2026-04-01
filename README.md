# Giaust

A browser-based Joust clone built with vanilla JavaScript and HTML5 Canvas.

This project was developed [live](https://www.youtube.com/watch?v=6yCMo8XIkag)

## Gameplay

Fight your way through waves of enemies on a flapping ostrich. Defeat enemies by jousting (colliding from above) to knock them off their mounts. Collect eggs before they hatch into new enemies. Avoid the deadly lava below and the lurking lava monster.

## Controls

- **Arrow Keys** or **A/D**: Move left/right
- **Up Arrow** or **W** or **Space**: Flap wings (gain altitude)
- **P**: Pause game

## Features

- Wave-based enemy progression
- Flapping flight physics
- Platform collision system
- Enemy hatching mechanic (eggs spawn from defeated enemies)
- Pterodactyl enemies
- Particle effects
- Web Audio synthesized sound effects
- Score tracking with extra lives

## Running the Game

```bash
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser.

## Project Structure

```
/src
  /core        - GameLoop, InputManager, Entity base
  /entities    - PlayerEntity, EnemyEntity, Platform, EggEntity, PterodactylEntity, LavaMonsterEntity
  /systems     - PhysicsSystem, CollisionSystem, WaveSystem, ParticleSystem
index.html
style.css
main.js
```

## Tech Stack

- Vanilla JavaScript (ES6+)
- HTML5 Canvas
- Web Audio API
- No external dependencies
