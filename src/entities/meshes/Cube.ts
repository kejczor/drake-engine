import { multiplyMatrixVector } from "../../util/math";
import { generateCube } from "../../util/mesh";

export default class Cube implements Mesh {
  private _mesh: Triangle[];
  private _position: Point3D;
  private _size: Point3D;

  constructor(x = 0, y = 0, z = 0, xSize = 1, ySize = 1, zSize = 1) {
    this._mesh = generateCube(x, y, z, xSize, ySize, zSize);
    this._position = { x, y, z };
    this._size = { x: xSize, y: ySize, z: zSize };
  }

  get mesh() {
    return this._mesh;
  }
  get position() {
    return this._position;
  }
  get size() {
    return this._size;
  }

  /** Moves the cube relatively, if you need to move it absolutely use the `setPosition` method */
  move(x: number, y: number, z: number): void {
    // translate the mesh based on old position
    for (const triangle of this._mesh) {
      for (const vertex of triangle) {
        vertex.x += x;
        vertex.y += y;
        vertex.z += z;
      }
    }
    this._position = { x, y, z: this._position.z + z };
  }

  /** Rotates the cube relatively, if you need to set its absolute rotation use the `setRotation` method */
  rotate(xAxis: number, yAxis: number, zAxis: number): void {
    const rotZMatrix: mat4x4 = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    const rotXMatrix: mat4x4 = structuredClone(rotZMatrix);

    // Rotation X
    rotXMatrix[0][0] = 1;
    rotXMatrix[1][1] = Math.cos(xAxis);
    rotXMatrix[1][2] = Math.sin(xAxis);
    rotXMatrix[2][1] = -Math.sin(xAxis);
    rotXMatrix[2][2] = Math.cos(xAxis);
    rotXMatrix[3][3] = 1;

    // Rotation Z
    rotZMatrix[0][0] = Math.cos(zAxis);
    rotZMatrix[0][1] = Math.sin(zAxis);
    rotZMatrix[1][0] = -Math.sin(zAxis);
    rotZMatrix[1][1] = Math.cos(zAxis);
    rotZMatrix[2][2] = 1;
    rotZMatrix[3][3] = 1;

    for (let triangle of this._mesh) {
      for (let vertex of triangle) {
        const zRotated = multiplyMatrixVector(vertex, rotZMatrix);
        const zxRotated = multiplyMatrixVector(zRotated, rotXMatrix);
        vertex.x = zxRotated.x;
        vertex.y = zxRotated.y;
        vertex.z = zxRotated.z;
      }
    }
  }
}
