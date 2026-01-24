import { BaseTaskScene } from "../core/BaseTaskScene";
import { SceneManager } from "../core/SceneManager";
import { Text } from "pixi.js";

export class Task2Scene extends BaseTaskScene {
  private titleText!: Text;

  constructor(sceneManager: SceneManager) {
    super(sceneManager);
    this.init();
  }

  private init() {
    this.titleText = new Text({
      text: "Task 2: Emoji Dialog\n\n(Implementation here)",
      style: { fontSize: 32, fill: 0xffffff, align: "center" },
    });
    this.titleText.anchor.set(0.5);
    this.content.addChild(this.titleText);
  }

  public update(delta: number): void {
    // Task 2 logic
  }

  protected onContentResize(width: number, height: number): void {
    this.centerContent();
  }
}
