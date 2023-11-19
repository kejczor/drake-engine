import IdGenerator from "./util/idGenerator";
import { multiplyMatrixVector } from "./util/math";

const FOV = Math.PI / 2; // deg

export default class Engine {
  private idGenerator = new IdGenerator();
  private sceneMeshes: Map<number, Mesh> = new Map();
  private projMatrix: mat4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  private penultimateFrameEndTime: number = 0;
  private prevFrameEndTime: number = 0;
  /** The interval in seconds from the last frame to the current one */
  deltaTime: number = 0;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error(
        "ctx identifier is not supported, or the canvas has already been set to a different ctx mode"
      );
    this.ctx = ctx;
  }

  // Main methods - used to interact with engine's workflow directly

  private async _CoreStart(): Promise<void> {
    for (const obj of this.sceneMeshes.values()) await obj.loadMesh();

    this.initProjection();
  }

  /** Gets called once the program starts */
  Start(): void {}

  private _CoreUpdate(lastFrameEnd: number): void {
    // generate last rendered frame
    this.clearScreen();
    this.render();

    // prepare for next frame render
    this.penultimateFrameEndTime = this.prevFrameEndTime;
    this.prevFrameEndTime = lastFrameEnd;
    // divide difference by 1000 to express delta in seconds not miliseconds
    this.deltaTime = (this.prevFrameEndTime - this.penultimateFrameEndTime) / 1000;

    this.Update();

    requestAnimationFrame((renderTime) => this._CoreUpdate(renderTime));
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

  addSceneMesh(mesh: Mesh): number {
    const meshId = this.idGenerator.id;
    this.sceneMeshes.set(meshId, mesh);
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
    const fNear = 0.1;
    const fFar = 1000;
    const aspectRatio = this.canvas.height / this.canvas.width;
    const fovRad = 1 / Math.tan(FOV / 2);

    this.projMatrix[0][0] = aspectRatio * fovRad;
    this.projMatrix[1][1] = fovRad;
    this.projMatrix[2][2] = fFar / (fFar - fNear);
    this.projMatrix[3][2] = (-fFar * fNear) / (fFar - fNear);
    this.projMatrix[2][3] = 1;
    this.projMatrix[3][3] = 0;
  }

  // Function to project 3D points to 2D screen coordinates
  project(vertex: Point3D): Point3D {
    const focalLength = 500; // Adjust this for perspective
    return {
      x: (vertex.x * focalLength) / (vertex.z + focalLength),
      y: (vertex.y * focalLength) / (vertex.z + focalLength),
      z: vertex.z,
    };
  }

  // Function to draw a line between two projected 3D points
  drawLine(from: Point3D, to: Point3D) {
    const projectedFrom = this.project(from);
    const projectedTo = this.project(to);
    this.ctx.beginPath();
    this.ctx.moveTo(projectedFrom.x, projectedFrom.y);
    this.ctx.lineTo(projectedTo.x, projectedTo.y);
    this.ctx.lineWidth = 2;

    this.ctx.strokeStyle = "#fff";

    this.ctx.stroke();
  }

  private render(): void {
    for (const obj of this.sceneMeshes.values()) {
      for (const triangle of obj.mesh) {
        // const triProjected: Triangle = [
        //   multiplyMatrixVector(triangle[0], this.projMatrix),
        //   multiplyMatrixVector(triangle[1], this.projMatrix),
        //   multiplyMatrixVector(triangle[2], this.projMatrix),
        // ];
        // // Scale into view
        // triProjected[0].x += 1;
        // triProjected[0].y += 1;
        // triProjected[1].x += 1;
        // triProjected[1].y += 1;
        // triProjected[2].x += 1;
        // triProjected[2].y += 1;
        // triProjected[0].x *= 0.5 * this.canvas.width;
        // triProjected[0].y *= 0.5 * this.canvas.height;
        // triProjected[1].x *= 0.5 * this.canvas.width;
        // triProjected[1].y *= 0.5 * this.canvas.height;
        // triProjected[2].x *= 0.5 * this.canvas.width;
        // triProjected[2].y *= 0.5 * this.canvas.height;
        // this.drawTriangle(triProjected);
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.drawLine(triangle[0], triangle[1]);
        this.drawLine(triangle[1], triangle[2]);
        this.drawLine(triangle[2], triangle[0]);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
      }
    }
  }
}
