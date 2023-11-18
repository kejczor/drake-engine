import { multiplyMatrixVector } from "./util/math";

const FOV = 90; //in deg

export default class Renderer {
  private sceneMeshes: Mesh[];
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.sceneMeshes = [];
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error(
        "context identifier is not supported, or the canvas has already been set to a different context mode"
      );
    this.context = context;
  }

  setResolution(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear(hexColor = "#000") {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = hexColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addSceneMesh(obj: Mesh) {
    this.sceneMeshes.push(obj);
  }

  drawTriangle(triangle: Triangle) {
    this.context.beginPath();
    this.context.moveTo(triangle[0].x, triangle[0].y);
    this.context.lineTo(triangle[1].x, triangle[1].y);
    this.context.lineTo(triangle[2].x, triangle[2].y);
    this.context.closePath();

    this.context.lineWidth = 2;
    this.context.strokeStyle = "#fff";
    this.context.stroke();
  }

  render() {
    let matProj: mat4x4 = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    const fNear = 0.1;
    const fFar = 1000;
    const aspectRatio = this.canvas.height / this.canvas.width;
    const fovRad = 1 / Math.tan(((FOV * 0.5) / 180) * Math.PI);

    matProj[0][0] = aspectRatio * fovRad;
    matProj[1][1] = fovRad;
    matProj[2][2] = fFar / (fFar - fNear);
    matProj[3][2] = (-fFar * fNear) / (fFar - fNear);
    matProj[2][3] = 1;
    matProj[3][3] = 0;

    console.log("1");
    for (const obj of this.sceneMeshes) {
      for (const triangle of obj.mesh) {
        triangle[0].z += 3;
        triangle[1].z += 3;
        triangle[2].z += 3;

        const triProjected: Triangle = [
          multiplyMatrixVector(triangle[0], matProj),
          multiplyMatrixVector(triangle[1], matProj),
          multiplyMatrixVector(triangle[2], matProj),
        ];

        // Scale into view
        triProjected[0].x += 1;
        triProjected[0].y += 1;
        triProjected[1].x += 1;
        triProjected[1].y += 1;
        triProjected[2].x += 1;
        triProjected[2].y += 1;
        triProjected[0].x *= 0.5 * this.canvas.width;
        triProjected[0].y *= 0.5 * this.canvas.height;
        triProjected[1].x *= 0.5 * this.canvas.width;
        triProjected[1].y *= 0.5 * this.canvas.height;
        triProjected[2].x *= 0.5 * this.canvas.width;
        triProjected[2].y *= 0.5 * this.canvas.height;

        this.drawTriangle(triProjected);
      }
    }
  }
}
