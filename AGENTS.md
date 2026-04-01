# AGENTS.md - Browser Videogame Development

## Project Overview
Simple browser-based video game built with vanilla JavaScript and HTML5 Canvas.

## Tech Stack
- **Rendering**: HTML5 Canvas (no frameworks)
- **Languages**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **No external dependencies** - keep it lightweight

## Code Conventions

### File Structure
```
/src
  /core        - Game loop, input handling, utilities
  /entities    - Player, enemies, projectiles, items
  /systems     - Collision, physics, scoring
  /rendering   - Drawing functions, sprites, effects
index.html
style.css
main.js
```

### Naming Conventions
- Classes: `PascalCase` (e.g., `PlayerEntity`, `GameLoop`)
- Functions/methods: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Private members: prefix with `_`

### Code Style
- Use `const` and `let` - never `var`
- Arrow functions for callbacks
- Template literals for string concatenation
- ES6 modules for code organization
- No semicolons at end of statements

### Game Loop
- Fixed timestep (60 FPS target): `requestAnimationFrame` with delta time
- Separate `update(deltaTime)` and `render(ctx)` phases
- Pause/resume support

### Input Handling
- Keyboard: track pressed keys in a `Set`
- Mouse/touch: normalize coordinates to canvas space
- Prevent default on game keys to avoid page scroll

### Rendering
- Clear canvas each frame
- Draw order: background → entities → UI
- Use `ctx.save()`/`ctx.restore()` for transformations
- Optimize: only redraw changed regions when possible

### Collision Detection
- AABB (Axis-Aligned Bounding Box) for rectangles
- Circle collision for rounded entities
- Spatial partitioning only if needed (start simple)

### State Management
- Central `GameState` object: `{ playing, paused, gameOver, score, level }`
- Entity arrays: `players`, `enemies`, `projectiles`, `particles`
- Clean up dead entities each frame

### Performance
- Object pooling for frequently created/destroyed entities
- Avoid allocations in hot paths
- Use `requestAnimationFrame` for smooth rendering
- Lazy initialization of heavy resources

## Testing Approach (Test Driven Development)
- **TDD Workflow**: Write failing tests first, then implement code to pass tests, then refactor
- **Unit Testing**: Test individual functions/classes in isolation using Jest or similar framework
- **Integration Testing**: Test interactions between systems (collision, rendering, game loop)
- **Automated Testing**: Run tests on file changes using test watcher
- **Test Coverage**: Aim for high coverage of critical game mechanics
- **Manual Testing**: Still important for feel, responsiveness, and browser compatibility
- Test all input methods (keyboard, mouse, touch)
- Verify responsive canvas sizing
- Check for memory leaks (entities not cleaned up)

## Commands
```bash
# Serve locally
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```
