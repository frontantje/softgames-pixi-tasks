import { Container, Sprite, Graphics, Text, Texture } from "pixi.js";

export class DialogueContainer extends Container {
  private avatarSprite: Sprite | null = null;
  private avatarTexture: Texture | undefined = undefined;
  private speechBubble: Container;
  private speechText: Text;
  private emojiSprite: Sprite | null = null;
  private side: "left" | "right";

  constructor(side: "left" | "right") {
    super();
    this.side = side;

    // Create speech bubble container
    this.speechBubble = new Container();
    this.speechBubble.visible = false;
    this.addChild(this.speechBubble);

    // Create text
    this.speechText = new Text({
      text: "",
      style: {
        fontSize: 18,
        fill: 0x000000,
        wordWrap: true,
        wordWrapWidth: 250,
      },
    });
    this.speechBubble.addChild(this.speechText);
  }

  // Show dialogue
  showDialogue(text: string, avatarTexture?: Texture, emojiTexture?: Texture) {
    // Update text
    this.speechText.text = text;
    // Only update avatar if necessary
    if (avatarTexture && avatarTexture !== this.avatarTexture) {
      this.setAvatar(avatarTexture);
    }

    this.avatarTexture = avatarTexture;

    // Create/update speech bubble background
    const bubbleGraphics = new Graphics();
    const padding = 15;
    const bubbleWidth = this.speechText.width + padding * 2;
    const bubbleHeight = this.speechText.height + padding * 2;

    bubbleGraphics
      .roundRect(0, 0, bubbleWidth, bubbleHeight, 10)
      .fill(0xffffff);

    // Position text with padding
    this.speechText.x = padding;
    this.speechText.y = padding;

    // Clear previous bubble
    if (this.speechBubble.children.length > 1) {
      this.speechBubble.removeChildAt(0);
    }
    this.speechBubble.addChildAt(bubbleGraphics, 0);

    // Position speech bubble
    this.speechBubble.y = 120; // Below avatar
    if (this.side === "left") {
      this.speechBubble.x = 0;
    } else {
      this.speechBubble.x = -bubbleWidth;
    }

    this.speechBubble.visible = true;
    if (this.emojiSprite) {
      this.speechBubble.removeChild(this.emojiSprite);
    }

    // Handle emoji
    if (emojiTexture) {
      this.emojiSprite = new Sprite(emojiTexture);
      this.emojiSprite.width = 32;
      this.emojiSprite.height = 32;
      this.emojiSprite.x = bubbleWidth + 10;
      this.emojiSprite.y = bubbleHeight / 2 - 16;

      this.speechBubble.addChild(this.emojiSprite);
    }
  }

  // Hide dialogue
  hideDialogue() {
    this.speechBubble.visible = false;
    if (this.emojiSprite) {
      this.speechBubble.removeChild(this.emojiSprite);
      this.emojiSprite = null;
    }
  }
  // Set avatar
  private setAvatar(texture: Texture) {
    if (this.avatarSprite) {
      this.removeChild(this.avatarSprite);
    }

    this.avatarSprite = new Sprite(texture);
    this.avatarSprite.width = 100;
    this.avatarSprite.height = 100;
    this.avatarSprite.y = 0;

    if (this.side === "left") {
      this.avatarSprite.x = 0;
    } else {
      this.avatarSprite.x = -100; // Align right
    }

    this.addChild(this.avatarSprite);
  }
}
