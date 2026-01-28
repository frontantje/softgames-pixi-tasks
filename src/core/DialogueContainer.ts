import { Container, Sprite, Graphics, Text, Texture } from "pixi.js";
import { gsap } from "gsap";

export class DialogueContainer extends Container {
  // Layout constants
  private readonly AVATAR_SIZE = 100;
  private readonly EMOJI_SIZE = 32;
  private readonly EMOJI_GAP = 10;
  private readonly SPEECH_BUBBLE_Y_OFFSET = 120;
  private readonly BUBBLE_PADDING = 15;
  private readonly BUBBLE_CORNER_RADIUS = 10;
  private readonly TEXT_WORD_WRAP_WIDTH = 250;

  // Animation constants
  private readonly TYPEWRITER_SPEED = 0.03; // seconds per character
  private readonly EMOJI_POP_DURATION = 0.2;
  private readonly EMOJI_PULSE_SCALE = 1.3;
  private readonly EMOJI_PULSE_DURATION = 0.15;
  private readonly EMOJI_PULSE_REPEAT = 5;

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
        wordWrapWidth: this.TEXT_WORD_WRAP_WIDTH,
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
    const bubbleWidth = this.speechText.width + this.BUBBLE_PADDING * 2;
    const bubbleHeight = this.speechText.height + this.BUBBLE_PADDING * 2;

    bubbleGraphics
      .roundRect(0, 0, bubbleWidth, bubbleHeight, this.BUBBLE_CORNER_RADIUS)
      .fill(0xffffff);

    // Position text with padding
    this.speechText.x = this.BUBBLE_PADDING;
    this.speechText.y = this.BUBBLE_PADDING;

    // Clear previous bubble
    if (this.speechBubble.children.length > 1) {
      this.speechBubble.removeChildAt(0);
    }
    this.speechBubble.addChildAt(bubbleGraphics, 0);

    // Position speech bubble below avatar
    this.speechBubble.y = this.SPEECH_BUBBLE_Y_OFFSET;
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
      duration: textLength * this.TYPEWRITER_SPEED,
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
      this.emojiSprite.width = this.EMOJI_SIZE;
      this.emojiSprite.height = this.EMOJI_SIZE;
      this.emojiSprite.anchor.set(0.5);

      // Capture the target scale after setting width/height
      const targetScaleX = this.emojiSprite.scale.x;
      const targetScaleY = this.emojiSprite.scale.y;

      const emojiOffset = this.AVATAR_SIZE + this.EMOJI_GAP + this.EMOJI_SIZE / 2;
      if (this.side === "left") {
        this.emojiSprite.x = emojiOffset;
      } else {
        this.emojiSprite.x = -emojiOffset;
      }
      this.emojiSprite.y = this.AVATAR_SIZE / 2;

      this.avatarContainer.addChild(this.emojiSprite);

      // Pulsating animation: pop in, then pulse, end at normal size
      const emojiSprite = this.emojiSprite;
      gsap.fromTo(
        emojiSprite.scale,
        { x: 0, y: 0 },
        {
          x: targetScaleX,
          y: targetScaleY,
          duration: this.EMOJI_POP_DURATION,
          ease: "back.out",
          onComplete: () => {
            gsap.to(emojiSprite.scale, {
              x: targetScaleX * this.EMOJI_PULSE_SCALE,
              y: targetScaleY * this.EMOJI_PULSE_SCALE,
              duration: this.EMOJI_PULSE_DURATION,
              ease: "sine.inOut",
              repeat: this.EMOJI_PULSE_REPEAT,
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
    this.avatarSprite.width = this.AVATAR_SIZE;
    this.avatarSprite.height = this.AVATAR_SIZE;
    this.avatarSprite.y = 0;

    if (this.side === "left") {
      this.avatarSprite.x = 0;
    } else {
      this.avatarSprite.x = -this.AVATAR_SIZE;
    }

    this.avatarContainer.addChild(this.avatarSprite);
  }
}
