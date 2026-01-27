import { Application, Container } from "pixi.js";
import { Scene } from "./Scene.ts";
import { MenuScene } from "../scenes/MenuScene.ts";
import { Button } from "../ui/Button.ts";

export class SceneManager {
  private app: Application;
  private currentScene: Scene | null = null;
  private container: Container;
  private backButton: Button;

  constructor(app: Application) {
    this.app = app;
    this.container = new Container();
    this.app.stage.addChild(this.container);
    this.backButton = new Button({
      text: "← Back to Menu",
      width: 200,
      height: 50,
      fontSize: 20,
      onClick: () => this.goToScene(new MenuScene(this)),
    });
    this.backButton.pivot.set(
      -this.backButton.width / 2,
      -this.backButton.height / 2,
    );

    this.backButton.y = 50;
    this.backButton.x = 10;
    this.app.stage.addChild(this.backButton);
    this.backButton.visible = false;
  }

  public goToScene(scene: Scene) {
    if (this.currentScene) {
      this.currentScene.destroy();
      this.container.removeChildren();
    }

    this.currentScene = scene;
    this.container.addChild(scene);
    scene.onResize(this.app.screen.width, this.app.screen.height);
    if (scene.label !== "Menu Scene") {
      this.backButton.visible = true;
    } else {
      this.backButton.visible = false;
    }
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
