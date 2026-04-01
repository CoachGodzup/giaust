export class PhysicsSystem {
  constructor(config = {}) {
    this.gravity = config.gravity ?? 800
    this.terminalVelocity = config.terminalVelocity ?? 400
    this.friction = config.friction ?? 0.92
    this.maxHorizontalSpeed = config.maxHorizontalSpeed ?? 250
  }

  applyGravity(entity, deltaTime) {
    entity.velocity.vy += this.gravity * deltaTime
    if (entity.velocity.vy > this.terminalVelocity) {
      entity.velocity.vy = this.terminalVelocity
    }
  }

  applyThrust(entity, thrustAmount) {
    entity.velocity.vy -= thrustAmount
  }

  applyHorizontalForce(entity, direction, acceleration) {
    entity.velocity.vx += direction * acceleration
    if (entity.velocity.vx > this.maxHorizontalSpeed) {
      entity.velocity.vx = this.maxHorizontalSpeed
    } else if (entity.velocity.vx < -this.maxHorizontalSpeed) {
      entity.velocity.vx = -this.maxHorizontalSpeed
    }
  }

  applyFriction(entity, deltaTime) {
    entity.velocity.vx *= Math.pow(this.friction, deltaTime * 60)
  }

  updatePosition(entity, deltaTime) {
    entity.position.x += entity.velocity.vx * deltaTime
    entity.position.y += entity.velocity.vy * deltaTime
  }

  constrainToCanvas(entity, canvasWidth, canvasHeight) {
    if (entity.position.x < 0) {
      entity.position.x = 0
      entity.velocity.vx = 0
    }
    if (entity.position.x + entity.bounds.width > canvasWidth) {
      entity.position.x = canvasWidth - entity.bounds.width
      entity.velocity.vx = 0
    }
    if (entity.position.y < 0) {
      entity.position.y = 0
      entity.velocity.vy = 0
    }
  }
}
