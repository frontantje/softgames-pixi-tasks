import { Container, Sprite, Graphics, Text, Texture } from "pixi.js";
import { gsap } from "gsap";

export class DialogueContainer extends Container {
  private avatarSprite: Sprite | null = null;
  private avatarTexture: Texture | undefined = undefined;
  private speechBubble: Container;
  private avatarContainer: Container;
  private speechText: Text;
  private emojiSprite: Sprite | null = null;
  private side: "left" | "right";
  private textTween: gsap.core.Tween | null = null;

  constructor(side: "left" | "right") {
    super();
    this.side = side;

    // Create avatar container
    this.avatarContainer = new Container();
    this.addChild(this.avatarContainer);

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
    // Kill any existing text animation
    if (this.textTween) {
      this.textTween.kill();
    }

    // Set full text first to calculate bubble size
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

    // Typewriter animation: reveal text letter by letter
    const fullText = text;
    const textLength = fullText.length;
    const tweenTarget = { charIndex: 0 };
    this.speechText.text = "";

    this.textTween = gsap.to(tweenTarget, {
      charIndex: textLength,
      duration: textLength * 0.03, // 30ms per character
      ease: "none",
      onUpdate: () => {
        this.speechText.text = fullText.substring(
          0,
          Math.floor(tweenTarget.charIndex),
        );
      },
    });

    if (this.emojiSprite) {
      this.avatarContainer.removeChild(this.emojiSprite);
    }

    // Handle emoji
    if (emojiTexture) {
      this.emojiSprite = new Sprite(emojiTexture);
      this.emojiSprite.width = 32;
      this.emojiSprite.height = 32;
      this.emojiSprite.anchor.set(0.5);

      // Capture the target scale after setting width/height
      const targetScaleX = this.emojiSprite.scale.x;
      const targetScaleY = this.emojiSprite.scale.y;

      if (this.side === "left") {
        this.emojiSprite.x = this.avatarSprite?.width! + 10 + 16;
      } else {
        this.emojiSprite.x = -this.avatarSprite?.width! - 20 - 16;
      }
      this.emojiSprite.y = this.avatarSprite?.height! / 2;

      this.avatarContainer.addChild(this.emojiSprite);

      // Pulsating animation: pop in, then pulse 3 times, end at normal size
      const emojiSprite = this.emojiSprite;
      gsap.fromTo(
        emojiSprite.scale,
        { x: 0, y: 0 },
        {
          x: targetScaleX,
          y: targetScaleY,
          duration: 0.2,
          ease: "back.out",
          onComplete: () => {
            gsap.to(emojiSprite.scale, {
              x: targetScaleX * 1.3,
              y: targetScaleY * 1.3,
              duration: 0.15,
              ease: "sine.inOut",
              repeat: 5,
              yoyo: true,
            });
          },
        },
      );
    }
  }

  // Hide dialogue
  hideDialogue() {
    if (this.textTween) {
      this.textTween.kill();
      this.textTween = null;
    }
    this.speechBubble.visible = false;
    if (this.emojiSprite) {
      this.avatarContainer.removeChild(this.emojiSprite);
      this.emojiSprite = null;
    }
  }
  // Set avatar
  private setAvatar(texture: Texture) {
    if (this.avatarSprite) {
      this.avatarContainer.removeChild(this.avatarSprite);
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

    this.avatarContainer.addChild(this.avatarSprite);
  }
}
