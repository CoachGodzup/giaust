import { Entity } from '../core/Entity.js'

export class EggEntity extends Entity {
  constructor(x, y, ownerType = 'enemy') {
    super(x, y, 16, 20, 'egg')
    this.ownerType = ownerType
    this.hatchTimer = 15
    this.crackStage = 0
    this.collected = false
    this.falling = true
  }

  update(deltaTime, platforms, lavaY) {
    if (this.collected || this.state === 'dead') return

    if (this.falling) {
      this.velocity.vy += 400 * deltaTime
      this.position.y += this.velocity.vy * deltaTime

      for (const platform of platforms) {
        if (
          this.position.x + this.bounds.width > platform.x &&
          this.position.x < platform.x + platform.width &&
          this.position.y + this.bounds.height >= platform.y &&
          this.position.y + this.bounds.height <= platform.y + 10
        ) {
          this.position.y = platform.y - this.bounds.height
          this.velocity.vy = 0
          this.falling = false
          break
        }
      }

      if (this.position.y + this.bounds.height >= lavaY) {
        this.state = 'dead'
      }
    }

    if (!this.falling) {
      this.hatchTimer -= deltaTime
      if (this.hatchTimer < 5) {
        this.crackStage = 1
      }
      if (this.hatchTimer < 2) {
        this.crackStage = 2
      }
      if (this.hatchTimer <= 0) {
        this.state = 'hatched'
      }
    }
  }

  render(ctx) {
    if (this.state === 'dead' || this.collected) return

    ctx.save()

    const x = this.position.x
    const y = this.position.y

    ctx.fillStyle = '#ffffcc'
    ctx.fillRect(x + 4, y + 2, 8, 16)
    ctx.fillRect(x + 2, y + 4, 12, 12)

    if (this.crackStage >= 1) {
      ctx.fillStyle = '#000000'
      ctx.fillRect(x + 7, y + 6, 2, 8)
    }
    if (this.crackStage >= 2) {
      ctx.fillRect(x + 4, y + 8, 2, 4)
      ctx.fillRect(x + 10, y + 5, 2, 6)
    }

    ctx.restore()
  }

  get points() {
    if (this.hatchTimer > 10) return 200
    if (this.hatchTimer > 5) return 250
    return 300
  }
}
