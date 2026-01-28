import { BaseTaskScene } from "./BaseTaskScene";
import { SceneManager } from "../core/SceneManager";
import { Text, Container } from "pixi.js";
import { BaseCard } from "../core/BaseCard";
import { gsap } from "gsap/gsap-core";
import { Layout } from "../config/layout";

export class Task1Scene extends BaseTaskScene {
  static readonly LABEL = "Task 1: Ace of Shadows";

  // Card settings
  private readonly NUMBER_OF_CARDS = 144;
  private readonly CARD_ROTATION_RANGE = 10; // degrees

  // Animation settings
  private readonly ANIMATION_DURATION = 2; // seconds
  private readonly STAGGER_DELAY = 1; // seconds
  private readonly CARD_SCALE_DURING_ANIMATION = 1.1;
  private readonly ANIMATION_LAYER_Z_INDEX = 1000;

  // Stack positions
  private readonly LANDSCAPE_STACK_X_OFFSET = 200;
  private readonly LANDSCAPE_STACK_Y = 100;
  private readonly PORTRAIT_STACK1_Y = -100;
  private readonly PORTRAIT_STACK2_Y = 200;

  private titleText!: Text;
  private stack1Container!: Container;
  private stack2Container!: Container;
  private animationLayer!: Container;
  private cardMigrationStarted: boolean = false;

  constructor(sceneManager: SceneManager) {
    super(sceneManager, Task1Scene.LABEL);
    this.init();
  }

  private init() {
    this.titleText = new Text({
      text: this.label,
      style: { fontSize: Layout.TITLE_FONT_SIZE_DESKTOP, fill: 0xffffff, align: "center" },
    });
    this.titleText.anchor.set(0.5);
    this.content.addChild(this.titleText);
    this.stack1Container = new Container();
    this.stack2Container = new Container();
    this.animationLayer = new Container();
    this.content.sortableChildren = true;
    this.stack1Container.zIndex = 0;
    this.stack2Container.zIndex = 0;
    this.animationLayer.zIndex = this.ANIMATION_LAYER_Z_INDEX;
    this.content.addChild(this.stack1Container);
    this.content.addChild(this.stack2Container);
    this.content.addChild(this.animationLayer);
    this.createInitialCardStack();
    this.startStaggerLoop();
  }
  private createInitialCardStack() {
    // Create all cards
    const cards: BaseCard[] = [];
    for (let i = 0; i < this.NUMBER_OF_CARDS; i++) {
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
      card.rotation = (Math.random() - 0.5) * this.CARD_ROTATION_RANGE * (Math.PI / 180);
    }
  }

  private startStaggerLoop() {
    // start migration immediatley for the first time
    let delay: number;
    if (!this.cardMigrationStarted) {
      this.cardMigrationStarted = true;
      delay = 0;
    } else {
      delay = this.STAGGER_DELAY;
    }
    gsap.delayedCall(delay, () => {
      this.startCardAnimation();
      this.startStaggerLoop();
    });
  }

  private startCardAnimation() {
    const count = this.stack1Container.children.length;
    if (count === 0) {
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
      duration: this.ANIMATION_DURATION,
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
        x: this.CARD_SCALE_DURING_ANIMATION,
        y: this.CARD_SCALE_DURING_ANIMATION,
        duration: this.ANIMATION_DURATION / 3,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      },
    );
  }

  private initializeLandscapeLayout() {
    this.stack1Container.y = this.LANDSCAPE_STACK_Y;
    this.stack1Container.x = -this.LANDSCAPE_STACK_X_OFFSET;
    this.stack2Container.y = this.LANDSCAPE_STACK_Y;
    this.stack2Container.x = this.LANDSCAPE_STACK_X_OFFSET;
  }

  private initializePortraitLayout() {
    this.stack1Container.y = this.PORTRAIT_STACK1_Y;
    this.stack1Container.x = 0;
    this.stack2Container.y = this.PORTRAIT_STACK2_Y;
    this.stack2Container.x = 0;
  }

  protected onContentResize(width: number, height: number): void {
    this.titleText.y = -height / 2 + Layout.TITLE_Y_OFFSET;

    if (width < Layout.MOBILE_BREAKPOINT) {
      this.initializePortraitLayout();
      this.titleText.style.fontSize = Layout.TITLE_FONT_SIZE_MOBILE;
    } else {
      this.initializeLandscapeLayout();
      this.titleText.style.fontSize = Layout.TITLE_FONT_SIZE_DESKTOP;
    }
    this.centerContent();
  }
  update(): void {
    // No per-frame logic needed
  }
}
