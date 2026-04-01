# Game Design Document: Joust Clone

## 1. Overview

A browser-based recreation of the classic arcade game **Joust** (Williams Electronics, 1982) using vanilla JavaScript and HTML5 Canvas.

**Core Concept**: Two players (or player vs AI) ride flying mounts over a series of floating platforms. The key mechanic is that **altitude determines combat outcome** — the rider who is higher at the moment of collision wins.

## 2. Core Mechanics

### 2.1 Flight Physics
- Gravity constantly pulls the mount downward
- Flap button provides upward thrust (single press = one flap)
- Horizontal movement via left/right input
- Momentum-based: mount carries inertia, doesn't stop instantly
- Mount has a maximum fall speed (terminal velocity)

### 2.2 Collision Combat
- When two riders collide, compare their vertical positions
- **Higher rider wins**, lower rider is defeated
- Defeated rider falls off their mount and drops an egg
- If riders are at exactly the same height, both are defeated

### 2.3 Egg Mechanics
- Defeated riders drop eggs on platforms below
- Eggs can be collected for points
- Uncollected eggs hatch after a timer, spawning new enemies
- Higher difficulty = faster hatch time

### 2.4 Lava Monster
- A creature lurks in the lava at the bottom of the screen
- Periodically rises to snatch low-flying players
- Forces players to stay airborne or on platforms
- Adds time pressure to encounters

## 3. Game Entities

### 3.1 Player
- Mounted knight on a flying bird (ostrich/stork)
- Controlled via keyboard (arrow keys + space/flap)
- 1 life at start, extra lives at score thresholds
- Brief invincibility after respawning

### 3.2 Enemy Knights
- Ride vultures (slower, less agile than player mount)
- Spawn from edges or eggs
- Simple AI: wander, seek player, avoid lava monster
- Types:
  - **Bounder**: Standard enemy, green vulture
  - **Hunter**: Red vulture, more aggressive, targets player directly
  - **Shadow Lord**: Black vulture, fastest, appears in later waves

### 3.3 Pterodactyl (Bonus Enemy)
- Appears after player defeats a certain number of enemies in a wave
- Flies across screen at random heights
- Drops power-up if defeated
- Much faster than regular enemies

### 3.4 Platforms
- Static platforms at various heights
- Some platforms have gaps the player can fall through
- Eggs land on platforms
- Players can land and take off from platforms

### 3.5 Lava
- Fills the bottom portion of the screen
- Rising lava monster emerges from it
- Instant death if player touches lava surface

## 4. Controls

| Input | Action |
|-------|--------|
| Arrow Left / A | Move left |
| Arrow Right / D | Move right |
| Arrow Up / W / Space | Flap (upward thrust) |
| P | Pause |

## 5. Level Design

### 5.1 Arena Layout
- Symmetrical arrangement of platforms
- 3-4 tiers of platforms at different heights
- Central highest platform (strategic advantage)
- Gaps between platforms for vertical movement
- Lava pit at the bottom

### 5.2 Wave System
- Each wave spawns a set of enemies
- Clear all enemies to advance
- Each wave increases:
  - Number of enemies
  - Enemy aggression
  - Egg hatch speed
  - Frequency of special enemies

### 5.3 Wave Progression
```
Wave 1: 2 Bounders
Wave 2: 2 Bounders + 1 Hunter
Wave 3: 3 Bounders + 1 Hunter
Wave 4+: Increasing mix, Shadow Lords appear at Wave 6+
```

## 6. Scoring

| Action | Points |
|--------|--------|
| Defeat Bounder | 100 |
| Defeat Hunter | 150 |
| Defeat Shadow Lord | 200 |
| Defeat Pterodactyl | 500 |
| Collect egg (own) | 100 |
| Collect egg (enemy) | 200 |
| Collect egg (hatching) | 300 |
| Collect power-up | 250 |

- Extra life every 10,000 points
- Bonus for clearing wave quickly

## 7. Visual Design

### 7.1 Art Style
- Retro pixel art aesthetic
- Limited color palette inspired by original arcade
- Simple but readable sprites (16x16 to 32x32 pixels)
- Parallax background (optional)

### 7.2 Color Palette
- **Player mount**: White/light gray
- **Bounder**: Green
- **Hunter**: Red
- **Shadow Lord**: Black/dark purple
- **Pterodactyl**: Brown/orange
- **Platforms**: Brown/stone gray
- **Lava**: Orange/red gradient
- **Background**: Dark blue/black

### 7.3 Animations
- Mount wing flap (2-3 frames)
- Rider bobbing while flying
- Egg cracking before hatching
- Lava monster rising/sinking
- Defeat animation (rider falls off)
- Explosion/particle effect on defeat

## 8. Audio Design

### 8.1 Sound Effects
- Wing flap sound
- Collision/defeat sound
- Egg collection sound
- Egg hatching sound
- Wave complete fanfare
- Game over sound
- Lava monster roar

### 8.2 Music
- Simple looping background melody (optional)
- Tempo increases with wave number
- Muted during lava monster appearance

## 9. Technical Architecture

### 9.1 Game Loop
- Fixed timestep at 60 FPS
- Separate `update()` and `render()` phases
- Delta time for physics calculations

### 9.2 Entity Component Structure
```
Entity
  ├── position (x, y)
  ├── velocity (vx, vy)
  ├── bounds (width, height)
  ├── type (player, enemy, egg, etc.)
  ├── state (alive, dead, invincible)
  └── update(deltaTime)
  └── render(ctx)
```

### 9.3 Systems
- **PhysicsSystem**: Gravity, thrust, momentum, terminal velocity
- **CollisionSystem**: AABB detection, altitude comparison
- **InputSystem**: Keyboard state tracking
- **WaveSystem**: Enemy spawning, wave progression
- **EggSystem**: Hatch timers, collection
- **ParticleSystem**: Visual effects

### 9.4 State Management
```javascript
GameState {
  playing: boolean
  paused: boolean
  gameOver: boolean
  score: number
  lives: number
  wave: number
  entities: { players, enemies, eggs, particles }
}
```

## 10. Performance Targets

- 60 FPS on modern browsers
- Object pooling for eggs and particles
- Efficient collision detection (broad phase + narrow phase)
- Canvas rendering optimization (dirty rectangles if needed)

## 11. Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (touch controls as stretch goal)

## 12. Development Phases

### Phase 1: Core Prototype
- Canvas setup and game loop
- Player entity with flight physics
- Single platform
- Basic collision detection

### Phase 2: Combat & Enemies
- Enemy entities with AI
- Altitude-based collision resolution
- Egg drop and collection
- Wave system

### Phase 3: Polish
- Lava monster
- Pterodactyl
- Scoring system
- Sound effects
- Visual effects (particles, animations)

### Phase 4: Final
- Title screen
- Game over screen
- High score tracking (localStorage)
- Responsive canvas scaling
- Bug fixes and balancing

## 13. Stretch Goals

- Two-player local co-op
- Touch controls for mobile
- Custom arena editor
- Alternative mount types
- Power-ups (speed boost, shield, etc.)
- Online leaderboard

## 14. Success Criteria

- Faithful recreation of Joust's core gameplay loop
- Smooth 60 FPS performance
- Responsive controls that feel good
- Clear visual feedback for all game events
- Fun and challenging progression
