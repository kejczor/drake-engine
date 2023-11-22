interface Point3D {
  x: number;
  y: number;
  z: number;
}

type Point3DTuple = [number, number, number];

interface Rotation {
  xAxis: number;
  yAxis: number;
  zAxis: number;
}

type TriangleVerteciesIndexes = [number, number, number];

type Triangle = [Point3D, Point3D, Point3D];

interface GameObject {
  position: Point3D;
  size: Point3D;
  rotation: Rotation;
  vertecies: Point3D[];
  mesh: Triangle[];
  loadMesh(): Promise<void>;
}

type mat4x4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];

/**
 * Rotation is defined in radian scale -> π = 180°
 */
// interface Rotation {
//   x: number;
//   y: number;
//   z: number;
// }
