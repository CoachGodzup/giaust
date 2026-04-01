export class Platform {
  constructor(x, y, width, height, hasGap = false) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.hasGap = hasGap
    this.gapStart = hasGap ? x + width * 0.4 : 0
    this.gapEnd = hasGap ? x + width * 0.6 : 0
  }

  render(ctx) {
    ctx.save()

    ctx.fillStyle = '#666666'
    ctx.fillRect(this.x, this.y, this.width, this.height)

    ctx.fillStyle = '#888888'
    ctx.fillRect(this.x, this.y, this.width, 4)

    ctx.fillStyle = '#555555'
    ctx.fillRect(this.x, this.y + this.height - 2, this.width, 2)

    if (this.hasGap) {
      ctx.fillStyle = '#000000'
      ctx.fillRect(this.gapStart, this.y, this.gapEnd - this.gapStart, this.height)
    }

    ctx.restore()
  }

  containsPoint(px, py) {
    if (this.hasGap && px > this.gapStart && px < this.gapEnd) {
      return false
    }
    return (
      px >= this.x &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.height
    )
  }
}

export function createDefaultPlatforms() {
  return [
    new Platform(350, 120, 100, 16),
    new Platform(100, 200, 150, 16),
    new Platform(550, 200, 150, 16),
    new Platform(250, 300, 120, 16, true),
    new Platform(430, 300, 120, 16, true),
    new Platform(50, 400, 150, 16),
    new Platform(600, 400, 150, 16),
  ]
}
