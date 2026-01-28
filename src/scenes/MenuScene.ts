import { Graphics, Text } from "pixi.js";
import { Scene } from "../core/Scene.ts";
import { SceneManager } from "../core/SceneManager";
import { Task1Scene } from "./Task1Scene.ts";
import { Task2Scene } from "./Task2Scene.ts";
import { Task3Scene } from "./Task3Scene.ts";
import { Button } from "../ui/Button.ts";

export class MenuScene extends Scene {
  public label: string;
  private sceneManager: SceneManager;
  private buttons: Graphics[] = [];
  private title!: Text;
  private buttonSpacing: number = 100;

  constructor(sceneManager: SceneManager) {
    super();
    this.label = "Menu Scene";
    this.sceneManager = sceneManager;
    this.createMenu();
  }

  update(): void {
    // No per-frame logic needed for menu, but could animate buttons/title here if desired
  }

  private createMenu() {
    this.title = new Text({
      text: "Test Tasks Menu",
      style: {
        fontSize: 48,
        fill: 0xffffff,
        fontWeight: "bold",
      },
    });
    this.title.anchor.set(0.5);
    this.addChild(this.title);

    const tasks = [
      { name: Task1Scene.LABEL, scene: Task1Scene },
      { name: Task2Scene.LABEL, scene: Task2Scene },
      { name: Task3Scene.LABEL, scene: Task3Scene },
    ];

    tasks.forEach((task, index) => {
      const button = new Button({
        text: task.name,
        onClick: () => {
          this.sceneManager.goToScene(new task.scene(this.sceneManager));
        },
      });
      button.y = (index + 1) * this.buttonSpacing;
      this.addChild(button);
      this.buttons.push(button);
    });
    const bounds = this.getLocalBounds();
    this.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  }

  public onResize(width: number, height: number): void {
    this.x = width / 2;
    this.y = height / 2;
    if (width < 525) {
      this.title.style.fontSize = 32;
      this.buttonSpacing = 70;
    }
  }
}
