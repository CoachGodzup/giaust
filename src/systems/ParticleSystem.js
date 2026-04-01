import { Entity } from '../core/Entity.js'

class Particle extends Entity {
  constructor(x, y, vx, vy, color, lifetime) {
    super(x, y, 4, 4, 'particle')
    this.velocity.vx = vx
    this.velocity.vy = vy
    this.color = color
    this.lifetime = lifetime
    this.age = 0
  }

  update(deltaTime) {
    this.age += deltaTime
    this.velocity.vy += 200 * deltaTime
    this.position.x += this.velocity.vx * deltaTime
    this.position.y += this.velocity.vy * deltaTime

    if (this.age >= this.lifetime) {
      this.state = 'dead'
    }
  }

  render(ctx) {
    if (this.state === 'dead') return

    const alpha = 1 - (this.age / this.lifetime)
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, this.bounds.width, this.bounds.height)
    ctx.restore()
  }
}

export class ParticleSystem {
  constructor() {
    this._pool = []
    this._active = []
    this._maxSize = 200
  }

  emit(x, y, count, color, speed = 100, lifetime = 0.5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const spd = Math.random() * speed
      const vx = Math.cos(angle) * spd
      const vy = Math.sin(angle) * spd

      let particle = this._pool.pop()
      if (particle) {
        particle.position.x = x
        particle.position.y = y
        particle.velocity.vx = vx
        particle.velocity.vy = vy
        particle.color = color
        particle.lifetime = lifetime
        particle.age = 0
        particle.state = 'alive'
      } else {
        particle = new Particle(x, y, vx, vy, color, lifetime)
      }

      this._active.push(particle)
    }
  }

  update(deltaTime) {
    for (let i = this._active.length - 1; i >= 0; i--) {
      this._active[i].update(deltaTime)
      if (this._active[i].state === 'dead') {
        this._pool.push(this._active.splice(i, 1)[0])
      }
    }
  }

  render(ctx) {
    for (const particle of this._active) {
      particle.render(ctx)
    }
  }

  clear() {
    this._pool.push(...this._active)
    this._active.length = 0
  }
}
