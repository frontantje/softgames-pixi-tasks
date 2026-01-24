import { BaseTaskScene } from "../core/BaseTaskScene";
import { SceneManager } from "../core/SceneManager";
import { Text } from "pixi.js";

export class Task1Scene extends BaseTaskScene {
  private titleText!: Text;

  constructor(sceneManager: SceneManager) {
    super(sceneManager);
    this.init();
  }

  private init() {
    this.titleText = new Text({
      text: "Task 1: Card Stack\n\n(Implementation here)",
      style: { fontSize: 32, fill: 0xffffff, align: "center" },
    });
    this.titleText.anchor.set(0.5);
    this.content.addChild(this.titleText);
  }

  public update(delta: number): void {
    // Task 1 logic
  }

  protected onContentResize(width: number, height: number): void {
    // Simply center the content container
    this.centerContent();
  }
}
