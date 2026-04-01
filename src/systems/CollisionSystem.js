export class CollisionSystem {
  static checkAABB(a, b) {
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    )
  }

  static checkCircleCollision(a, b, radiusA, radiusB) {
    const dx = a.centerX - b.centerX
    const dy = a.centerY - b.centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < radiusA + radiusB
  }

  static resolveRiderCollision(riderA, riderB) {
    if (riderA.invincible || riderB.invincible) {
      return null
    }

    const heightDiff = riderA.centerY - riderB.centerY
    const threshold = 5

    if (Math.abs(heightDiff) < threshold) {
      return 'both'
    } else if (riderA.centerY < riderB.centerY) {
      return 'A'
    } else {
      return 'B'
    }
  }

  static _overlapsPlatformSolid(entity, platform) {
    if (!platform.hasGap) return true

    const entityLeft = entity.left
    const entityRight = entity.right

    const gapLeft = platform.gapStart
    const gapRight = platform.gapEnd

    if (entityRight <= gapLeft || entityLeft >= gapRight) return true
    return false
  }

  static checkEntityVsPlatforms(entity, platforms) {
    for (const platform of platforms) {
      if (this.checkAABB(entity, platform) && this._overlapsPlatformSolid(entity, platform)) {
        if (entity.velocity.vy > 0 && entity.bottom - entity.velocity.vy * 0.016 <= platform.top + 5) {
          return { platform, collision: 'top' }
        }
        if (entity.velocity.vy < 0 && entity.top - entity.velocity.vy * 0.016 >= platform.bottom - 5) {
          return { platform, collision: 'bottom' }
        }
      }
    }
    return null
  }

  static checkEntityVsLava(entity, lavaY) {
    return entity.bottom >= lavaY
  }
}
