import { SceneManager } from "./SceneManager";
import { Container } from "pixi.js";

export abstract class BaseTaskScene extends Container {
  protected sceneManager: SceneManager;
  protected content: Container;
  private screenWidth: number = 0;
  private screenHeight: number = 0;

  constructor(sceneManager: SceneManager, name: string) {
    super();
    this.label = name;
    this.sceneManager = sceneManager;

    // Container for task-specific content
    this.content = new Container();
    this.addChild(this.content);
  }

  public onResize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;

    // Let child class handle content positioning
    this.onContentResize(width, height);
  }

  // Override this in child classes for custom content positioning
  protected abstract onContentResize(width: number, height: number): void;

  // Helper methods for common positioning
  protected centerContent() {
    this.content.x = this.screenWidth / 2;
    this.content.y = this.screenHeight / 2;
  }
}
