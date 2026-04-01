import { Entity } from '../core/Entity.js'

export class EnemyEntity extends Entity {
  constructor(x, y, enemyType) {
    super(x, y, 32, 32, 'enemy')
    this.enemyType = enemyType
    this.wingFrame = 0
    this.wingTimer = 0
    this.aiTimer = 0
    this.aiState = 'wander'
    this.targetX = x
    this.targetY = y
    this.onPlatform = false

    switch (enemyType) {
      case 'bounder':
        this.color = '#44aa44'
        this.maxSpeed = 120
        this.aggression = 0.3
        this.points = 100
        break
      case 'hunter':
        this.color = '#cc3333'
        this.maxSpeed = 150
        this.aggression = 0.7
        this.points = 150
        break
      case 'shadow':
        this.color = '#333366'
        this.maxSpeed = 180
        this.aggression = 0.9
        this.points = 200
        break
      default:
        this.color = '#44aa44'
        this.maxSpeed = 120
        this.aggression = 0.3
        this.points = 100
    }
  }

  update(deltaTime, player, lavaY, platforms) {
    if (this.state === 'dead') return

    this.wingTimer += deltaTime
    if (this.wingTimer > 0.15) {
      this.wingFrame = (this.wingFrame + 1) % 2
      this.wingTimer = 0
    }

    this.aiTimer -= deltaTime
    if (this.aiTimer <= 0) {
      this._updateAI(player, lavaY)
      this.aiTimer = 0.5 + Math.random() * 1
    }

    const dx = this.targetX - this.centerX
    const dy = this.targetY - this.centerY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > 5) {
      const nx = dx / dist
      const ny = dy / dist
      this.velocity.vx += nx * 400 * deltaTime
      if (ny < -0.2) {
        this.velocity.vy += ny * 300 * deltaTime
      }
    }

    const speed = Math.sqrt(this.velocity.vx ** 2 + this.velocity.vy ** 2)
    if (speed > this.maxSpeed) {
      this.velocity.vx = (this.velocity.vx / speed) * this.maxSpeed
      this.velocity.vy = (this.velocity.vy / speed) * this.maxSpeed
    }

    this.velocity.vy += 600 * deltaTime
    if (this.velocity.vy > 350) {
      this.velocity.vy = 350
    }

    this.velocity.vx *= 0.95

    this.position.x += this.velocity.vx * deltaTime
    this.position.y += this.velocity.vy * deltaTime

    if (this.position.x < 0) {
      this.position.x = 0
      this.velocity.vx = Math.abs(this.velocity.vx) * 0.5
    }
    if (this.position.x + this.bounds.width > 800) {
      this.position.x = 800 - this.bounds.width
      this.velocity.vx = -Math.abs(this.velocity.vx) * 0.5
    }

    if (this.position.y + this.bounds.height >= lavaY - 20) {
      this.velocity.vy = -200
      this.position.y = lavaY - 20 - this.bounds.height
    }
  }

  _updateAI(player, lavaY) {
    const playerCenterX = player.centerX
    const playerCenterY = player.centerY

    if (Math.random() < this.aggression && player.state === 'alive') {
      this.aiState = 'chase'
      this.targetX = playerCenterX + (Math.random() - 0.5) * 50
      this.targetY = playerCenterY - 30 - Math.random() * 40
    } else {
      this.aiState = 'wander'
      this.targetX = 100 + Math.random() * 600
      this.targetY = 50 + Math.random() * (lavaY - 150)
    }
  }

  render(ctx) {
    if (this.state === 'dead') return

    ctx.save()

    const x = this.position.x
    const y = this.position.y
    const w = this.bounds.width
    const h = this.bounds.height

    ctx.fillStyle = this.color
    ctx.fillRect(x + 12, y + 8, 8, 12)

    ctx.fillStyle = this.color
    if (this.wingFrame === 0) {
      ctx.fillRect(x + 2, y + 10, 10, 6)
      ctx.fillRect(x + 20, y + 10, 10, 6)
    } else {
      ctx.fillRect(x + 2, y + 4, 10, 6)
      ctx.fillRect(x + 20, y + 4, 10, 6)
    }

    ctx.fillStyle = '#ffdd00'
    ctx.fillRect(x + 14, y + 2, 4, 6)

    ctx.fillStyle = '#ff0000'
    ctx.fillRect(x + 13, y + 1, 6, 2)

    ctx.fillStyle = '#888888'
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
    this.aiState = 'wander'
  }
}
