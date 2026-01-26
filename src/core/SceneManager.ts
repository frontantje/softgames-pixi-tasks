import { Application, Container } from "pixi.js";
import { Scene } from "./Scene.ts";

export class SceneManager {
  private app: Application;
  private currentScene: Scene | null = null;
  private container: Container;

  constructor(app: Application) {
    this.app = app;
    this.container = new Container();
    this.app.stage.addChild(this.container);
  }

  public goToScene(scene: Scene) {
    if (this.currentScene) {
      this.currentScene.destroy();
      this.container.removeChildren();
    }

    this.currentScene = scene;
    this.container.addChild(scene);
    scene.onResize(this.app.screen.width, this.app.screen.height);
  }

  public update(delta: number) {
    if (this.currentScene && "update" in this.currentScene) {
      this.currentScene.update(delta);
    }
  }

  public resize(width: number, height: number) {
    if (this.currentScene) {
      this.currentScene.onResize(width, height);
    }
  }

  public get renderer() {
    return this.app.renderer;
  }
}
