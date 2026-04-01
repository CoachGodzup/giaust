import { Entity } from '../core/Entity.js'

export class LavaMonsterEntity extends Entity {
  constructor(x, y, width) {
    super(x, y, 60, 80, 'lavaMonster')
    this.lavaY = y
    this.rising = false
    this.riseTimer = 0
    this.riseInterval = 10 + Math.random() * 10
    this.riseDuration = 3
    this.maxRiseHeight = 100
    this.active = false
  }

  update(deltaTime) {
    this.riseTimer -= deltaTime

    if (!this.rising && this.riseTimer <= 0) {
      this.rising = true
      this.active = true
      this.riseTimer = this.riseDuration
    }

    if (this.rising) {
      this.position.y -= 80 * deltaTime
      if (this.position.y <= this.lavaY - this.maxRiseHeight) {
        this.position.y = this.lavaY - this.maxRiseHeight
      }

      this.riseTimer -= deltaTime
      if (this.riseTimer <= 0) {
        this.rising = false
        this.riseTimer = this.riseInterval + Math.random() * 5
      }
    } else {
      this.position.y += 60 * deltaTime
      if (this.position.y >= this.lavaY) {
        this.position.y = this.lavaY
        this.active = false
      }
    }
  }

  render(ctx) {
    ctx.save()

    const x = this.position.x
    const y = this.position.y

    ctx.fillStyle = '#cc3300'
    ctx.fillRect(x + 10, y + 20, 40, 50)

    ctx.fillStyle = '#ff6600'
    ctx.fillRect(x + 5, y + 10, 50, 30)

    ctx.fillStyle = '#ff0000'
    ctx.fillRect(x + 15, y, 30, 20)

    ctx.fillStyle = '#ffff00'
    ctx.fillRect(x + 18, y + 5, 8, 8)
    ctx.fillRect(x + 34, y + 5, 8, 8)

    ctx.fillStyle = '#000000'
    ctx.fillRect(x + 20, y + 7, 4, 4)
    ctx.fillRect(x + 36, y + 7, 4, 4)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x + 15, y + 15, 30, 4)
    ctx.fillRect(x + 20, y + 19, 4, 6)
    ctx.fillRect(x + 28, y + 19, 4, 6)
    ctx.fillRect(x + 36, y + 19, 4, 6)

    ctx.fillStyle = '#cc3300'
    ctx.fillRect(x, y + 40, 10, 30)
    ctx.fillRect(x + 50, y + 40, 10, 30)

    ctx.restore()
  }

  reset(lavaY) {
    this.lavaY = lavaY
    this.position.y = lavaY
    this.rising = false
    this.riseTimer = 10 + Math.random() * 10
    this.active = false
  }
}
