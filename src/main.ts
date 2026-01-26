import { Application } from "pixi.js";
import { SceneManager } from "./core/SceneManager.ts";
import { MenuScene } from "./scenes/MenuScene.ts";
import { FPSCounter } from "./ui/FPSCounter.ts";
import { BaseCard } from "./core/BaseCard.ts";

class App {
  private app!: Application;
  private sceneManager!: SceneManager;
  private fpsCounter!: FPSCounter;

  constructor() {
    this.init();
  }

  private async init() {
    // Create PixiJS Application
    this.app = new Application();
    (globalThis as any).__PIXI_APP__ = this.app;

    await this.app.init({
      resizeTo: window,
      backgroundColor: 0x1a1a1a,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });

    document.getElementById("app")?.appendChild(this.app.canvas);

    // Setup responsive resize
    window.addEventListener("resize", () => this.onResize());

    // Setup Scene Manager
    this.sceneManager = new SceneManager(this.app);

    // Set renderer for BaseCard (using sceneManager's renderer)
    BaseCard.setRenderer(this.sceneManager.renderer);

    // Setup FPS Counter
    this.fpsCounter = new FPSCounter(this.app);

    // Start with Menu Scene
    this.sceneManager.goToScene(new MenuScene(this.sceneManager));

    // Start game loop
    this.app.ticker.add(() => this.update());
  }

  private update() {
    this.fpsCounter.update();
    this.sceneManager.update(this.app.ticker.deltaMS);
  }

  private onResize() {
    this.sceneManager.resize(this.app.screen.width, this.app.screen.height);
  }
}

// Start the application
new App();
