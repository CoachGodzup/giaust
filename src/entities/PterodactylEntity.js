import { Entity } from '../core/Entity.js'

export class PterodactylEntity extends Entity {
  constructor(x, y) {
    super(x, y, 40, 24, 'pterodactyl')
    this.direction = x < 400 ? 1 : -1
    this.velocity.vx = this.direction * 200
    this.wingFrame = 0
    this.wingTimer = 0
    this.points = 500
  }

  update(deltaTime) {
    if (this.state === 'dead') return

    this.wingTimer += deltaTime
    if (this.wingTimer > 0.1) {
      this.wingFrame = (this.wingFrame + 1) % 2
      this.wingTimer = 0
    }

    this.position.x += this.velocity.vx * deltaTime

    if (this.position.x > 850 || this.position.x < -50) {
      this.state = 'dead'
    }
  }

  render(ctx) {
    if (this.state === 'dead') return

    ctx.save()

    const x = this.position.x
    const y = this.position.y

    ctx.fillStyle = '#cc6633'
    ctx.fillRect(x + 15, y + 8, 12, 8)

    ctx.fillStyle = '#aa5522'
    if (this.wingFrame === 0) {
      ctx.fillRect(x + 2, y + 4, 14, 6)
      ctx.fillRect(x + 26, y + 4, 14, 6)
    } else {
      ctx.fillRect(x + 2, y + 14, 14, 6)
      ctx.fillRect(x + 26, y + 14, 14, 6)
    }

    ctx.fillStyle = '#ffcc00'
    ctx.fillRect(x + 8, y + 6, 6, 4)

    ctx.fillStyle = '#ff0000'
    ctx.fillRect(x + 6, y + 7, 3, 2)

    ctx.restore()
  }
}
