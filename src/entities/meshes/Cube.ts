import { readObjFile } from "../../util/fs";
import { multiplyMatrixVector } from "../../util/math";

export default class Cube implements Mesh {
  private _meshIndexed: TriangleVerteciesIndexes[] = [];
  private _vertecies: Point3D[] = [];
  private _position: Point3D;
  private _size: Point3D;

  constructor(x = 0, y = 0, z = 0, xSize = 1, ySize = 1, zSize = 1) {
    // this._mesh = generateCube(x, y, z, xSize, ySize, zSize);
    this._position = { x, y, z };
    this._size = { x: xSize, y: ySize, z: zSize };
  }

  get mesh() {
    return this._meshIndexed.map((triVerIdx) => triVerIdx.map((i) => this._vertecies[i]) as Triangle);
  }
  get vertecies() {
    return this._vertecies;
  }
  get position() {
    return this._position;
  }
  get size() {
    return this._size;
  }

  async loadMesh(): Promise<void> {
    console.log("starting loading Cube mesh...");
    const { verPos, triVerIdx } = await readObjFile("/objects/cube.obj");
    this._vertecies = verPos;
    this._meshIndexed = triVerIdx;
    console.log("applying initial position and scale...");
    if (Object.values(this._position).some((pos) => pos !== 0)) {
      const { x, y, z } = this._position;
      this.move(x, y, z);
    }
    console.log("finished loading Cube mesh! loaded triangles:", this._meshIndexed.length);
  }

  /** Moves the cube relatively, if you need to move it absolutely use the `setPosition` method */
  move(x: number, y: number, z: number): void {
    for (const vertex of this._vertecies) {
      vertex.x += x;
      vertex.y += y;
      vertex.z += z;
    }
    this._position = { x, y, z: this._position.z + z };
  }

  scale(x: number, y: number, z: number) {
    console.log(this.mesh);
    for (const vertex of this._vertecies) {
      console.log("prev", vertex.x);
      vertex.x *= x;
      console.log(vertex.x);
      vertex.y *= y;
      // vertex.z *= z;
    }
    this._size = { x, y, z };
    console.log(this.mesh);
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

    for (let triangle of this._meshIndexed) {
      for (let vIndex of triangle) {
        const zRotated = multiplyMatrixVector(this._vertecies[vIndex], rotZMatrix);
        const zxRotated = multiplyMatrixVector(zRotated, rotXMatrix);
        this._vertecies[vIndex].x = zxRotated.x;
        this._vertecies[vIndex].y = zxRotated.y;
        this._vertecies[vIndex].z = zxRotated.z;
      }
    }
  }
}
