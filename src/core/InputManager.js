export class InputManager {
  constructor() {
    this._keys = new Set()
    this._justPressed = new Set()
    this._mousePos = { x: 0, y: 0 }
    this._mouseDown = false

    this._onKeyDown = this._onKeyDown.bind(this)
    this._onKeyUp = this._onKeyUp.bind(this)
    this._onMouseMove = this._onMouseMove.bind(this)
    this._onMouseDown = this._onMouseDown.bind(this)
    this._onMouseUp = this._onMouseUp.bind(this)

    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup', this._onKeyUp)
    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('mousedown', this._onMouseDown)
    window.addEventListener('mouseup', this._onMouseUp)
  }

  _onKeyDown(e) {
    const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'KeyA', 'KeyD', 'KeyW', 'KeyP']
    if (gameKeys.includes(e.code)) {
      e.preventDefault()
    }
    if (!this._keys.has(e.code)) {
      this._justPressed.add(e.code)
    }
    this._keys.add(e.code)
  }

  _onKeyUp(e) {
    this._keys.delete(e.code)
  }

  _onMouseMove(e) {
    this._mousePos.x = e.clientX
    this._mousePos.y = e.clientY
  }

  _onMouseDown(e) {
    this._mouseDown = true
  }

  _onMouseUp(e) {
    this._mouseDown = false
  }

  isPressed(keyCode) {
    return this._keys.has(keyCode)
  }

  wasJustPressed(keyCode) {
    return this._justPressed.has(keyCode)
  }

  getMousePosition() {
    return { ...this._mousePos }
  }

  isMouseDown() {
    return this._mouseDown
  }

  clearJustPressed() {
    this._justPressed.clear()
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown)
    window.removeEventListener('keyup', this._onKeyUp)
    window.removeEventListener('mousemove', this._onMouseMove)
    window.removeEventListener('mousedown', this._onMouseDown)
    window.removeEventListener('mouseup', this._onMouseUp)
  }
}
