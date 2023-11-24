import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  cube1: Cube;
  cube2: Cube;
  teapot;
  axis;

  constructor(canvas: HTMLCanvasElement) {
    const camera = new Drake.Camera(80, 0.1, 1000, [-10, -10, 0], [1, 1, 1]);
    super(canvas, camera);
    this.cube1 = new Drake.Cube([0.3, 0, 0.5]);
    this.cube2 = new Drake.Cube([10, 10, 10]);
    this.teapot = new Drake.GameObject("/objects/teapot.obj", undefined);
    this.axis = new Drake.GameObject("/objects/axis.obj");

    // this.addSceneMesh(this.cube1);
    this.addSceneMesh(this.cube2);
    // this.addSceneMesh(this.teapot);
    this.addSceneMesh(this.axis);
    // for (let i = 0; i < 10; i++) {
    //   this.addSceneMesh(new Drake.Cube([0, 0, 0]));
    // }
  }

  handleCameraMove(e: KeyboardEvent) {
    switch (e.key) {
      case "w":
        this.mainCamera.move(0, 1, 0);
        break;
      case "s":
        this.mainCamera.move(0, -1, 0);
        break;
    }
  }

  override Start(): void {
    this.setResolution(640, 480);
    document.addEventListener("keyup", this.handleCameraMove.bind(this));
    // this.cube1.scale(1, 2, 1);
    // this.cube1.scale(2, 2, 2);
    // this.cube1.move(0.2, 0.15, -1.2);
    // this.cube2.move(-0.4, -0.2, 0.5);
    // this.clearScreen();
  }

  override Update(): void {
    // this.teapot.rotate(1 * this.deltaTime, 0, 0);
    // this.axis.rotate(1 * this.deltaTime, 0, 0);
    // this.cube1.move(Math.sin(Date.now() / 1000), 0, 0);
    // this.cube2.rotate((Math.PI / 3) * this.deltaTime, 0, 0);
  }
}

const game = new MyGame(canvas);
game.run();
