import { Graphics, Text } from "pixi.js";

export interface ButtonOptions {
  text: string;
  width?: number;
  height?: number;
  backgroundColor?: number;
  hoverColor?: number;
  textColor?: number;
  fontSize?: number;
  onClick: () => void;
}

export class Button extends Graphics {
  private buttonLabel: Text | null = null;
  private options: Required<ButtonOptions>;

  constructor(options: ButtonOptions) {
    super();

    // Default values
    this.options = {
      text: options.text,
      width: options.width ?? 300,
      height: options.height ?? 60,
      backgroundColor: options.backgroundColor ?? 0x4a90e2,
      hoverColor: options.hoverColor ?? 0xaaaaaa,
      textColor: options.textColor ?? 0xffffff,
      fontSize: options.fontSize ?? 24,
      onClick: options.onClick,
    };

    this.createButton();
    this.setupInteractivity();
  }

  private createButton() {
    // Button background
    this.rect(
      -this.options.width / 2,
      -this.options.height / 2,
      this.options.width,
      this.options.height,
    );
    this.fill(this.options.backgroundColor);

    // Button text
    this.buttonLabel = new Text({
      text: this.options.text,
      style: {
        fontSize: this.options.fontSize,
        fill: this.options.textColor,
      },
    });
    this.buttonLabel.anchor.set(0.5);
    this.addChild(this.buttonLabel);
  }

  private setupInteractivity() {
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerover", () => {
      this.tint = this.options.hoverColor;
    });

    this.on("pointerout", () => {
      this.tint = 0xffffff;
    });

    this.on("pointertap", this.options.onClick);
  }

  public setText(text: string) {
    if (this.buttonLabel) {
      this.buttonLabel.text = text;
    }
  }

  public setEnabled(enabled: boolean) {
    this.eventMode = enabled ? "static" : "none";
    this.cursor = enabled ? "pointer" : "default";
    this.alpha = enabled ? 1 : 0.5;
  }
}
