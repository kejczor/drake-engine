import Cube from "./entities/meshes/Cube";
import Drake from "./index";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  myCube: Cube;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.myCube = new Drake.Cube(0, 0, 2);
  }

  override Start(): void {
    this.setResolution(640, 480);
    this.addSceneMesh(this.myCube);
    // this.addSceneMesh(new Drake.Cube(1, 3, 1, 2, 2, 2));
    this.clearScreen();
  }

  override Update(): void {
    this.myCube.move(0, 0, 0.6 * this.deltaTime);
    this.myCube.rotate(0, 0, 1 * this.deltaTime);
  }
}

const game = new MyGame(canvas);
game.run();
