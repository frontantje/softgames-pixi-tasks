import { Scene } from "../core/Scene";
import { SceneManager } from "../core/SceneManager";
import { Container, Graphics } from "pixi.js";

export abstract class BaseTaskScene extends Scene {
  protected sceneManager: SceneManager;
  protected content: Container;
  private screenWidth: number = 0;
  private screenHeight: number = 0;
  private screenMask: Graphics;

  constructor(sceneManager: SceneManager, name: string) {
    super();
    this.label = name;
    this.sceneManager = sceneManager;

    // Create mask to constrain content to screen bounds
    this.screenMask = new Graphics();
    this.addChild(this.screenMask);
    this.mask = this.screenMask;

    // Container for task-specific content
    this.content = new Container();
    this.addChild(this.content);
  }

  public onResize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;

    // Update mask to match screen size
    this.screenMask.clear();
    this.screenMask.rect(0, 0, width, height);
    this.screenMask.fill(0xffffff);

    // Let child class handle content positioning
    this.onContentResize(width, height);
  }

  // Override this in child classes for custom content positioning
  protected abstract onContentResize(width?: number, height?: number): void;

  // Helper methods for common positioning
  protected centerContent() {
    this.content.x = this.screenWidth / 2;
    this.content.y = this.screenHeight / 2;
  }
}
