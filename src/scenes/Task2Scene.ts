import { BaseTaskScene } from "./BaseTaskScene";
import { SceneManager } from "../core/SceneManager";
import { DialogueContainer } from "../core/DialogueContainer";
import { Assets, Texture, Text, Rectangle } from "pixi.js";
import placeholderUrl from "../assets/images/Placeholder_Person.jpg";
import { Layout } from "../config/layout";

interface DialogueLine {
  name: string;
  text: string;
}

interface Emoji {
  name: string;
  url: string;
}

interface Avatar {
  name: string;
  url: string;
  position: "left" | "right";
}

interface ResponseData {
  dialogue: DialogueLine[];
  emojies: Emoji[];
  avatars: Avatar[];
}

interface DialogueStep {
  position: "left" | "right";
  avatar: Texture | undefined;
  emoji: Texture | undefined;
  text: string;
}

export class Task2Scene extends BaseTaskScene {
  static readonly LABEL = "Task 2: Magic Words";

  // API
  private readonly API_URL =
    "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords";

  // Layout constants
  private readonly SUBTEXT_FONT_SIZE = 18;
  private readonly SUBTEXT_Y_OFFSET = 180;
  private readonly DIALOGUE_EDGE_PADDING = 50;
  private readonly LEFT_DIALOGUE_Y_OFFSET = 160;
  private readonly RIGHT_DIALOGUE_BOTTOM_OFFSET = 250;

  // UI Elements
  private titleText: Text;
  private subText: Text;
  private leftDialogue: DialogueContainer;
  private rightDialogue: DialogueContainer;

  // State
  private dialogueStepIndex: number = 0;

  // Data
  private emojiTextures: Map<string, Texture> = new Map();
  private dialogueSteps: DialogueStep[] = []; // Array instead of Map

  constructor(sceneManager: SceneManager) {
    super(sceneManager, Task2Scene.LABEL);

    // Initialize UI elements immediately
    this.titleText = new Text({
      text: this.label,
      style: { fontSize: Layout.TITLE_FONT_SIZE_DESKTOP, fill: 0xffffff, align: "center" },
    });
    this.titleText.anchor.set(0.5);

    this.subText = new Text({
      text: "Loading: 0%",
      style: { fontSize: this.SUBTEXT_FONT_SIZE, fill: 0xffffff, align: "center" },
    });
    this.subText.anchor.set(0.5);

    this.leftDialogue = new DialogueContainer("left");
    this.rightDialogue = new DialogueContainer("right");

    this.init();
  }

  private async init() {
    this.content.addChild(this.titleText);
    this.content.addChild(this.subText);
    this.content.addChild(this.leftDialogue);
    this.content.addChild(this.rightDialogue);

    // fetch data from api
    const data = await this.fetchData();
    // load all image assets
    await this.loadAssets(data);

    this.cursor = "pointer";
    this.eventMode = "static";
    this.subText.text = "Click to start";
    this.on("pointerdown", this.advanceDialogue.bind(this));
  }

  private async fetchData(): Promise<ResponseData> {
    const response = await fetch(this.API_URL);
    return response.json();
  }

  private async loadAssets(data: ResponseData): Promise<void> {
    // load placeholder first
    await Assets.load({
      alias: "placeholder_avatar",
      src: placeholderUrl,
    });

    try {
      // Collect all URLs to load
      const urls = [
        ...data.avatars.map((a) => ({
          alias: `avatar_${a.name}`,
          src: a.url,
          parser: "texture",
        })),
        ...data.emojies.map((e) => ({
          alias: `emoji_${e.name}`,
          src: e.url,
          parser: "texture",
        })),
      ];

      // Load all assets sequentially with progress
      let loaded = 0;
      const total = urls.length;

      for (const item of urls) {
        await Assets.load(item);
        loaded++;
        this.subText.text = `Loading: ${Math.round((loaded / total) * 100)}%`;
      }

      // Store emoji textures
      data.emojies.forEach((emoji) => {
        const texture = Assets.get(`emoji_${emoji.name}`);
        if (texture) {
          this.emojiTextures.set(emoji.name, texture);
        }
      });

      // parse dialogue data
      data.dialogue.forEach((line) => {
        const dialogueStep: DialogueStep = {
          position:
            data.avatars.find((a) => a.name === line.name)?.position || "left",
          avatar: this.getAvatarTexture(line.name),
          emoji: this.getEmojiTexture(line.text),
          text: this.getSanitizedText(line.text),
        };
        this.dialogueSteps.push(dialogueStep);
      });

      console.log("All assets loaded successfully");
    } catch (error) {
      console.error("Error loading assets:", error);
    }
  }

  private advanceDialogue() {
    if (this.dialogueStepIndex === 0) {
      this.subText.text = "Click to proceed";
    }
    if (this.dialogueStepIndex < this.dialogueSteps.length) {
      const step = this.dialogueSteps[this.dialogueStepIndex];
      const relevantContainer: DialogueContainer =
        step.position === "left" ? this.leftDialogue : this.rightDialogue;
      relevantContainer.showDialogue(step.text, step.avatar, step.emoji);
      if (relevantContainer === this.leftDialogue) {
        this.rightDialogue.hideDialogue();
      } else {
        this.leftDialogue.hideDialogue();
      }
      this.dialogueStepIndex++;
    } else {
      this.subText.text = "The End!";
      this.leftDialogue.hideDialogue();
      this.rightDialogue.hideDialogue();
    }
  }

  private getAvatarTexture(avatarName: string): Texture | undefined {
    // Get cached texture
    const texture = Assets.get(`avatar_${avatarName}`);
    if (texture) {
      return texture;
    } else {
      return Assets.get("placeholder_avatar");
    }
  }

  private getEmojiTexture(dialogueText: string): Texture | undefined {
    const emojiName = dialogueText.match(/\{(\w+)\}/)?.[1];
    if (emojiName) {
      return this.emojiTextures.get(emojiName);
    }
    return undefined;
  }

  private getSanitizedText(dialogueText: string): string {
    return dialogueText.replace(/\{(\w+)\}/g, "");
  }

  protected onContentResize(width: number, height: number): void {
    // Set hit area to cover the entire screen for click/tap events
    this.hitArea = new Rectangle(0, 0, width, height);

    // Position title and subtitle at top center
    this.titleText.y = -height / 2 + Layout.TITLE_Y_OFFSET;
    this.subText.y = -height / 2 + this.SUBTEXT_Y_OFFSET;

    // Position left dialogue at top left
    this.leftDialogue.x = -width / 2 + this.DIALOGUE_EDGE_PADDING;
    this.leftDialogue.y = -height / 2 + this.LEFT_DIALOGUE_Y_OFFSET;

    // Position right dialogue at bottom right
    this.rightDialogue.x = width / 2 - this.DIALOGUE_EDGE_PADDING;
    this.rightDialogue.y = height / 2 - this.RIGHT_DIALOGUE_BOTTOM_OFFSET;

    this.centerContent();
  }

  update(_delta: number): void {
    // No per-frame logic needed
  }
}
