import { Container } from "pixi.js";

export abstract class Scene extends Container {
  abstract label: string;
  abstract update(delta: number): void;
  abstract onResize(width: number, height: number): void;
}
