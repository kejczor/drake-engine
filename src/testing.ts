import Drake from "./index";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  constructor() {
    super();
  }

  override Update() {}

  Start() {}
}

const renderer = new Drake.Renderer(canvas);
renderer.setResolution(640, 480);
renderer.clear();
renderer.addSceneMesh(new Drake.Cube());
renderer.addSceneMesh(new Drake.Cube(1, 3, 1, 2, 2, 2));
renderer.render();
