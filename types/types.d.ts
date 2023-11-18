interface Point3D {
  x: number;
  y: number;
  z: number;
}

type Triangle = [Point3D, Point3D, Point3D];

interface Mesh {
  mesh: Triangle[];
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
