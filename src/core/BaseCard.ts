import { Sprite, Graphics, RenderTexture, Text, Renderer } from "pixi.js";

export class BaseCard extends Sprite {
  private static cardTextureCache: Map<string, RenderTexture> = new Map();
  private static symbolTextureCache: Map<number, RenderTexture> = new Map();
  private static renderer: Renderer;
  private symbolSprite: Sprite;

  static setRenderer(renderer: Renderer) {
    BaseCard.renderer = renderer;
  }

  constructor(index: number) {
    // Calculate unique color and symbol indices for 144 unique cards
    // symbolIndex cycles through 0-11 for each set of 12 cards
    // colorIndex cycles through 0-11, changing every 12 cards
    const symbolIndex = index % 12;
    const colorIndex = Math.floor(index / 12) % 12;

    const backgroundColor = BaseCard.getBackgroundColor(colorIndex);
    const textureKey = `color_${backgroundColor}`;
    let backgroundTexture = BaseCard.cardTextureCache.get(textureKey);

    if (!backgroundTexture) {
      // Create a colored background using PIXI.Graphics
      const backgroundGraphics = new Graphics();
      backgroundGraphics.rect(0, 0, 100, 150).fill(backgroundColor);

      backgroundTexture = RenderTexture.create({
        width: 100,
        height: 150,
      });

      if (BaseCard.renderer) {
        BaseCard.renderer.render({
          container: backgroundGraphics,
          target: backgroundTexture,
        });
      }

      BaseCard.cardTextureCache.set(textureKey, backgroundTexture);
    }

    super(backgroundTexture);

    // Add symbol sprite
    const symbolTexture = BaseCard.getSymbolTexture(symbolIndex);
    this.symbolSprite = new Sprite(symbolTexture);
    this.symbolSprite.anchor.set(0.5);
    this.addChild(this.symbolSprite);
  }

  private static getBackgroundColor(index: number): number {
    const backgroundColors: number[] = [
      0x845ec2, 0xd65db1, 0xff6f91, 0xff9671, 0xffc75f, 0xf9f871, 0x2c73d2,
      0x008f7a, 0x4b4453, 0xc34a36, 0xff8066, 0xd5cabd,
    ];
    return backgroundColors[index % backgroundColors.length];
  }

  private static getSymbolTexture(index: number): RenderTexture {
    const symbols: string[] = [
      "♠",
      "♥",
      "♦",
      "♣",
      "★",
      "☀",
      "☂",
      "☃",
      "☾",
      "☽",
      "☯",
      "☮",
    ];
    const symbolIndex = index % symbols.length;

    // Check cache first
    const cached = BaseCard.symbolTextureCache.get(symbolIndex);
    if (cached) {
      return cached;
    }

    // Create text graphics for the symbol
    const symbolText = new Text({
      text: symbols[symbolIndex],
      style: {
        fontSize: 48,
        fill: 0xffffff,
        fontWeight: "bold",
      },
    });
    symbolText.anchor.set(0.5);
    symbolText.x = 50;
    symbolText.y = 50;

    // Render to texture
    const symbolTexture = RenderTexture.create({
      width: 100,
      height: 100,
    });

    if (BaseCard.renderer) {
      BaseCard.renderer.render({
        container: symbolText,
        target: symbolTexture,
      });
    }

    // Cache it
    BaseCard.symbolTextureCache.set(symbolIndex, symbolTexture);

    return symbolTexture;
  }
}
