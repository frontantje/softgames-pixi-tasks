import { BaseTaskScene } from "../core/BaseTaskScene";
import { SceneManager } from "../core/SceneManager";
import { Text, Sprite, Graphics, Texture, Container } from "pixi.js";

interface FireParticle {
  sprite: Sprite;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  startScale: number;
}

export class Task3Scene extends BaseTaskScene {
  static readonly LABEL = "Task 3: Phoenix Flame";

  // Particle settings
  private readonly MAX_PARTICLES = 10;
  private readonly PARTICLE_COLORS = [0xff4500, 0xff6600, 0xff8c00, 0xffd700];

  // Spawn settings
  private readonly BASE_SPREAD = 30;
  private readonly VELOCITY_X_SPREAD = 40;
  private readonly VELOCITY_Y_BASE = 90;
  private readonly VELOCITY_Y_VARIANCE = 100;
  private readonly LIFETIME_BASE = 1.5;
  private readonly LIFETIME_VARIANCE = 1;
  private readonly SCALE_BASE = 0.5;
  private readonly SCALE_VARIANCE = 0.5;
  private readonly TURBULENCE = 50;

  private titleText!: Text;
  private particleContainer!: Container;
  private particles: FireParticle[] = [];
  private particleTexture!: Texture;
  private fireBaseX: number = 0;
  private fireBaseY: number = 0;

  constructor(sceneManager: SceneManager) {
    super(sceneManager, Task3Scene.LABEL);
    this.init();
  }

  private init() {
    // Title
    this.titleText = new Text({
      text: this.label,
      style: { fontSize: 32, fill: 0xffffff, align: "center" },
    });
    this.titleText.anchor.set(0.5);
    this.content.addChild(this.titleText);

    // Create particle container with additive blending for glow
    this.particleContainer = new Container();
    this.content.addChild(this.particleContainer);

    // Create the particle texture (soft gradient circle)
    this.particleTexture = this.createParticleTexture();

    // Initialize all particles (pool them for reuse)
    for (let i = 0; i < this.MAX_PARTICLES; i++) {
      const sprite = new Sprite(this.particleTexture);
      sprite.anchor.set(0.5);
      sprite.blendMode = "add"; // Additive blending for fire glow
      sprite.visible = false;
      this.particleContainer.addChild(sprite);

      // Stagger initial spawns with 0.1s delay between each
      this.particles.push({
        sprite,
        velocityX: 0,
        velocityY: 0,
        life: -i * 0.2,
        maxLife: 0,
        startScale: 1,
      });
    }
  }

  private createParticleTexture(): Texture {
    const graphics = new Graphics();
    const radius = 32;

    // Create a soft radial gradient circle
    const steps = 8;
    for (let i = steps; i >= 0; i--) {
      const ratio = i / steps;
      const alpha = 1 - ratio;
      const r = radius * ratio + 2;

      graphics.circle(0, 0, r);
      graphics.fill({ color: 0xffffff, alpha: alpha * 0.8 });
    }

    // Generate texture from graphics
    const texture = this.sceneManager.renderer.generateTexture(graphics);
    graphics.destroy();

    return texture;
  }

  private spawnParticle(particle: FireParticle) {
    // Reset particle at fire base
    particle.sprite.x =
      this.fireBaseX + (Math.random() - 0.5) * this.BASE_SPREAD;
    particle.sprite.y = this.fireBaseY;

    // Random upward velocity with slight horizontal drift
    particle.velocityX = (Math.random() - 0.5) * this.VELOCITY_X_SPREAD;
    particle.velocityY = -(
      this.VELOCITY_Y_BASE +
      Math.random() * this.VELOCITY_Y_VARIANCE
    );

    // Life and scale
    particle.maxLife =
      this.LIFETIME_BASE + Math.random() * this.LIFETIME_VARIANCE;
    particle.life = particle.maxLife;
    particle.startScale = this.SCALE_BASE + Math.random() * this.SCALE_VARIANCE;

    // Random fire color
    const color =
      this.PARTICLE_COLORS[
        Math.floor(Math.random() * this.PARTICLE_COLORS.length)
      ];
    particle.sprite.tint = color;

    particle.sprite.visible = true;
    particle.sprite.alpha = 1;
    particle.sprite.scale.set(particle.startScale);
  }

  public update(delta: number): void {
    const dt = delta / 1000; // Convert milliseconds to seconds

    for (const particle of this.particles) {
      // Handle initial staggered spawn (maxLife === 0 means never spawned yet)
      if (particle.maxLife === 0) {
        if (particle.life < 0) {
          particle.life += dt;
          continue;
        }
        // Ready for first spawn
        this.spawnParticle(particle);
        continue;
      }

      // Respawn when life runs out
      if (particle.life <= 0) {
        this.spawnParticle(particle);
        continue;
      }

      // Update life
      particle.life -= dt;

      // Calculate life ratio (1 = just spawned, 0 = dead)
      const lifeRatio = Math.max(0, particle.life / particle.maxLife);

      // Move particle
      particle.sprite.x += particle.velocityX * dt;
      particle.sprite.y += particle.velocityY * dt;

      // Add some turbulence/flicker
      particle.velocityX += (Math.random() - 0.5) * this.TURBULENCE * dt;

      // Slow down vertical velocity slightly (heat dissipation)
      particle.velocityY *= Math.pow(0.99, dt * 60);

      // Scale: grows slightly then shrinks
      const scaleCurve = Math.sin(lifeRatio * Math.PI);
      particle.sprite.scale.set(particle.startScale * (0.3 + scaleCurve * 0.7));

      // Fade out
      particle.sprite.alpha = lifeRatio;

      // Color transition: orange -> red -> dark as it dies
      if (lifeRatio < 0.3) {
        particle.sprite.tint = 0xff2200; // Dark red near death
      } else if (lifeRatio < 0.6) {
        particle.sprite.tint = 0xff4500; // Orange-red
      }
    }
  }

  protected onContentResize(height: number): void {
    this.titleText.y = -height / 2 + 60;

    // Position fire base at bottom center of content area
    this.fireBaseX = 0;
    this.fireBaseY = height / 4; // Slightly below center

    this.centerContent();
  }
}
