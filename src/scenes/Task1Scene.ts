import { BaseTaskScene } from "../core/BaseTaskScene";
import { SceneManager } from "../core/SceneManager";
import { Text, Container, Color } from "pixi.js";
import { BaseCard } from "../core/BaseCard";

export class Task1Scene extends BaseTaskScene {
  private titleText!: Text;
  private stack1Container!: Container;
  private stack2Container!: Container;
  private numberOfCards: number = 144;

  constructor(sceneManager: SceneManager) {
    super(sceneManager);
    this.init();
  }

  private init() {
    this.titleText = new Text({
      text: "Task 1: Ace of Shadows",
      style: { fontSize: 32, fill: 0xffffff, align: "center" },
    });
    this.titleText.anchor.set(0.5);
    this.content.addChild(this.titleText);
    this.stack1Container = new Container();
    this.stack2Container = new Container();
    this.stack1Container.y = 100;
    this.stack2Container.y = 100;
    this.content.addChild(this.stack1Container);
    this.content.addChild(this.stack2Container);
    this.createInitialCardStack();
  }
  private createInitialCardStack() {
    for (let i = 0; i < this.numberOfCards; i++) {
      const card = new BaseCard(i);
      this.stack1Container.addChild(card);
      card.anchor.set(0.5);
      card.rotation = (Math.random() - 0.5) * 10 * (Math.PI / 180);
    }
  }

  public update(delta: number): void {
    // Task 1 logic
  }

  protected onContentResize(width: number, height: number): void {
    // Simply center the content container
    this.centerContent();
  }
}
