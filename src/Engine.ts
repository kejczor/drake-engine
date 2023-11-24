import Camera from "./entities/Camera";
import IdGenerator from "./util/idGenerator";
import { Matrix, Vector } from "./util/math";

export default class Engine {
  private idGenerator = new IdGenerator();
  private gameObjects: Map<number, GameObject> = new Map();
  protected mainCamera: Camera;
  private projMatrix: Mat4x4 = Matrix.zeros();

  private penultimateFrameEndTime: number = 0;
  private prevFrameEndTime: number = 0;
  /** The interval in seconds from the last frame to the current one */
  private _deltaTime: number = 0;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private fpsDisplay: HTMLElement | null = null;

  get deltaTime() { return this._deltaTime; } // prettier-ignore

  constructor(canvas: HTMLCanvasElement, camera: Camera) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error(
        "ctx identifier is not supported, or the canvas has already been set to a different ctx mode"
      );
    this.ctx = ctx;
    this.mainCamera = camera;
  }

  // Main methods - used to interact with engine's workflow directly

  private async _CoreStart(): Promise<void> {
    for (const obj of this.gameObjects.values()) await obj.loadMesh();

    this.fpsDisplay = document.getElementById("fps");
    if (this.fpsDisplay) {
      this.fpsDisplay.style.position = "fixed";
      this.fpsDisplay.style.top = "0";
      this.fpsDisplay.style.color = "white";
    }

    this.initProjection();
  }

  /** Gets called once the program starts */
  Start(): void {}

  private _CoreUpdate(lastFrameEnd: number, frameId: number = 0): void {
    // generate last rendered frame
    this.clearScreen();
    this.render(frameId);

    // prepare for next frame render
    this.penultimateFrameEndTime = this.prevFrameEndTime;
    this.prevFrameEndTime = lastFrameEnd;
    // divide difference by 1000 to express delta in seconds not miliseconds
    this._deltaTime = (this.prevFrameEndTime - this.penultimateFrameEndTime) / 1000;

    this.Update();

    requestAnimationFrame((renderTime) => {
      if (this.fpsDisplay && frameId % 10 === 0)
        this.fpsDisplay.textContent = Math.floor(1000 / (renderTime - lastFrameEnd)) + " FPS";
      this._CoreUpdate(renderTime, ++frameId);
    });
  }

  /** Gets called every frame */
  Update(): void {}

  // Utility methods

  async run(): Promise<void> {
    await this._CoreStart();
    this.Start();
    this._CoreUpdate(0);
  }

  setResolution(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.initProjection();
  }

  clearScreen(color = "#000"): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addSceneMesh(mesh: GameObject): number {
    const meshId = this.idGenerator.id;
    this.gameObjects.set(meshId, mesh);
    return meshId;
  }

  drawTriangle(triangle: Triangle): void {
    this.ctx.beginPath();
    this.ctx.moveTo(triangle[0].x, triangle[0].y);
    this.ctx.lineTo(triangle[1].x, triangle[1].y);
    this.ctx.lineTo(triangle[2].x, triangle[2].y);
    this.ctx.closePath();

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#fff";
    this.ctx.stroke();
  }

  private initProjection(): void {
    const near = 0.1;
    const far = 1000;
    const aspectRatio = this.canvas.height / this.canvas.width;

    Matrix.makeProjection(this.projMatrix, this.mainCamera.fov, aspectRatio, near, far);
  }

  // Function to project 3D points to 2D screen coordinates
  project(vertex: Vec3D): Vec3D {
    const focalLength = 1000; // Adjust this for perspective
    return {
      x: (vertex.x * focalLength) / (vertex.z + focalLength),
      y: (vertex.y * focalLength) / (vertex.z + focalLength),
      z: vertex.z,
    };
  }

  // Function to draw a line between two projected 3D points
  drawLine(from: Vec3D, to: Vec3D) {
    const projectedFrom = this.project(from);
    const projectedTo = this.project(to);
    this.ctx.beginPath();
    this.ctx.moveTo(projectedFrom.x, projectedFrom.y);
    this.ctx.lineTo(projectedTo.x, projectedTo.y);
    this.ctx.lineWidth = 2;

    this.ctx.strokeStyle = "#fff";

    this.ctx.stroke();
  }

  private render(frameId: number): void {
    // console.log(this.deltaTime);
    // const matRotZ = Matrix.makeRotationZ(0);
    // const matRotX = Matrix.makeRotationX(0);

    const matWorld /*matTrans*/ = Matrix.makeTranslation(0, 0, 15);

    const up = { x: 0, y: 1, z: 0 };
    const targetDir = Vector.add(this.mainCamera.position, this.mainCamera.lookDir);

    const matCamera = Matrix.pointAt(this.mainCamera.position, targetDir, up);
    const matView = Matrix.quickInverse(matCamera);

    // let matWorld = Matrix.multiplyMatrix(matRotZ, matRotX); // Transform by rotation
    // matWorld = Matrix.multiplyMatrix(matWorld, matTrans); // Transform by translation

    for (const obj of this.gameObjects.values()) {
      for (const triangle of obj.mesh) {
        const triTransformed: Triangle4D = Array(3) as Triangle4D;
        triTransformed[0] = Matrix.multiplyVector(matWorld, { ...triangle[0], w: 1 });
        triTransformed[1] = Matrix.multiplyVector(matWorld, { ...triangle[1], w: 1 });
        triTransformed[2] = Matrix.multiplyVector(matWorld, { ...triangle[2], w: 1 });

        const triViewed = Array(3);
        triViewed[0] = Matrix.multiplyVector(matView, triTransformed[0]);
        triViewed[1] = Matrix.multiplyVector(matView, triTransformed[1]);
        triViewed[2] = Matrix.multiplyVector(matView, triTransformed[2]);

        const triProjected: Triangle4D = Array(3) as Triangle4D;
        triProjected[0] = Matrix.multiplyVector(this.projMatrix, triViewed[0]);
        triProjected[1] = Matrix.multiplyVector(this.projMatrix, triViewed[1]);
        triProjected[2] = Matrix.multiplyVector(this.projMatrix, triViewed[2]);

        const triangleNormalized: Triangle = Array(3) as Triangle;
        triangleNormalized[0] = Vector.divide(triProjected[0], triProjected[0].w);
        triangleNormalized[1] = Vector.divide(triProjected[1], triProjected[1].w);
        triangleNormalized[2] = Vector.divide(triProjected[2], triProjected[2].w);

        // Scale into view
        const offset = { x: 1, y: 1, z: 0 };
        triangleNormalized[0] = Vector.add(triangleNormalized[0], offset);
        triangleNormalized[1] = Vector.add(triangleNormalized[1], offset);
        triangleNormalized[2] = Vector.add(triangleNormalized[2], offset);
        triangleNormalized[0].x *= 0.5 * this.canvas.width;
        triangleNormalized[0].y *= 0.5 * this.canvas.height;
        triangleNormalized[1].x *= 0.5 * this.canvas.width;
        triangleNormalized[1].y *= 0.5 * this.canvas.height;
        triangleNormalized[2].x *= 0.5 * this.canvas.width;
        triangleNormalized[2].y *= 0.5 * this.canvas.height;
        this.drawTriangle(triangleNormalized);
        // this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        // this.drawLine(triTranslated[0], triTranslated[1]);
        // this.drawLine(triTranslated[1], triTranslated[2]);
        // this.drawLine(triTranslated[2], triTranslated[0]);
        // this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
      }
    }
  }
}
