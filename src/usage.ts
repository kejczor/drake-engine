import Cube from "./entities/meshes/Cube";
import Drake from "./index";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  cube1: Cube;
  cube2: Cube;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.cube1 = new Drake.Cube(0, 0, 2);
    this.cube2 = new Drake.Cube(1, 3, 1, 0.2, 0.3, 0.5);

    this.addSceneMesh(this.cube1);
    this.addSceneMesh(this.cube2);
  }

  override Start(): void {
    this.setResolution(640, 480);
    this.cube1.scale(2, 2, 2);
    // this.cube1.move(0.2, 0.15, -1.2);
    // this.cube2.move(-0.4, -0.2, 0.5);
    this.clearScreen();
  }

  override Update(): void {
    // this.myCube.move(0, 0, 0.6 * this.deltaTime);
    // this.myCube.rotate(0.1 * this.deltaTime, 0, 0);
  }
}

const game = new MyGame(canvas);
game.run();
