import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  cube1: Cube;
  cube2: Cube;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.cube1 = new Drake.Cube([0.3, 0, 0.5]);
    this.cube2 = new Drake.Cube([0, 0, 0.4]);

    this.addSceneMesh(this.cube1);
    this.addSceneMesh(this.cube2);
    // for (let i = 0; i < 10; i++) {
    //   this.addSceneMesh(new Drake.Cube([0, 0, 0]));
    // }
  }

  override Start(): void {
    this.setResolution(640, 480);
    // this.cube1.scale(2, 2, 2);
    // this.cube1.move(0.2, 0.15, -1.2);
    // this.cube2.move(-0.4, -0.2, 0.5);
    // this.clearScreen();
  }

  override Update(): void {
    // this.cube1.move(Math.sin(Date.now() / 1000), 0, 0);
    // this.cube2.rotate((Math.PI / 3) * this.deltaTime, 0, 0);
  }
}

const game = new MyGame(canvas);
game.run();
