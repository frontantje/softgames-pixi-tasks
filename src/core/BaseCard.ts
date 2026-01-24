import { Sprite, Graphics, RenderTexture, Color } from "pixi.js";

export class BaseCard extends Sprite {
  private static cardTextureCache: Map<string, RenderTexture> = new Map();
  private static renderer: any;

  static setRenderer(renderer: any) {
    BaseCard.renderer = renderer;
  }

  constructor(index: number) {
    const backgroundColor = BaseCard.getBackgroundColor(index);
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
        BaseCard.renderer.render(backgroundGraphics, {
          renderTexture: backgroundTexture,
        });
      }

      BaseCard.cardTextureCache.set(textureKey, backgroundTexture);
    }

    super(backgroundTexture);
  }

  private static getBackgroundColor(index: number): number {
    const backgroundColors: number[] = [
      0x845ec2, 0xd65db1, 0xff6f91, 0xff9671, 0xffc75f, 0xf9f871, 0x2c73d2,
      0x008f7a, 0x4b4453, 0xc34a36, 0xff8066, 0xd5cabd,
    ];
    return backgroundColors[index % backgroundColors.length];
  }
}
