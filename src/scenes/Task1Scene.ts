import { BaseTaskScene } from "../core/BaseTaskScene";
import { SceneManager } from "../core/SceneManager";
import { Text, Container } from "pixi.js";
import { BaseCard } from "../core/BaseCard";
import { gsap } from "gsap/gsap-core";

export class Task1Scene extends BaseTaskScene {
  private titleText!: Text;
  private stack1Container!: Container;
  private stack2Container!: Container;
  private animationLayer!: Container;
  private numberOfCards: number = 144;
  private animationDuration: number = 2; // seconds
  private staggerDelay: number = 1; // seconds
  private cardMigrationStarted: boolean = false;
  private cardMigrationCompleted: boolean = false;

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
    this.animationLayer = new Container();
    this.stack1Container.y = 100;
    this.stack1Container.x = -200;
    this.stack2Container.y = 100;
    this.stack2Container.x = 200;
    this.content.sortableChildren = true;
    this.stack1Container.zIndex = 0;
    this.stack2Container.zIndex = 0;
    this.animationLayer.zIndex = 1000;
    this.content.addChild(this.stack1Container);
    this.content.addChild(this.stack2Container);
    this.content.addChild(this.animationLayer);
    this.createInitialCardStack();
    this.startStaggerLoop();
  }
  private createInitialCardStack() {
    // Create all cards
    const cards: BaseCard[] = [];
    for (let i = 0; i < this.numberOfCards; i++) {
      cards.push(new BaseCard(i));
    }

    // Shuffle the cards using Fisher-Yates algorithm
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    // Add shuffled cards to stack
    for (const card of cards) {
      this.stack1Container.addChild(card);
      card.anchor.set(0.5);
      card.rotation = (Math.random() - 0.5) * 10 * (Math.PI / 180);
    }
  }

  private startStaggerLoop() {
    // start migration immediatley for the first time
    let delay: number;
    if (!this.cardMigrationStarted) {
      this.cardMigrationStarted = true;
      delay = 0;
    } else {
      delay = this.staggerDelay;
    }
    gsap.delayedCall(delay, () => {
      this.startCardAnimation();
      this.startStaggerLoop();
    });
  }

  private startCardAnimation() {
    const count = this.stack1Container.children.length;
    if (count === 0) {
      this.cardMigrationCompleted = true;
      return;
    }
    const card = this.stack1Container.getChildAt(
      this.stack1Container.children.length - 1,
    ) as BaseCard | undefined;
    if (!card) return;
    this.stack1Container.removeChild(card);

    const globalPos = this.stack1Container.toGlobal(card.position);
    this.animationLayer.addChild(card);
    card.position.copyFrom(this.animationLayer.toLocal(globalPos));

    const targetGlobal = this.stack2Container.toGlobal({ x: 0, y: 0 });
    const targetLocal = this.animationLayer.toLocal(targetGlobal);

    gsap.to(card, {
      duration: this.animationDuration,
      x: targetLocal.x,
      y: targetLocal.y,
      onComplete: () => {
        this.animationLayer.removeChild(card);
        this.stack2Container.addChild(card);
        card.x = 0;
        card.y = 0;
      },
    });
    gsap.fromTo(
      card.scale,
      { x: 1, y: 1 },
      {
        x: 1.1,
        y: 1.1,
        duration: this.animationDuration / 3,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      },
    );
  }

  protected onContentResize(width: number, height: number): void {
    // Simply center the content container
    this.centerContent();
  }
}
