export namespace Vector {
  export function add(vec1: Vec3D, vec2: Vec3D): Vec3D {
    return { x: vec1.x + vec2.x, y: vec1.y + vec2.y, z: vec1.z + vec2.z };
  }

  export function subtract(vec1: Vec3D, vec2: Vec3D): Vec3D {
    return { x: vec1.x - vec2.x, y: vec1.y - vec2.y, z: vec1.z - vec2.z };
  }

  export function multiply(vec: Vec3D, num: number): Vec3D {
    return { x: vec.x * num, y: vec.y * num, z: vec.z * num };
  }

  export function divide(vec: Vec3D, num: number): Vec3D {
    return { x: vec.x / num, y: vec.y / num, z: vec.z / num };
  }

  export function dotP(vec1: Vec3D, vec2: Vec3D): number {
    return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
  }

  export function length(vec: Vec3D): number {
    return Math.sqrt(Vector.dotP(vec, vec));
  }

  export function normalise(vec: Vec3D): Vec3D {
    const l = Vector.length(vec);
    return Vector.divide(vec, l);
  }

  export function crossP(vec1: Vec3D, vec2: Vec3D): Vec3D {
    return {
      x: vec1.y * vec2.z - vec1.z * vec2.y,
      y: vec1.z * vec2.x - vec1.x * vec2.z,
      z: vec1.x * vec2.y - vec1.y * vec2.x,
    };
  }
}

export namespace Matrix {
  export function zeros(): Mat4x4 {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  export function multiplyVector(m: Mat4x4, i: Vec4D): Vec4D {
    const v: Vec4D = { x: 0, y: 0, z: 0, w: 0 };
    v.x = i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + i.w * m[3][0];
    v.y = i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + i.w * m[3][1];
    v.z = i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + i.w * m[3][2];
    v.w = i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + i.w * m[3][3];
    return v;
  }

  export function makeIdentity(): Mat4x4 {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  }

  export function makeRotationX(angleRad: number): Mat4x4 {
    const matrix = Matrix.zeros();
    matrix[0][0] = 1;
    matrix[1][1] = Math.cos(angleRad);
    matrix[1][2] = Math.sin(angleRad);
    matrix[2][1] = -Math.sin(angleRad);
    matrix[2][2] = Math.cos(angleRad);
    matrix[3][3] = 1;
    return matrix;
  }

  export function makeRotationY(angleRad: number): Mat4x4 {
    const matrix = Matrix.zeros();
    matrix[0][0] = Math.cos(angleRad);
    matrix[0][2] = Math.sin(angleRad);
    matrix[2][0] = -Math.sin(angleRad);
    matrix[1][1] = 1;
    matrix[2][2] = Math.cos(angleRad);
    matrix[3][3] = 1;
    return matrix;
  }

  export function makeRotationZ(angleRad: number): Mat4x4 {
    const matrix = Matrix.zeros();
    matrix[0][0] = Math.cos(angleRad);
    matrix[0][1] = Math.sin(angleRad);
    matrix[1][0] = -Math.sin(angleRad);
    matrix[1][1] = Math.cos(angleRad);
    matrix[2][2] = 1;
    matrix[3][3] = 1;
    return matrix;
  }

  export function makeTranslation(x: number, y: number, z: number): Mat4x4 {
    const matrix = Matrix.zeros();
    matrix[0][0] = 1;
    matrix[1][1] = 1;
    matrix[2][2] = 1;
    matrix[3][3] = 1;
    matrix[3][0] = x;
    matrix[3][1] = y;
    matrix[3][2] = z;
    return matrix;
  }

  export function makeProjection(m: Mat4x4, fov: number, aspectRatio: number, near: number, far: number) {
    const fovRad = 1 / Math.tan(((fov * 0.5) / 180) * Math.PI);
    m[0][0] = aspectRatio * fovRad;
    m[1][1] = fovRad;
    m[2][2] = far / (far - near);
    m[3][2] = (-far * near) / (far - near);
    m[2][3] = 1;
  }

  export function multiplyMatrix(m1: Mat4x4, m2: Mat4x4): Mat4x4 {
    const matrix = Matrix.zeros();
    for (let c = 0; c < 4; c++)
      for (let r = 0; r < 4; r++)
        matrix[r][c] = m1[r][0] * m2[0][c] + m1[r][1] * m2[1][c] + m1[r][2] * m2[2][c] + m1[r][3] * m2[3][c];
    return matrix;
  }

  export function pointAt(pos: Vec3D, target: Vec3D, up: Vec3D): Mat4x4 {
    // Calculate new forward direction
    let newForward = Vector.subtract(target, pos);
    newForward = Vector.normalise(newForward);

    // Calculate new Up direction
    const a = Vector.multiply(newForward, Vector.dotP(up, newForward));
    let newUp = Vector.subtract(up, a);
    newUp = Vector.normalise(newUp);

    // New Right direction is easy, its just cross product
    const newRight = Vector.crossP(newUp, newForward);

    // Construct Dimensioning and Translation Matrix
    const matrix = Matrix.zeros();

    matrix[0][0] = newRight.x;
    matrix[0][1] = newRight.y;
    matrix[0][2] = newRight.z;
    matrix[0][3] = 0;
    matrix[1][0] = newUp.x;
    matrix[1][1] = newUp.y;
    matrix[1][2] = newUp.z;
    matrix[1][3] = 0;
    matrix[2][0] = newForward.x;
    matrix[2][1] = newForward.y;
    matrix[2][2] = newForward.z;
    matrix[2][3] = 0;
    matrix[3][0] = pos.x;
    matrix[3][1] = pos.y;
    matrix[3][2] = pos.z;
    matrix[3][3] = 1;
    return matrix;
  }

  export function quickInverse(m: Mat4x4): Mat4x4 {
    // Only for Rotation/Translation Matrices
    const matrix = Matrix.zeros();
    matrix[0][0] = m[0][0];
    matrix[0][1] = m[1][0];
    matrix[0][2] = m[2][0];
    matrix[0][3] = 0;
    matrix[1][0] = m[0][1];
    matrix[1][1] = m[1][1];
    matrix[1][2] = m[2][1];
    matrix[1][3] = 0;
    matrix[2][0] = m[0][2];
    matrix[2][1] = m[1][2];
    matrix[2][2] = m[2][2];
    matrix[2][3] = 0;
    matrix[3][0] = -(m[3][0] * matrix[0][0] + m[3][1] * matrix[1][0] + m[3][2] * matrix[2][0]);
    matrix[3][1] = -(m[3][0] * matrix[0][1] + m[3][1] * matrix[1][1] + m[3][2] * matrix[2][1]);
    matrix[3][2] = -(m[3][0] * matrix[0][2] + m[3][1] * matrix[1][2] + m[3][2] * matrix[2][2]);
    matrix[3][3] = 1;
    return matrix;
  }
}

export function transpose<T>(m: T[][]): T[][] {
  return m[0].map((_item, i) => m.map((item) => item[i]));
}
