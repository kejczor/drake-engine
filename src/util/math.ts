export function multiplyMatrixVector(i: Point3D, m: mat4x4) {
  let o = { x: 0, y: 0, z: 0 };
  o.x = i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + m[3][0];
  o.y = i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + m[3][1];
  o.z = i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + m[3][2];
  const w = i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + m[3][3];

  if (w != 0) {
    o.x /= w;
    o.y /= w;
    o.z /= w;
  }

  return o;
}

export function transpose<T>(m: T[][]) {
  return m[0].map((_v, i) => m.map((item) => item[i]));
}
