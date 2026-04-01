export class Entity {
  constructor(x, y, width, height, type) {
    this.position = { x, y }
    this.velocity = { vx: 0, vy: 0 }
    this.bounds = { width, height }
    this.type = type
    this.state = 'alive'
    this.invincible = false
    this.invincibleTimer = 0
  }

  get centerX() {
    return this.position.x + this.bounds.width / 2
  }

  get centerY() {
    return this.position.y + this.bounds.height / 2
  }

  get left() {
    return this.position.x
  }

  get right() {
    return this.position.x + this.bounds.width
  }

  get top() {
    return this.position.y
  }

  get bottom() {
    return this.position.y + this.bounds.height
  }

  update(deltaTime) {}

  render(ctx) {}

  applyForce(fx, fy) {
    this.velocity.vx += fx
    this.velocity.vy += fy
  }

  setInvincible(duration) {
    this.invincible = true
    this.invincibleTimer = duration
  }

  updateInvincibility(deltaTime) {
    if (this.invincible) {
      this.invincibleTimer -= deltaTime
      if (this.invincibleTimer <= 0) {
        this.invincible = false
        this.invincibleTimer = 0
      }
    }
  }
}
