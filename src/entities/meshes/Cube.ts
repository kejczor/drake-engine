export default class Cube implements Mesh {
  mesh: Triangle[];
  private position: Point3D;
  private sizes: Point3D;

  constructor(x = 0, y = 0, z = 0, xSize = 1, ySize = 1, zSize = 1) {
    this.mesh = [
      // z before
      [
        { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
        { x: -xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
        { x: -xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
      ],
      [
        { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
        { x: +xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
        { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
      ],
      // z after
      [
        { x: -xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
        { x: -xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
        { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
      ],
      [
        { x: -xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
        { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
        { x: +xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
      ],
      // x before
      [
        { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
        { x: -xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
        { x: -xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
      ],
      [
        { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
        { x: -xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
        { x: -xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
      ],
      // x after
      [
        { x: +xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
        { x: +xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
        { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
      ],
      [
        { x: +xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
        { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
        { x: +xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
      ],
      // y before
      [
        { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
        { x: -xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
        { x: +xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
      ],
      [
        { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
        { x: +xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
        { x: +xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
      ],
      // y after
      [
        { x: -xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
        { x: -xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
        { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
      ],
      [
        { x: -xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
        { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
        { x: +xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
      ],
    ];
    this.position = { x, y, z };
    this.sizes = { x: xSize, y: ySize, z: zSize };
  }
}
