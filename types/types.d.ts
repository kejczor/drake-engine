interface Point3D {
  x: number;
  y: number;
  z: number;
}

type TriangleVerteciesIndexes = [number, number, number];

type Triangle = [Point3D, Point3D, Point3D];

interface Mesh {
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
