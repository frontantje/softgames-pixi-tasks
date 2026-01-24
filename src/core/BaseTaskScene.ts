import { SceneManager } from "./SceneManager";
import { Button } from "../ui/Button";
import { Container } from "pixi.js";

export abstract class BaseTaskScene extends Container {
  protected sceneManager: SceneManager;
  protected backButton: Button = null!;
  protected content: Container;
  private screenWidth: number = 0;
  private screenHeight: number = 0;

  constructor(sceneManager: SceneManager) {
    super();
    this.sceneManager = sceneManager;

    // Container for task-specific content
    this.content = new Container();
    this.addChild(this.content);

    this.createBackButton();
  }

  private createBackButton() {
    this.backButton = new Button({
      text: "← Back to Menu",
      width: 200,
      height: 50,
      fontSize: 20,
      onClick: () => this.goBackToMenu(),
    });
    this.addChild(this.backButton);
  }

  protected goBackToMenu() {
    // Import MenuScene here to avoid circular dependency
    import("../scenes/MenuScene").then(({ MenuScene }) => {
      this.sceneManager.goToScene(new MenuScene(this.sceneManager));
    });
  }

  public onResize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;

    // Position back button at bottom
    this.backButton.x = width / 2;
    this.backButton.y = height - 80;

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
