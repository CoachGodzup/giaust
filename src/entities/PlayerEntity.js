import { Entity } from '../core/Entity.js'

export class PlayerEntity extends Entity {
  constructor(x, y) {
    super(x, y, 32, 32, 'player')
    this.flapPower = 350
    this.horizontalAcceleration = 1200
    this.wingFrame = 0
    this.wingTimer = 0
    this.flapCooldown = 0
    this.onPlatform = false
  }

  update(deltaTime, input, physics) {
    if (this.state === 'dead') return

    this.updateInvincibility(deltaTime)
    this.wingTimer += deltaTime
    if (this.wingTimer > 0.15) {
      this.wingFrame = (this.wingFrame + 1) % 2
      this.wingTimer = 0
    }

    if (this.flapCooldown > 0) {
      this.flapCooldown -= deltaTime
    }

    const moveLeft = input.isPressed('ArrowLeft') || input.isPressed('KeyA')
    const moveRight = input.isPressed('ArrowRight') || input.isPressed('KeyD')
    const flap = input.isPressed('ArrowUp') || input.isPressed('KeyW') || input.isPressed('Space')

    if (moveLeft) {
      physics.applyHorizontalForce(this, -1, this.horizontalAcceleration * deltaTime)
    }
    if (moveRight) {
      physics.applyHorizontalForce(this, 1, this.horizontalAcceleration * deltaTime)
    }

    if (flap && this.flapCooldown <= 0) {
      physics.applyThrust(this, this.flapPower)
      this.flapCooldown = 0.12
      this.onPlatform = false
    }

    physics.applyGravity(this, deltaTime)
    physics.applyFriction(this, deltaTime)
    physics.updatePosition(this, deltaTime)
  }

  render(ctx) {
    if (this.state === 'dead') return

    ctx.save()

    if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
      ctx.globalAlpha = 0.5
    }

    const x = this.position.x
    const y = this.position.y
    const w = this.bounds.width
    const h = this.bounds.height

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x + 12, y + 8, 8, 12)

    ctx.fillStyle = '#dddddd'
    if (this.wingFrame === 0) {
      ctx.fillRect(x + 2, y + 10, 10, 6)
      ctx.fillRect(x + 20, y + 10, 10, 6)
    } else {
      ctx.fillRect(x + 2, y + 4, 10, 6)
      ctx.fillRect(x + 20, y + 4, 10, 6)
    }

    ctx.fillStyle = '#ffcc00'
    ctx.fillRect(x + 14, y + 2, 4, 6)

    ctx.fillStyle = '#ff6600'
    ctx.fillRect(x + 13, y + 1, 6, 2)

    ctx.fillStyle = '#cccccc'
    ctx.fillRect(x + 8, y + 20, 16, 4)
    ctx.fillRect(x + 6, y + 24, 4, 8)
    ctx.fillRect(x + 22, y + 24, 4, 8)

    ctx.restore()
  }

  reset(x, y) {
    this.position.x = x
    this.position.y = y
    this.velocity.vx = 0
    this.velocity.vy = 0
    this.state = 'alive'
    this.setInvincible(2)
  }
}
