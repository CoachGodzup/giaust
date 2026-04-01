import { EnemyEntity } from '../entities/EnemyEntity.js'
import { PterodactylEntity } from '../entities/PterodactylEntity.js'
import { EggEntity } from '../entities/EggEntity.js'

export class WaveSystem {
  constructor() {
    this.currentWave = 0
    this.enemiesDefeated = 0
    this.enemiesToDefeatForPterodactyl = 5
    this.waveActive = false
    this.waveComplete = false
    this.waveCompleteTimer = 0
  }

  getWaveConfig(waveNumber) {
    const enemies = []

    if (waveNumber <= 1) {
      enemies.push({ type: 'bounder', count: 2 })
    } else if (waveNumber === 2) {
      enemies.push({ type: 'bounder', count: 2 })
      enemies.push({ type: 'hunter', count: 1 })
    } else if (waveNumber === 3) {
      enemies.push({ type: 'bounder', count: 3 })
      enemies.push({ type: 'hunter', count: 1 })
    } else if (waveNumber === 4) {
      enemies.push({ type: 'bounder', count: 3 })
      enemies.push({ type: 'hunter', count: 2 })
    } else if (waveNumber === 5) {
      enemies.push({ type: 'bounder', count: 4 })
      enemies.push({ type: 'hunter', count: 2 })
    } else {
      const bounders = Math.min(4 + Math.floor(waveNumber / 2), 8)
      const hunters = Math.min(2 + Math.floor(waveNumber / 3), 5)
      const shadows = Math.min(Math.floor((waveNumber - 5) / 2), 4)

      enemies.push({ type: 'bounder', count: bounders })
      enemies.push({ type: 'hunter', count: hunters })
      if (shadows > 0) {
        enemies.push({ type: 'shadow', count: shadows })
      }
    }

    return enemies
  }

  getHatchTime(waveNumber) {
    return Math.max(15 - waveNumber * 1.5, 5)
  }

  startWave(waveNumber, enemies, platforms, lavaY) {
    this.currentWave = waveNumber
    this.waveActive = true
    this.waveComplete = false
    this.enemiesDefeated = 0

    const config = this.getWaveConfig(waveNumber)
    const hatchTime = this.getHatchTime(waveNumber)

    enemies.length = 0

    for (const group of config) {
      for (let i = 0; i < group.count; i++) {
        const spawnX = 50 + Math.random() * 700
        const spawnY = 50 + Math.random() * 100
        const enemy = new EnemyEntity(spawnX, spawnY, group.type)
        enemy.hatchTime = hatchTime
        enemies.push(enemy)
      }
    }
  }

  checkWaveComplete(enemies) {
    if (!this.waveActive) return false

    const aliveEnemies = enemies.filter(e => e.state === 'alive')
    if (aliveEnemies.length === 0 && this.waveActive) {
      this.waveActive = false
      this.waveComplete = true
      this.waveCompleteTimer = 2
      return true
    }
    return false
  }

  shouldSpawnPterodactyl() {
    return this.enemiesDefeated > 0 && this.enemiesDefeated % this.enemiesToDefeatForPterodactyl === 0
  }

  spawnPterodactyl() {
    const fromLeft = Math.random() > 0.5
    const y = 100 + Math.random() * 300
    return new PterodactylEntity(fromLeft ? -50 : 850, y)
  }

  updateWaveCompleteTimer(deltaTime) {
    if (this.waveComplete) {
      this.waveCompleteTimer -= deltaTime
      if (this.waveCompleteTimer <= 0) {
        this.waveComplete = false
        return true
      }
    }
    return false
  }
}
