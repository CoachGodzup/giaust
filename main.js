import { GameLoop } from './src/core/GameLoop.js'
import { InputManager } from './src/core/InputManager.js'
import { PhysicsSystem } from './src/systems/PhysicsSystem.js'
import { CollisionSystem } from './src/systems/CollisionSystem.js'
import { WaveSystem } from './src/systems/WaveSystem.js'
import { ParticleSystem } from './src/systems/ParticleSystem.js'
import { PlayerEntity } from './src/entities/PlayerEntity.js'
import { EggEntity } from './src/entities/EggEntity.js'
import { createDefaultPlatforms } from './src/entities/Platform.js'
import { LavaMonsterEntity } from './src/entities/LavaMonsterEntity.js'

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = 800
    this.canvas.height = 600

    this.input = new InputManager()
    this.physics = new PhysicsSystem()
    this.waveSystem = new WaveSystem()
    this.particles = new ParticleSystem()

    this.platforms = createDefaultPlatforms()
    this.lavaY = 560
    this.lavaMonster = new LavaMonsterEntity(370, this.lavaY, 60)

    this.player = new PlayerEntity(400, 300)
    this.enemies = []
    this.eggs = []
    this.pterodactyls = []

    this.score = 0
    this.lives = 1
    this.extraLifeThreshold = 10000
    this.nextExtraLife = this.extraLifeThreshold

    this.gameState = 'title'
    this.paused = false

    this.audioCtx = null

    this.setupUI()
    this.gameLoop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render()
    )

    this.setupInput()
    this.gameLoop.start()
  }

  setupUI() {
    this.scoreDisplay = document.getElementById('score-display')
    this.livesDisplay = document.getElementById('lives-display')
    this.waveDisplay = document.getElementById('wave-display')
    this.titleScreen = document.getElementById('title-screen')
    this.pauseScreen = document.getElementById('pause-screen')
    this.gameoverScreen = document.getElementById('gameover-screen')
    this.finalScore = document.getElementById('final-score')
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      if (this.gameState === 'title' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault()
        this.startGame()
      } else if (this.gameState === 'gameover' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault()
        this.restartGame()
      } else if (this.gameState === 'playing' && e.code === 'KeyP') {
        e.preventDefault()
        this.togglePause()
      } else if (this.gameState === 'paused' && e.code === 'KeyP') {
        e.preventDefault()
        this.togglePause()
      }
    })
  }

  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  playSound(type) {
    if (!this.audioCtx) return

    const oscillator = this.audioCtx.createOscillator()
    const gainNode = this.audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioCtx.destination)

    switch (type) {
      case 'flap':
        oscillator.frequency.setValueAtTime(300, this.audioCtx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioCtx.currentTime + 0.05)
        gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05)
        oscillator.start(this.audioCtx.currentTime)
        oscillator.stop(this.audioCtx.currentTime + 0.05)
        break

      case 'collision':
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(200, this.audioCtx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.2)
        oscillator.start(this.audioCtx.currentTime)
        oscillator.stop(this.audioCtx.currentTime + 0.2)
        break

      case 'collect':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(800, this.audioCtx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.15, this.audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1)
        oscillator.start(this.audioCtx.currentTime)
        oscillator.stop(this.audioCtx.currentTime + 0.1)
        break

      case 'hatch':
        oscillator.type = 'square'
        oscillator.frequency.setValueAtTime(400, this.audioCtx.currentTime)
        oscillator.frequency.linearRampToValueAtTime(600, this.audioCtx.currentTime + 0.1)
        oscillator.frequency.linearRampToValueAtTime(400, this.audioCtx.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.2)
        oscillator.start(this.audioCtx.currentTime)
        oscillator.stop(this.audioCtx.currentTime + 0.2)
        break

      case 'waveComplete':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(523, this.audioCtx.currentTime)
        oscillator.frequency.setValueAtTime(659, this.audioCtx.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(784, this.audioCtx.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.15, this.audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3)
        oscillator.start(this.audioCtx.currentTime)
        oscillator.stop(this.audioCtx.currentTime + 0.3)
        break

      case 'gameOver':
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(400, this.audioCtx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.5)
        gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5)
        oscillator.start(this.audioCtx.currentTime)
        oscillator.stop(this.audioCtx.currentTime + 0.5)
        break

      case 'roar':
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(100, this.audioCtx.currentTime)
        oscillator.frequency.linearRampToValueAtTime(150, this.audioCtx.currentTime + 0.2)
        oscillator.frequency.linearRampToValueAtTime(80, this.audioCtx.currentTime + 0.4)
        gainNode.gain.setValueAtTime(0.15, this.audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.4)
        oscillator.start(this.audioCtx.currentTime)
        oscillator.stop(this.audioCtx.currentTime + 0.4)
        break
    }
  }

  startGame() {
    this.initAudio()
    this.gameState = 'playing'
    this.titleScreen.classList.add('hidden')
    this.gameoverScreen.classList.add('hidden')
    this.score = 0
    this.lives = 1
    this.nextExtraLife = this.extraLifeThreshold
    this.player.reset(400, 300)
    this.eggs = []
    this.pterodactyls = []
    this.particles.clear()
    this.waveSystem.currentWave = 0
    this.nextWave()
    this.updateUI()
  }

  restartGame() {
    this.startGame()
  }

  togglePause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused'
      this.pauseScreen.classList.remove('hidden')
    } else if (this.gameState === 'paused') {
      this.gameState = 'playing'
      this.pauseScreen.classList.add('hidden')
    }
  }

  nextWave() {
    this.waveSystem.startWave(this.waveSystem.currentWave + 1, this.enemies, this.platforms, this.lavaY)
    this.lavaMonster.reset(this.lavaY)
  }

  update(deltaTime) {
    if (this.gameState !== 'playing') return

    this.player.update(deltaTime, this.input, this.physics)
    this.physics.constrainToCanvas(this.player, this.canvas.width, this.canvas.height)

    this.checkPlatformCollision(this.player)

    if (CollisionSystem.checkEntityVsLava(this.player, this.lavaY)) {
      this.playerDeath()
    }

    for (const enemy of this.enemies) {
      if (enemy.state === 'dead') continue
      enemy.update(deltaTime, this.player, this.lavaY, this.platforms)
      this.checkPlatformCollision(enemy)

      if (CollisionSystem.checkAABB(this.player, enemy)) {
        this.resolveRiderCollision(this.player, enemy)
      }
    }

    for (let i = this.pterodactyls.length - 1; i >= 0; i--) {
      const ptero = this.pterodactyls[i]
      ptero.update(deltaTime)

      if (ptero.state === 'dead') {
        this.pterodactyls.splice(i, 1)
        continue
      }

      if (CollisionSystem.checkAABB(this.player, ptero)) {
        this.resolveRiderCollision(this.player, ptero)
      }
    }

    for (let i = this.eggs.length - 1; i >= 0; i--) {
      const egg = this.eggs[i]
      egg.update(deltaTime, this.platforms, this.lavaY)

      if (egg.state === 'hatched') {
        this.hatchEgg(egg)
        this.eggs.splice(i, 1)
        continue
      }

      if (egg.state === 'dead') {
        this.eggs.splice(i, 1)
        continue
      }

      if (!egg.collected && CollisionSystem.checkAABB(this.player, egg)) {
        this.collectEgg(egg)
        this.eggs.splice(i, 1)
      }
    }

    this.lavaMonster.update(deltaTime)

    if (this.lavaMonster.active && CollisionSystem.checkAABB(this.player, this.lavaMonster)) {
      this.playerDeath()
    }

    this.waveSystem.checkWaveComplete(this.enemies)

    if (this.waveSystem.waveComplete) {
      if (this.waveSystem.updateWaveCompleteTimer(deltaTime)) {
        this.nextWave()
      }
    }

    this.particles.update(deltaTime)

    if (this.score >= this.nextExtraLife) {
      this.lives++
      this.nextExtraLife += this.extraLifeThreshold
      this.playSound('waveComplete')
    }

    this.updateUI()
    this.input.clearJustPressed()
  }

  checkPlatformCollision(entity) {
    const result = CollisionSystem.checkEntityVsPlatforms(entity, this.platforms)
    if (result && result.collision === 'top') {
      entity.position.y = result.platform.y - entity.bounds.height
      entity.velocity.vy = 0
      entity.onPlatform = true
    } else {
      entity.onPlatform = false
    }
  }

  resolveRiderCollision(riderA, riderB) {
    const result = CollisionSystem.resolveRiderCollision(riderA, riderB)

    if (result === 'both') {
      this.defeatRider(riderA)
      if (riderB.type === 'enemy') {
        this.defeatEnemy(riderB)
      } else if (riderB.type === 'pterodactyl') {
        this.defeatPterodactyl(riderB)
      }
    } else if (result === 'A') {
      if (riderA.type === 'player') {
        this.defeatEnemy(riderB)
      } else {
        this.defeatRider(riderA)
        if (riderB.type === 'player') {
          this.defeatRider(riderB)
        }
      }
    } else if (result === 'B') {
      if (riderB.type === 'player') {
        if (riderA.type === 'enemy') {
          this.defeatEnemy(riderA)
        } else if (riderA.type === 'pterodactyl') {
          this.defeatPterodactyl(riderA)
        }
      } else {
        this.defeatRider(riderB)
        if (riderA.type === 'player') {
          this.defeatRider(riderA)
        }
      }
    }

    this.playSound('collision')
  }

  defeatRider(rider) {
    if (rider.type === 'player') {
      this.playerDeath()
    } else if (rider.type === 'enemy') {
      this.defeatEnemy(rider)
    }
  }

  defeatEnemy(enemy) {
    if (enemy.state === 'dead') return
    enemy.state = 'dead'
    this.score += enemy.points
    this.waveSystem.enemiesDefeated++

    this.particles.emit(enemy.centerX, enemy.centerY, 10, enemy.color, 150, 0.5)

    const egg = new EggEntity(enemy.centerX - 8, enemy.centerY, 'enemy')
    egg.hatchTimer = enemy.hatchTime || this.waveSystem.getHatchTime(this.waveSystem.currentWave)
    this.eggs.push(egg)

    if (this.waveSystem.shouldSpawnPterodactyl()) {
      this.pterodactyls.push(this.waveSystem.spawnPterodactyl())
    }
  }

  defeatPterodactyl(ptero) {
    if (ptero.state === 'dead') return
    ptero.state = 'dead'
    this.score += ptero.points
    this.particles.emit(ptero.centerX, ptero.centerY, 15, '#cc6633', 200, 0.6)
  }

  playerDeath() {
    if (this.player.invincible || this.player.state === 'dead') return

    this.player.state = 'dead'
    this.lives--

    this.particles.emit(this.player.centerX, this.player.centerY, 15, '#ffffff', 200, 0.8)
    this.playSound('gameOver')

    const egg = new EggEntity(this.player.centerX - 8, this.player.centerY, 'player')
    egg.hatchTimer = 20
    this.eggs.push(egg)

    if (this.lives <= 0) {
      setTimeout(() => {
        this.gameState = 'gameover'
        this.finalScore.textContent = `Score: ${this.score}`
        this.gameoverScreen.classList.remove('hidden')
      }, 1000)
    } else {
      setTimeout(() => {
        this.player.reset(400, 300)
      }, 1500)
    }
  }

  collectEgg(egg) {
    egg.collected = true
    this.score += egg.points
    this.particles.emit(egg.centerX, egg.centerY, 5, '#ffffcc', 80, 0.3)
    this.playSound('collect')
  }

  hatchEgg(egg) {
    const enemy = new EnemyEntity(egg.position.x, egg.position.y, 'bounder')
    enemy.hatchTime = this.waveSystem.getHatchTime(this.waveSystem.currentWave)
    this.enemies.push(enemy)
    this.particles.emit(egg.centerX, egg.centerY, 8, '#ffffcc', 100, 0.4)
    this.playSound('hatch')
  }

  updateUI() {
    this.scoreDisplay.textContent = `Score: ${this.score}`
    this.livesDisplay.textContent = `Lives: ${this.lives}`
    this.waveDisplay.textContent = `Wave: ${this.waveSystem.currentWave}`
  }

  render() {
    const ctx = this.ctx

    ctx.fillStyle = '#0a0a2e'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    for (const star of this._getStars()) {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`
      ctx.fillRect(star.x, star.y, 2, 2)
    }

    this.renderLava(ctx)

    this.lavaMonster.render(ctx)

    for (const platform of this.platforms) {
      platform.render(ctx)
    }

    for (const egg of this.eggs) {
      egg.render(ctx)
    }

    for (const enemy of this.enemies) {
      enemy.render(ctx)
    }

    for (const ptero of this.pterodactyls) {
      ptero.render(ctx)
    }

    this.player.render(ctx)

    this.particles.render(ctx)

    if (this.waveSystem.waveComplete) {
      ctx.save()
      ctx.fillStyle = '#ffffff'
      ctx.font = '36px Courier New'
      ctx.textAlign = 'center'
      ctx.fillText(`WAVE ${this.waveSystem.currentWave} COMPLETE!`, this.canvas.width / 2, this.canvas.height / 2)
      ctx.restore()
    }
  }

  renderLava(ctx) {
    const gradient = ctx.createLinearGradient(0, this.lavaY, 0, this.canvas.height)
    gradient.addColorStop(0, '#ff6600')
    gradient.addColorStop(0.5, '#cc3300')
    gradient.addColorStop(1, '#660000')

    ctx.fillStyle = gradient
    ctx.fillRect(0, this.lavaY, this.canvas.width, this.canvas.height - this.lavaY)

    ctx.fillStyle = '#ff9933'
    const time = Date.now() / 500
    for (let i = 0; i < 20; i++) {
      const x = (i * 45 + time * 20) % this.canvas.width
      const y = this.lavaY + Math.sin(time + i) * 3
      ctx.fillRect(x, y, 20, 4)
    }
  }

  _stars = null
  _getStars() {
    if (!this._stars) {
      this._stars = []
      for (let i = 0; i < 50; i++) {
        this._stars.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * (this.lavaY - 50),
          alpha: 0.3 + Math.random() * 0.7
        })
      }
    }
    return this._stars
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game()
})
