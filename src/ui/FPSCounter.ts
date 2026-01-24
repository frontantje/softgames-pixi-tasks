import { Application, Text } from "pixi.js";

export class FPSCounter {
  private text: Text;
  private app: Application;
  private frames: number[] = [];
  private lastTime: number = performance.now();

  constructor(app: Application) {
    this.app = app;

    this.text = new Text({
      text: "FPS: 60",
      style: {
        fontSize: 18,
        fill: 0x00ff00,
        fontFamily: "monospace",
      },
    });

    this.text.x = 10;
    this.text.y = 10;

    this.app.stage.addChild(this.text);
  }

  public update() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    this.frames.push(1000 / delta);
    if (this.frames.length > 60) {
      this.frames.shift();
    }

    const avgFPS = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    this.text.text = `FPS: ${Math.round(avgFPS)}`;
  }
}
