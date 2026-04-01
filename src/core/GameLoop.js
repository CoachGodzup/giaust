export class GameLoop {
  constructor(update, render, targetFPS = 60) {
    this._update = update
    this._render = render
    this._targetFPS = targetFPS
    this._frameInterval = 1000 / targetFPS
    this._running = false
    this._lastTime = 0
    this._accumulator = 0
    this._animationId = null
  }

  start() {
    if (this._running) return
    this._running = true
    this._lastTime = performance.now()
    this._accumulator = 0
    this._animationId = requestAnimationFrame((t) => this._loop(t))
  }

  stop() {
    this._running = false
    if (this._animationId) {
      cancelAnimationFrame(this._animationId)
      this._animationId = null
    }
  }

  _loop(currentTime) {
    if (!this._running) return

    const deltaTime = currentTime - this._lastTime
    this._lastTime = currentTime
    this._accumulator += deltaTime

    while (this._accumulator >= this._frameInterval) {
      this._update(this._frameInterval / 1000)
      this._accumulator -= this._frameInterval
    }

    this._render()
    this._animationId = requestAnimationFrame((t) => this._loop(t))
  }

  get isRunning() {
    return this._running
  }
}
